# 🏢 Template Empresarial - VTEX/JIRA

## Descrição da Mudança

{{DESCRIPTION}}

{{#if BODY}}
{{BODY}}

{{/if}}
## Referências

- **Código da Tarefa**: [{{JIRA_TASK}}]({{JIRA_URL}})
- **Link da Documentação**: [Link da Documentação]({{DOC_URL}})

## Tipo de Mudança

{{#ifEqual TYPE "fix"}}
- [x] Correção de Bug
- [ ] Nova Funcionalidade
- [ ] Melhorias
- [ ] Documentação
- [ ] Outros (especificar):
{{else ifEqual TYPE "feat"}}
- [ ] Correção de Bug
- [x] Nova Funcionalidade
- [ ] Melhorias
- [ ] Documentação
- [ ] Outros (especificar):
{{else ifEqual TYPE "docs"}}
- [ ] Correção de Bug
- [ ] Nova Funcionalidade
- [ ] Melhorias
- [x] Documentação
- [ ] Outros (especificar):
{{else ifEqual TYPE "refactor"}}
- [ ] Correção de Bug
- [ ] Nova Funcionalidade
- [x] Melhorias
- [ ] Documentação
- [ ] Outros (especificar):
{{else}}
- [ ] Correção de Bug
- [ ] Nova Funcionalidade
- [ ] Melhorias
- [ ] Documentação
- [x] Outros (especificar): {{TYPE}}
{{/ifEqual}}

## Tarefas Relacionadas

- Task: [{{JIRA_TASK}}]({{JIRA_URL}})

## Fluxo de Revisão e Validação

### Revisão/Validação DEV

- [ ] Validou e atualizou a versão do código na PR de acordo com a versão em produção.
- [ ] O código foi revisado e validado pelo desenvolvedor.
- [ ] Solicitação da Tarefa Atendida - A implementação atende todos os requisitos especificados na tarefa.
- [ ] Verificação de Impacto - Verificado se houve impacto em outra funcionalidade do sistema.
- [ ] Retirada de anotações de código - Todos os `console.log` desnecessários foram removidos.

### Disponibilidade para Testes

- [ ] A versão está pronta para testes em ambiente de desenvolvimento.
  - **Link do Workspace DEV**: [{{WORKSPACE_URL}}]({{WORKSPACE_URL}})

## Versionamento

- **Versão Anterior**: {{CURRENT_VERSION}}
- **Nova Versão**: {{NEW_VERSION}}
- **Breaking Change**: {{BREAKING}}

## Observações Adicionais

{{#if RELATED_ISSUE}}
Relacionado à issue: {{RELATED_ISSUE}}
{{/if}}

<!-- Adicione quaisquer comentários ou detalhes adicionais relevantes para o Pull Request. -->
