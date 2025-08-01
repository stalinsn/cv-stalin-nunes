# ⚡ Template Minimalista

## {{DESCRIPTION}}

{{#if BODY}}
{{BODY}}

{{/if}}
**Tipo**: {{TYPE}} | **Versão**: {{CURRENT_VERSION}} → {{NEW_VERSION}}{{#ifEqual BREAKING "SIM"}} | **⚠️ BREAKING**{{/ifEqual}}

{{#if RELATED_ISSUE}}
Closes {{RELATED_ISSUE}}
{{/if}}
