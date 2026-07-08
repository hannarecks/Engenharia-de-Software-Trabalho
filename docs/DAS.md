# DAS — Documento de Arquitetura de Software

> Módulo 8: Gestão de Contratos e Atas de Registro de Preço

**Épicos cobertos:** Épicos 1 a 4

---

## Sumário

- [1. Representação Arquitetural](#1-representação-arquitetural)
- [2. Visão Lógica — Componentes](#2-visão-lógica--componentes)
- [3. Visão Física — Implantação](#3-visão-física--implantação)
- [4. Atributos de Qualidade](#4-atributos-de-qualidade)
- [5. Decisões Técnicas](#5-decisões-técnicas)
- [6. Mapeamento de Épicos × Componentes](#6-mapeamento-de-épicos--componentes)

---

## 1. Representação Arquitetural

| Item | Decisão |
|---|---|
| **Linguagem / Framework** | JavaScript — Vue 2 + Vuetify (SPA) |
| **Persistência** | Supabase — PostgreSQL como serviço (BaaS) |
| **Autenticação** | Supabase Auth (e-mail/senha) |
| **Padrão** | SPA cliente ↔ BaaS — **sem servidor de aplicação próprio** |
| **Armazenamento de arquivos** | Supabase Storage (bucket `contract-documents`) |
| **Integração externa** | Portal da Transparência de Santa Cruz do Sul/RS — **ainda não integrado de fato** (ver seção 5) |

**Resumo do padrão:** diferente do que versões anteriores deste documento previam, o projeto **não tem um backend próprio** (nem Java, nem Node.js). O frontend Vue fala diretamente com o Supabase através do cliente `@supabase/supabase-js`, que consome a API REST gerada automaticamente pelo PostgreSQL (PostgREST). A autorização por linha (RLS) garante que cada usuário só acesse os próprios contratos, e regras de negócio que não dá pra garantir só com `CHECK`/RLS (como a sequência obrigatória do ciclo de pagamento) são aplicadas por **triggers no próprio banco**, não em uma camada de backend.

---

## 2. Visão Lógica — Componentes

### Diagrama

> Arquivo fonte: [`diagrams/diagramaComponentes.puml`](diagrams/diagramaComponentes.puml) · Imagem: [`diagrams/componentes.jpeg`](diagrams/componentes.jpeg)

```
┌───────────────────────────────────────────────────────────────────┐
│                  FRONTEND — SPA Vue 2 + Vuetify                   │
│                                                                    │
│  Views: TabOverview (Editais+Cadastro) · TabDivergencias ·        │
│         TabPagamentos · TabAlertas · TabTarefas(mock) ·           │
│         TabCompare(mock) · Login                                  │
│                              ↓                                    │
│  Vuex Store: auth · contratos · divergencias · pagamentos ·       │
│              documentos · alertas                                 │
│                              ↓                                    │
│  Services: auth.js · contratos.js · divergencias.js ·             │
│            pagamentos.js · documentos.js · alertas.js ·           │
│            portalTransparencia.js (mockado) → supabase.js         │
└───────────────────────────────┬────────────────────────────────────┘
                                 │ @supabase/supabase-js
                                 ▼
                     ┌───────────────────────────┐        ┌───────────────────────┐
                     │      Supabase Cloud       │        │ Portal da Transparência│
                     │  PostgreSQL (mod8_*)      │        │  (Santa Cruz do Sul)   │
                     │  + RLS + triggers         │        │  <<external>>          │
                     │  Auth · Storage           │        │  ainda não integrado   │
                     └───────────────────────────┘        └───────────────────────┘
```

### Responsabilidades dos Componentes

| Componente | Responsabilidade |
|---|---|
| **Views (Vue)** | Telas da aplicação (`src/views`). Renderizam dados vindos da store e disparam *actions* |
| **Vuex Store** (`src/store/modules`) | Estado da aplicação por domínio (`auth`, `contratos`, `divergencias`, `pagamentos`, `documentos`, `alertas`); cada módulo expõe *getters*/*actions* e chama a camada de serviço |
| **Services** (`src/services`) | Funções finas que só encapsulam chamadas ao `supabase-js` (`select`/`insert`/`update`) — não existe camada de API própria |
| **`supabase.js`** | Instancia o cliente Supabase com a URL e a `anon key` do projeto (variáveis de ambiente) |
| **Supabase PostgreSQL** | Guarda as tabelas `mod8_*` (contrato, documento, divergência, pagamento + histórico, alerta, contract_documents, document_comparisons); aplica RLS e os triggers `mod8_valida_sequencia_pagamento` e `mod8_registra_historico_pagamento` |
| **Supabase Auth** | Login/sessão (e-mail e senha) |
| **Supabase Storage** | Guarda os PDFs enviados no cadastro de contrato (bucket `contract-documents`) |
| **Portal da Transparência** | Fonte de dados de empenho/pagamento (RF-6). **Hoje simulado** em `portalTransparencia.js` — o portal do município não tem API pública documentada (ver comentário no próprio arquivo) |

---

## 3. Visão Física — Implantação

### Diagrama

> Arquivo fonte: [`diagrams/diagramaImplantação.puml`](diagrams/diagramaImplanta%C3%A7%C3%A3o.puml) · Imagem: [`diagrams/implantacao.jpeg`](diagrams/implantacao.jpeg)

```
┌──────────────────────┐   HTTPS / REST (PostgREST) + RLS + JWT   ┌───────────────────────────┐
│  Nó: Cliente          │ ────────────────────────────────────────►│  Cloud: Supabase          │
│  (Navegador)          │                                          │  PostgreSQL (mod8_*)      │
│  SPA Vue 2 (build     │                                          │  Auth · Storage           │
│  estático, servido    │                                          │  RLS + Triggers           │
│  como arquivos         │                                         └───────────────────────────┘
│  estáticos)           │
└──────────┬────────────┘
           │ (integração ainda não implementada — hoje mockada)
           ▼
┌──────────────────────────────┐
│  Portal da Transparência     │
│  de Santa Cruz do Sul/RS     │
│  <<external>>                │
└──────────────────────────────┘
```

**Não existe** nó de "servidor de aplicação": não há processo Node.js/Java rodando em produção, nem deploy em Vercel/Railway — o SPA é só um conjunto de arquivos estáticos (gerado por `npm run build`) que, uma vez hospedado em qualquer lugar (ou rodando local via `npm run serve`), conversa diretamente com o Supabase Cloud pela internet.

### Descrição dos Nós

| Nó | Artefato / Serviço | Protocolo |
|---|---|---|
| Cliente (navegador) | SPA Vue 2 (build estático) | HTTPS |
| Supabase Cloud | PostgreSQL + Auth + Storage, com RLS e triggers | REST (PostgREST) |
| Portal da Transparência (externo) | Hoje simulado no frontend — sem API pública confirmada | — (não implementado) |

---

## 4. Atributos de Qualidade

| Atributo | Estratégia |
|---|---|
| **Escalabilidade** | Supabase gerencia o crescimento do volume de dados sem necessidade de infraestrutura própria de BD |
| **Segurança** | Row Level Security (RLS) do PostgreSQL via Supabase — cada usuário acessa apenas os próprios contratos (`auth.uid() = id_usuario`, propagado às tabelas filhas via `EXISTS`) |
| **Integridade** | Regras que RLS/CHECK não cobrem (ex.: não concluir uma etapa do ciclo de pagamento sem a anterior estar concluída) são garantidas por *trigger* no banco (`mod8_valida_sequencia_pagamento`), não apenas no frontend |
| **Auditoria** | Toda mudança de status em `mod8_pagamento` é registrada automaticamente em `mod8_pagamento_historico` via trigger (`mod8_registra_historico_pagamento`) |
| **Disponibilidade** | Infraestrutura gerenciada pelo Supabase, com backups automáticos |
| **Tempo de Resposta** | Consultas filtradas por `id_contrato_m8`/`id_usuario`; sem paginação implementada ainda (RNF-4 segue pendente para volumes maiores) |
| **Backup** | Backups periódicos automáticos via Supabase (RNF-2) |

---

## 5. Decisões Técnicas

Decisões já tomadas e implementadas (substituem a antiga seção "Pendentes"):

- ✅ **Linguagem/framework definidos:** JavaScript, com Vue 2 + Vuetify no frontend. Não há Java em nenhuma parte do projeto.
- ✅ **Conexão com o banco:** direto do frontend via `@supabase/supabase-js` (REST/PostgREST), sem backend próprio nem JDBC.
- ✅ **Schema das tabelas** de todos os épicos do módulo já criado e versionado (`mod8_schema.sql`): `mod8_contrato`, `mod8_documento`, `mod8_divergencia`, `mod8_pagamento` (+ `mod8_pagamento_historico`), `mod8_alerta`, além de `mod8_contract_documents` e `mod8_document_comparisons` (ver abaixo).


Ainda em aberto:

- ⏳ **Gestão de Tarefas (RF-7/RF-8, Could have):** `mod8_tarefa`/`mod8_anotacao` ainda não têm tabela — `TabTarefas.vue` continua usando dados mockados, por decisão do time (ver notas no `mod8_schema.sql`).
- ⏳ **Paginação/performance para grandes volumes (RNF-4):** ainda não implementada.

---

## 6. Mapeamento de Épicos × Componentes

| Épico | Funcionalidade | Componente Responsável |
|---|---|---|
| Épico 1 | Comparação Minuta × Edital e Relatório de Divergências (RF-1, RF-2) | Store/Service `divergencias` (conectado) + `mod8_contract_documents`/`mod8_document_comparisons` (schema pronto, tela `TabCompare.vue` ainda não conectada) |
| Épico 2 | Monitoramento de Pagamentos via Portal da Transparência (RF-6) | Store/Service `pagamentos` (ciclo de pagamento conectado ao banco) + `portalTransparencia.js` (mockado) |
| Épico 3 | Resumo do contrato, alertas e armazenamento de anexos (RF-3, RF-4, RF-5) | Store/Service `contratos`, `documentos` e `alertas` (conectados ao Supabase) |
| Épico 4 | Gestão de tarefas, anotações e filtros de status (RF-7, RF-8) | `TabTarefas.vue` — ainda mockado (Could have, sem tabela) |
