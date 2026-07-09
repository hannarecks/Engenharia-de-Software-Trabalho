# Módulo 8 — Gestão de Contratos e Atas de Registro de Preço

> Sistema SaaS de apoio a empresas em processos licitatórios, com foco na gestão e acompanhamento de contratos pós-certame.

[![Trello](https://img.shields.io/badge/Trello-0079BF?style=for-the-badge&logo=trello&logoColor=white)](https://trello.com/b/TZFDmRAc/es-modulo-8)

---

## 📑 Sumário

- [Sobre o Projeto](#sobre-o-projeto)
- [Documentação](#documentação)
- [Tecnologias](#tecnologias)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Equipe](#equipe)

---

## Sobre o Projeto

Este módulo é parte de um sistema **SaaS** voltado ao apoio de empresas em processos licitatórios. O **Módulo 8** cobre a **gestão e acompanhamento de contratos** após a vitória no certame — desde a comparação de documentos e geração de relatórios de divergências até o monitoramento financeiro via Portal da Transparência.

O processo licitatório termina com a adjudicação e homologação; é exatamente aí que este módulo entra:

```
Adjudicação & Homologação
         ↓
► MÓDULO 8: Gestão de Contratos ◄
    ├── Comparação de documentos
    ├── Relatório de divergências
    ├── Monitoramento de pagamentos
    └── Alertas e gestão de tarefas
```

---

## Documentação

| Documento | Descrição |
|---|---|
| [📋 Visão e Requisitos](docs/visao-requisitos.md) | Contexto, RF, RNF, MoSCoW, escopo e restrições |
| [🏗️ Arquitetura (DAS)](docs/DAS.md) | Componentes, diagramas de implantação e decisões técnicas |

---

## Tecnologias

| Tecnologia | Uso |
|---|---|
| Vue 2 + Vuetify | Frontend (SPA) — não há backend/API própria; o frontend fala direto com o Supabase |
| Vuex + Vue Router | Gerência de estado e navegação do SPA |
| Supabase | BaaS — PostgreSQL + Auth + Storage, consumido via `@supabase/supabase-js` |
| PostgreSQL | Banco de dados relacional (via Supabase), com RLS e triggers para regras de negócio |
| Portal da Transparência | Fonte de dados de empenho/pagamento (RF-6) — **ainda simulado**, pois o portal do município não tem API pública documentada |
| PlantUML | Geração de diagramas de arquitetura |

---

## Estrutura do Projeto

Não existe backend próprio: o frontend (Vue) fala direto com o Supabase. A árvore abaixo reflete o projeto real em `modulo_8/`:

```
modulo_8/
├── docs/                                (na raiz do repo)
│   ├── visao-requisitos.md
│   ├── DAS.md
│   └── diagrams/
│       ├── diagramaComponentes.puml
│       ├── diagramaImplantação.puml
│       ├── componentes.jpeg
│       └── implantacao.jpeg
├── mod8_schema.sql                       # Schema das tabelas do módulo
├── mod8_seed_teste.sql                   # Dados de teste (seed)
├── src/
│   ├── views/                            # Telas (Vue components)
│   │   ├── TabOverview.vue               # Editais ganhos + cadastro de contrato
│   │   ├── TabDivergencias.vue
│   │   ├── TabPagamentos.vue
│   │   ├── TabAlertas.vue
│   │   ├── TabTarefas.vue                # Could have — ainda mockado
│   │   ├── TabCompare.vue                # Ainda não conectado ao banco
│   │   └── login.vue
│   ├── components/
│   │   ├── AppSidebar.vue
│   │   ├── ContratoModal.vue
│   │   ├── CadastroContratoModal.vue
│   │   └── NewTaskModal.vue
│   ├── store/                            # Vuex — estado por domínio
│   │   ├── index.js
│   │   └── modules/
│   │       ├── auth.js
│   │       ├── contratos.js
│   │       ├── divergencias.js
│   │       ├── pagamentos.js
│   │       ├── documentos.js
│   │       └── alertas.js
│   ├── services/                         # Chamadas ao supabase-js
│   │   ├── supabase.js                   # Cliente Supabase
│   │   ├── auth.js
│   │   ├── contratos.js
│   │   ├── divergencias.js
│   │   ├── pagamentos.js
│   │   ├── documentos.js
│   │   ├── alertas.js
│   │   └── portalTransparencia.js        # Mockado (sem API pública confirmada)
│   ├── models/                           # Tradução linha-do-banco → formato da UI
│   │   ├── contrato.js
│   │   ├── divergencia.js
│   │   ├── alerta.js
│   │   ├── documento.js
│   │   └── pagamento.js
│   ├── data/mockData.js                  # Dados mockados (telas fora do MoSCoW prioritário)
│   ├── router/index.js
│   ├── plugins/vuetify.js
│   └── main.js
├── .env.example
├── .gitignore
└── README.md
```

---

## Diagramas
### Diagrama de Componentes
[Imagem](docs/diagrams/componentes.jpeg) · [Fonte (.puml)](docs/diagrams/diagramaComponentes.puml)

### Diagrama de Implantação
[Imagem](docs/diagrams/implantacao.jpeg) · [Fonte (.puml)](docs/diagrams/diagramaImplantação.puml)

> ⚠️ Ambos os diagramas foram atualizados para refletir a arquitetura real (SPA Vue + Supabase, sem backend próprio). Os arquivos `.jpeg` precisam ser reexportados a partir dos `.puml` corrigidos (ex.: via [plantuml.com/plantuml](https://www.plantuml.com/plantuml) ou a extensão PlantUML do VS Code) — não foi possível renderizá-los automaticamente neste ambiente.

## Equipe

| Nome | Papel |
|---|---|
| Érika | Desenvolvedora |
| Fabiane | Desenvolvedora |
| Geórgia | Desenvolvedora |
| Giovana | Desenvolvedora |
| Hanna | Desenvolvedora |
| **Fabrício** | Stakeholder / Especialista do Domínio |

---

<div align="center">
  <sub>Projeto acadêmico — Engenharia de Software · Módulo 8</sub>
</div>
