# DAS — Documento de Arquitetura de Software

> Módulo 8: Gestão de Contratos e Atas de Registro de Preço

**Última atualização:** Maio/2026
**Equipe:** Érika, Fabiane, Geórgia, Giovana e Hanna
**Épicos cobertos:** Épicos 1 a 4

---

## Sumário

- [1. Representação Arquitetural](#1-representação-arquitetural)
- [2. Visão Lógica — Componentes](#2-visão-lógica--componentes)
- [3. Visão Física — Implantação](#3-visão-física--implantação)
- [4. Atributos de Qualidade](#4-atributos-de-qualidade)
- [5. Decisões Técnicas Pendentes](#5-decisões-técnicas-pendentes)
- [6. Mapeamento de Épicos × Componentes](#6-mapeamento-de-épicos--componentes)

---

## 1. Representação Arquitetural

| Item | Decisão |
|---|---|
| **Linguagem** | JavaScript |
| **Persistência** | Supabase — PostgreSQL como serviço (DBaaS) |
| **Autenticação** | Supabase Auth |
| **Padrão** | Cliente-Servidor com API REST |
| **Integração externa** | Portal da Transparência (API pública) |

**Resumo do padrão:** o backend atua como núcleo de processamento — compara documentos, integra com o Portal da Transparência e expõe uma API REST para o frontend. O Supabase gerencia os dados e a autenticação, sem necessidade de infraestrutura própria de banco de dados.

---

## 2. Visão Lógica — Componentes

### Diagrama

> Arquivo fonte: [`diagrams/componentes.jpeg`](diagrams/componentes.jpeg)

```
┌──────────────────────────────────────────────────────┐
│                  BACKEND (Java / JS)                  │
│                                                       │
│  ┌───────────────────┐   ┌───────────────────────┐   │
│  │  Java Auth        │   │  Processador de Docs  │   │
│  │  Service          │   │  (Minuta × Edital)    │   │
│  │  ↕ Supabase Auth  │   │  → Épico 1            │   │
│  └───────────────────┘   └───────────────────────┘   │
│                                                       │
│  ┌───────────────────┐   ┌───────────────────────┐   │
│  │  Integrador       │   │  Supabase Client      │   │
│  │  Portal           │   │  (camada de dados)    │   │
│  │  → Épico 2        │   │  ↕ PostgreSQL         │   │
│  └───────────────────┘   └───────────────────────┘   │
└──────────────────────────────────────────────────────┘
         ↑ API REST                   ↑ JDBC / REST
         │                            │
   [Frontend]               [Supabase Cloud]
```

### Responsabilidades dos Componentes

| Componente | Responsabilidade |
|---|---|
| **Java Auth Service** | Gerencia login e sessão via Supabase Auth |
| **Processador de Docs** | Lógica de comparação entre Minuta e Edital (Épico 1) |
| **Integrador Portal** | Consome dados do Portal da Transparência — empenhos, pagamentos (Épico 2) |
| **Supabase Client** | Camada de abstração para comunicação com o PostgreSQL via Supabase |

---

## 3. Visão Física — Implantação

### Diagrama

> Arquivo fonte: [`diagrams/implantacao.jpeg`](diagrams/implantacao.jpeg)

```
┌──────────────────────┐         ┌───────────────────────────┐
│  Nó: Cliente         │  HTTPS  │  Nó: Servidor de Aplicação│
│  (Navegador/Desktop) │◄───────►│  Java Runtime             │
│                      │  REST   │  gestao-contratos.jar     │
└──────────────────────┘         └──────────┬────────────────┘
                                            │
                    ┌───────────────────────┴──────────────────────┐
                    │                                              │
       ┌────────────▼──────────────┐             ┌────────────────▼────────────┐
       │  Nó: Cloud Supabase       │             │  Nó: Portal da Transparência │
       │  (Externo — DBaaS)        │             │  (Externo)                   │
       │                           │             │                              │
       │  PostgreSQL               │             │  API pública REST            │
       │  ├─ tabela: contratos     │             │  consumida pelo backend      │
       │  └─ tabela: pagamentos    │             │                              │
       │  Realtime / Auth          │             └──────────────────────────────┘
       └───────────────────────────┘
```

### Descrição dos Nós

| Nó | Artefato / Serviço | Protocolo |
|---|---|---|
| Cliente (navegador/desktop) | Interface do usuário | HTTPS |
| Servidor de Aplicação | `gestao-contratos.jar` — lógica de negócio e comparação de docs | REST |
| Cloud Supabase | PostgreSQL + Auth + Realtime | JDBC ou API REST |
| Portal da Transparência | API pública de dados governamentais | HTTPS / REST |

---

## 4. Atributos de Qualidade

| Atributo | Estratégia |
|---|---|
| **Escalabilidade** | Supabase gerencia o crescimento do volume de dados sem necessidade de infraestrutura própria de BD |
| **Segurança** | Row Level Security (RLS) do PostgreSQL via Supabase — cada usuário acessa apenas os contratos da sua própria organização |
| **Disponibilidade** | Infraestrutura gerenciada pelo Supabase com backups automáticos |
| **Tempo de Resposta** | Processamento de comparação de documentos no backend; respostas paginadas para grandes volumes (RNF-4) |
| **Backup** | Backups periódicos automáticos via Supabase (RNF-2) |

---

## 5. Decisões Técnicas Pendentes

- [ ] **Conexão Java ↔ Supabase:** via JDBC direto (mais comum em Java) ou API REST do Supabase?
- [ ] **Linguagem final:** Java ou JavaScript? — depende de alinhamento com os demais grupos
- [ ] **Mapeamento de tabelas do Épico 1:** estrutura da tabela `documentos` (campos, relacionamentos)
- [ ] **Mapeamento de tabelas do Épico 2:** estrutura da tabela `pagamentos` (campos, relacionamentos)
- [ ] **Geração dos diagramas PlantUML:** exportar `.puml` → PNG/SVG e versionar em `docs/diagrams/`

---

## 6. Mapeamento de Épicos × Componentes

| Épico | Funcionalidade | Componente Responsável |
|---|---|---|
| Épico 1 | Comparação Minuta × Edital e Relatório de Divergências (RF-1, RF-2) | Processador de Docs |
| Épico 2 | Monitoramento de Pagamentos via Portal da Transparência (RF-6) | Integrador Portal |
| Épico 3 | Resumo do contrato, alertas e armazenamento de anexos (RF-3, RF-4, RF-5) | Supabase Client + Backend |
| Épico 4 | Gestão de tarefas, anotações e filtros de status (RF-7, RF-8) | Supabase Client + Backend |
