# 🛒 Template E-commerce Platform

**{{JIRA_TASK}}***

*Não esqueça de preencher os campos laterais Assignees e Labels, esses campos são obrigatórios*
*Os campos que possuem ( * ) são obrigatórios, caso não esteja preenchido seu pull request será REPROVADO*

## Objetivo*
{{DESCRIPTION}}

{{#ifEqual TYPE "fix"}}
## Problema
{{BODY}}

{{/ifEqual}}
## Solução*
{{#ifEqual TYPE "feat"}}
Nova funcionalidade implementada: {{DESCRIPTION}}
{{else ifEqual TYPE "fix"}}
Correção aplicada para resolver: {{DESCRIPTION}}
{{else ifEqual TYPE "refactor"}}
Refatoração realizada: {{DESCRIPTION}}
{{else ifEqual TYPE "perf"}}
Melhoria de performance: {{DESCRIPTION}}
{{else}}
{{TYPE}}: {{DESCRIPTION}}
{{/ifEqual}}

{{#if BODY}}
### Detalhes da Implementação
{{BODY}}
{{/if}}

## Workspace*
{{WORKSPACE_URL}}

## Tarefa/Issue*
{{JIRA_URL}}

## Versionamento
- **Versão**: {{CURRENT_VERSION}} → {{NEW_VERSION}}
- **Tipo**: {{TYPE}} ({{VERSION_BUMP}})
{{#ifEqual BREAKING "SIM"}}
- **⚠️ BREAKING CHANGE**: Sim
{{/ifEqual}}

## Dependências e Observações
{{#if RELATED_ISSUE}}
- Relacionado à: {{RELATED_ISSUE}}
{{/if}}
- Changelog atualizado automaticamente
- Testes locais realizados
- Versão incrementada seguindo semantic versioning

## Screenshots (caso exista):
<!-- Adicione screenshots se necessário -->
