# 📋 Sistema de Templates de### Durante a Automação
A automação irá perguntar qual template usar com exemplos:

```
Selecionando template de PR...
Templates disponíveis:
1) 🎯 Padrão GitHub
   💡 Simples com checklist básico

2) 🏢 Empresarial
   💡 JIRA + validação estruturada

3) 🛒 E-commerce
   💡 Workspace + campos obrigatórios

4) ⚡ Minimalista
   💡 Só o essencial, uma linha

5) 🔧 Customizar template existente
6) ⚙️ Usar configuração padrão (default)

Escolha uma opção (1-6):
```ema de templates permite usar diferentes formatos de Pull Request para diferentes contextos empresariais e pessoais.

## 🎯 Templates Disponíveis

### 1. **🎯 Padrão GitHub** (`default`)
- Template simples e limpo para projetos pessoais
- Foco em conventional commits e changelog
- Ideal para projetos open source

### 2. **🏢 Empresarial** (`enterprise`)
- Template robusto para ambientes corporativos
- Inclui campos para tarefas, documentação e checklist de validação
- Processo de revisão estruturado

### 3. **🛒 E-commerce Platform** (`ecommerce`)
- Template para plataformas de e-commerce (VTEX, Shopify, etc.)
- Segue padrões de workflow empresarial
- Campos obrigatórios e workspace links automáticos

### 4. **⚡ Minimalista** (`minimal`)
- Template ultra-simples para mudanças rápidas
- Apenas o essencial: descrição, tipo e versão
- Ideal para hotfixes e ajustes menores

## 🔧 Como Usar

### Durante a Automação
A automação irá perguntar qual template usar:

```
Selecionando template de PR...
Templates disponíveis:
1) 🎯 Padrão GitHub
2) 🏢 Empresarial (JIRA)
3) 🛒 E-commerce Platform
4) ⚡ Minimalista
5) 🔧 Customizar template existente
6) ⚙️ Usar configuração padrão (default)
```

### Campos Extras
Para templates **Enterprise** e **E-commerce**, você será perguntado sobre:

- **📋 Código da tarefa**: Ex: PROJ-123, ECP-456 (opcional)
- **🔗 URL da tarefa**: Link completo da tarefa (opcional, sugestão automática)
- **🌐 Workspace**: Informações para construir URL automaticamente (opcional)
  - Nome do workspace DEV (ex: feature-auth)
  - Nome da loja/projeto (ex: minhaloja)  
  - Domínio fixo: myvtex.com (automático)
  - Resultado: https://feature-auth--minhaloja.myvtex.com
- **📚 Documentação**: Link opcional da documentação

## 📁 Estrutura dos Templates

```
automation/templates/
├── default.md          # 🎯 Padrão GitHub
├── enterprise.md       # 🏢 Empresarial
├── vtex.md            # 🛒 VTEX
├── minimal.md         # ⚡ Minimalista
└── custom-*.md        # 🔧 Templates customizados
```

## 🎨 Variáveis Disponíveis

Todos os templates podem usar estas variáveis:

### Básicas
- `{{DESCRIPTION}}` - Descrição do commit
- `{{TYPE}}` - Tipo do commit (feat, fix, etc.)
- `{{CURRENT_VERSION}}` - Versão atual
- `{{NEW_VERSION}}` - Nova versão
- `{{BREAKING}}` - SIM/NÃO se é breaking change
- `{{VERSION_BUMP}}` - major/minor/patch

### Condicionais
- `{{BODY}}` - Corpo do commit (se existir)
- `{{RELATED_ISSUE}}` - Issue relacionada (se existir)

### Extras (Enterprise/E-commerce)
- `{{JIRA_TASK}}` - Código da tarefa
- `{{JIRA_URL}}` - URL da tarefa
- `{{DOC_URL}}` - URL da documentação
- `{{WORKSPACE_URL}}` - URL do workspace (construída automaticamente)

### Condicionais Avançadas
```handlebars
{{#if BODY}}
Esta seção só aparece se houver corpo do commit
{{BODY}}
{{/if}}

{{#ifEqual TYPE "fix"}}
- [x] Correção de Bug
{{else ifEqual TYPE "feat"}}
- [x] Nova Funcionalidade
{{else}}
- [x] Outros
{{/ifEqual}}
```

## 🔧 Customização

### Criar Template Personalizado

1. **Durante a automação**: Escolha "Customizar template existente"
2. **Manual**: Copie um template existente

```bash
# Copiar template base
cp automation/templates/default.md automation/templates/meu-template.md

# Editar conforme necessário
nano automation/templates/meu-template.md
```

### Configurar Template Padrão

Edite `automation/config/pr-templates.conf`:

```bash
# Definir template padrão
DEFAULT_TEMPLATE=enterprise

# Ou adicionar novo template
TEMPLATES+=(
    "meu-template:meu-template.md:🎨 Meu Template:false"
)
```

## 📊 Exemplos de Output

### Template Default
```markdown
## Descrição
Adicionar autenticação OAuth

## Tipo
- [x] feat

## Impacto
- Versão: 1.0.0 para 1.1.0
- Breaking: NÃO

## Checklist
- [x] Testado localmente
- [x] Changelog atualizado
- [x] Versão incrementada
```

### Template Enterprise
```markdown
## Descrição da Mudança
Adicionar autenticação OAuth

## Referências
- **Código da Tarefa no JIRA**: [ECP-123](https://company.atlassian.net/browse/ECP-123)

## Tipo de Mudança
- [ ] Correção de Bug
- [x] Nova Funcionalidade
- [ ] Melhorias

## Fluxo de Revisão e Validação
### Revisão/Validação DEV
- [ ] Validou e atualizou a versão do código...
```

### Template E-commerce
```markdown
**PROJ-123***

*Os campos que possuem ( * ) são obrigatórios*

## Objetivo*
Adicionar autenticação OAuth

## Solução*
Nova funcionalidade implementada: Adicionar autenticação OAuth

## Workspace*
https://feature-auth--minhaloja.myvtex.com/

## Tarefa/Issue*
https://company.atlassian.net/browse/PROJ-123
```

## 🚀 Dicas de Uso

### Para Projetos Pessoais
Use o template **Default** - simples e eficiente

### Para Ambiente Corporativo
Use o template **Enterprise** - processo estruturado

### Para E-commerce Platforms
Use o template **E-commerce** - segue padrões de plataformas

### Para Hotfixes Rápidos
Use o template **Minimal** - apenas o essencial

### Para Múltiplos Contextos
Configure diferentes templates em `pr-templates.conf` e escolha conforme a situação

## 🔄 Migração de Templates Antigos

Se você já tem templates `.github/PULL_REQUEST_TEMPLATE.md`:

1. Copie o conteúdo para um novo template
2. Adicione as variáveis do sistema
3. Configure no `pr-templates.conf`

```bash
# Backup do template antigo
cp .github/PULL_REQUEST_TEMPLATE.md automation/templates/legacy.md

# Adaptar com variáveis
# Substituir textos fixos por {{VARIAVEL}}
```

---

**💡 Pro Tip**: Você pode ter quantos templates quiser! Basta adicionar arquivos `.md` na pasta `templates/` e configurar em `pr-templates.conf`.
