# Visão e Requisitos — Módulo 8

> Gestão de Contratos e Atas de Registro de Preço

**Última atualização:** Maio/2026
**Stakeholder:** Fabrício (advogado, especialista do domínio)
**Equipe:** Érika, Fabiane, Geórgia, Giovana e Hanna

---

## Sumário

- [Introdução](#introdução)
- [Problema](#problema)
- [Escopo do Módulo](#escopo-do-módulo)
- [Requisitos Funcionais](#requisitos-funcionais)
- [Requisitos Não-Funcionais](#requisitos-não-funcionais)
- [Priorização MoSCoW](#priorização-moscow)
- [Restrições e Suposições](#restrições-e-suposições)

---

## Introdução

O processo licitatório é um procedimento legal e público que visa selecionar a melhor proposta para a Administração Pública, garantindo transparência e competitividade entre fornecedores. O ciclo contempla:

1. **Prospecção de editais** — análise de viabilidade (preços, prazos, condições)
2. **Gestão de documentos** — registro de proposta na plataforma dentro dos prazos
3. **Sessão pública** — fase de lances (presencial, tempo real ou via robôs)
4. **Fase recursal** — contestação de decisões e análise de documentação dos concorrentes
5. **Adjudicação e homologação** — confirmação do vencedor e início da contratação
6. **► Gestão de contratos** — foco deste módulo

---

## Problema

O stakeholder Fabrício relatou as principais dificuldades enfrentadas por quem atua nesse segmento:

| Atividade | Situação Atual |
|---|---|
| Comparação entre contrato enviado e minuta do edital | 100% manual, abrindo múltiplas abas no navegador |
| Geração de relatório de divergências contratuais | Inexistente — identificação manual, sujeita a erros |
| Monitoramento de pagamentos e movimentações do contrato | Manual, sem integração com portais públicos |

Todas essas atividades exigem considerável tempo e concentração, sem nenhum suporte sistematizado disponível no mercado.

---

## Escopo do Módulo

### ✅ Dentro do Escopo

- Comparação automatizada entre o contrato enviado pelo órgão público e a minuta prevista no edital
- Geração de relatórios de divergências contratuais que possam impactar a assinatura
- Resumo estruturado dos contratos (objeto, vigência, valores, prazos e responsáveis)
- Armazenamento e organização de documentos e anexos relacionados ao contrato
- Emissão de alertas automáticos sobre prazos, vencimentos e cláusulas relevantes
- Monitoramento financeiro (empenho, liquidação e pagamento) via Portal da Transparência
- Gestão de tarefas e anotações para fiscais e gestores
- Filtragem de tarefas por status (atrasadas, concluídas, pendentes)
- Visualização do andamento dos contratos e pagamentos

### ❌ Fora do Escopo

| Item | Motivo |
|---|---|
| Prospecção de editais e busca de oportunidades | Pertence a outro módulo |
| Cadastro de empresas e gestão de usuários | Pertence a outro módulo |
| Participação em sessões públicas de licitação | Pertence a outro módulo |
| Análise e resumo de editais pré-participação | Pertence a outro módulo |
| Elaboração de impugnações e recursos jurídicos | Pertence a outro módulo |
| Gestão de calendário pré-contratual | Pertence a outro módulo |
| Montagem de propostas comerciais | Pertence a outro módulo |
| Aplicativo mobile | Fase futura |
| Automação completa de decisões jurídicas | Fase futura |
| Recursos avançados de acessibilidade | Fase futura |

---

## Requisitos Funcionais

| ID | Requisito | Descrição |
|---|---|---|
| RF-1 | Comparação de Documentos | Comparar o contrato enviado pelo órgão público com a minuta prevista no edital |
| RF-2 | Geração de Relatório de Divergências | Identificar e informar diferenças que possam impedir a assinatura do contrato |
| RF-3 | Resumo do Contrato | Gerar resumo com: contratante, objeto, vigência, reajuste, preços, prazos e gestor |
| RF-4 | Armazenamento de Anexos | Armazenar todos os anexos para consulta rápida durante a vigência contratual |
| RF-5 | Emissão de Alertas | Emitir avisos automáticos sobre datas e cláusulas contratuais |
| RF-6 | Monitoramento de Pagamentos | Controlar empenho, liquidação e pagamento via Portal da Transparência |
| RF-7 | Gestão de Tarefas e Anotações | Permitir anotações no quadro para comunicação entre fiscais e gestores |
| RF-8 | Filtros de Status | Filtrar e separar tarefas entre "atrasadas", "pendentes" e "concluídas" |

---

## Requisitos Não-Funcionais

| ID | Requisito | Descrição |
|---|---|---|
| RNF-1 | Acessibilidade | Leitura de tela para deficientes visuais; contraste adequado para distúrbios de percepção visual |
| RNF-2 | Backup de Dados | Cópias de segurança periódicas para evitar perda de informações críticas |
| RNF-3 | Integração | Integração com o Portal da Transparência para obtenção de dados dos contratos |
| RNF-4 | Tempo de Resposta | Comparação de documentos e geração de relatórios com resposta em tempo adequado |

---

## Priorização MoSCoW

```
🔴 MUST HAVE — obrigatório para o MVP
├── RF-6  Monitoramento de Pagamentos
├── RF-1  Comparação de Documentos
├── RF-2  Geração de Relatório de Divergências
├── RF-3  Resumo do Contrato
└── RNF-3 Integração com Portal da Transparência

🟡 SHOULD HAVE — importante, mas não bloqueia o MVP
├── RF-4  Armazenamento de Anexos
├── RF-5  Emissão de Alertas
├── RNF-2 Backup de Dados
└── RNF-4 Tempo de Resposta

🟢 COULD HAVE — desejável se houver tempo
├── RF-7  Gestão de Tarefas e Anotações
├── RF-8  Filtros de Status
├── Histórico de alterações nos contratos
├── Inclusão de comentários no relatório antes da exportação
├── Indicador de status do contrato
├── Visualização do andamento dos pagamentos
└── Organização dos relatórios por data

⚪ WON'T HAVE — fora desta fase
└── RNF-1 Acessibilidade
     ↳ Prevista para versões futuras, após o MVP funcional
```

---

## Restrições e Suposições

| Tipo | Descrição |
|---|---|
| **Prazo** | Entrega do MVP até **09 de julho de 2026** |
| **Integração** | API do Portal da Transparência (acesso gratuito) |
| **Banco de Dados** | Deve manter o mesmo esquema dos demais módulos do projeto |
| **Linguagem** | Deve utilizar a mesma linguagem de programação e frameworks dos outros grupos |
| **Escopo** | Protótipo funcional (MVP) — não é um sistema completo de produção |
