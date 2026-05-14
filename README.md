# Módulo 8 — Gestão de Contratos e Atas de Registro de Preço

> Sistema SaaS de apoio a empresas em processos licitatórios, com foco na gestão e acompanhamento de contratos pós-certame.

[![Jira](https://img.shields.io/badge/Jira-Backlog%20%26%20Sprints-0052CC?logo=jira&logoColor=white)](https://https://hannarecks.atlassian.net/jira/software/projects/SCRUM/boards/1)

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
| [🗂️ Jira — Sprints e Backlog](https://hannarecks.atlassian.net/jira/software/projects/SCRUM/boards/1) | Acompanhamento das sprints e histórias de usuário |

---

## Tecnologias

| Tecnologia | Uso |
|---|---|
| Java / JavaScript | Backend (a confirmar com os demais grupos) |
| Supabase | BaaS — PostgreSQL + Auth + Realtime |
| PostgreSQL | Banco de dados relacional (via Supabase) |
| Portal da Transparência | API pública de dados governamentais |
| PlantUML | Geração de diagramas de arquitetura |

---

## Estrutura do Projeto

```
modulo-8/
├── docs/
│   ├── visao-requisitos.md      # Visão, requisitos e MoSCoW
│   ├── DAS.md                   # Documento de Arquitetura de Software
│   └── diagrams/                # Diagramas PlantUML
│       ├── componentes.puml
│       └── implantacao.puml
├── src/
│   ├── auth/                    # Autenticação via Supabase Auth
│   ├── docs-processor/          # Comparação de documentos (Épico 1)
│   ├── portal-integrator/       # Integração Portal da Transparência (Épico 2)
│   └── supabase-client/         # Camada de acesso ao banco de dados
├── tests/
├── .env.example
├── .gitignore
└── README.md
```

---

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
