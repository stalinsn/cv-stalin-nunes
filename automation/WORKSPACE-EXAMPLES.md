# 🌐 Exemplos de Configuração de Workspace

## 🧠 Como Funciona o Sistema Inteligente

O sistema agora **analisa sua branch atual** e adapta as perguntas automaticamente:

### 🔍 **Detecção Automática de Branch**
- ✅ **Extrai código JIRA** da branch (ex: `feature/abc-2025-checkout`)
- ✅ **Sugere URLs** baseadas no código detectado  
- ✅ **Pré-preenche campos** automaticamente
- ✅ **Sugere workspace** baseado no padrão da branch

### 🎯 **Templates Inteligentes por Contexto**

#### 🎯 **GitHub/Minimal** 
- ❌ **Zero perguntas** - máxima velocidade
- 🎪 **Fluxo**: Template → Commit → Pronto!

#### 🏢 **Enterprise** 
- ✅ **JIRA detectado** da branch e pré-preenchido
- ✅ **URL sugerida** automaticamente
- ❌ **Sem workspace** (irrelevante para corporativo)
- 🎪 **Fluxo**: Template → JIRA auto → Docs → Pronto!

#### 🛒 **E-commerce**
- ✅ **JIRA detectado** da branch e pré-preenchido  
- ✅ **URL sugerida** automaticamente
- ✅ **Workspace sugerido** baseado na branch
- ✅ **Construção automática** da URL final
- 🎪 **Fluxo**: Template → JIRA auto → Workspace auto → Loja → Pronto!

### 🔗 Formato Final de Workspace
```
https://{workspace-dev}--{loja}.myvtex.com
```

**💡 Domínio fixo**: O sistema usa automaticamente `.myvtex.com` como domínio padrão.

## 🎯 Exemplos Práticos com Detecção Automática

### Exemplo 1: Branch com Código JIRA (E-commerce)
```bash
Branch atual: feature/abc-3022-novo-checkout
│
🧠 Sistema detecta automaticamente:
├── Tipo: feature
├── Código JIRA: ABC-3022
└── Descrição: novo-checkout

🛒 Template E-commerce sugere:
├── 📋 Código da tarefa: ABC-3022 (detectado ✅)
├── 🔗 URL JIRA: https://suaempresa.atlassian.net/browse/ABC-3022 (sugerida ✅)  
├── 🏷️  Workspace: abc3022 (sugerido ✅ - VTEX válido: só letras/números)
├── 🏪 Loja: minhaloja (digitar)
└── ✅ URL final: https://abc3022--minhaloja.myvtex.com
```

### Exemplo 2: Release Branch (E-commerce)
```bash
Branch atual: release/v2.1.0-xyz-1234
│
🧠 Sistema detecta automaticamente:
├── Tipo: release  
├── Código JIRA: XYZ-1234
└── Descrição: v2.1.0

🛒 Template E-commerce sugere:
├── 📋 Código da tarefa: XYZ-1234 (detectado ✅)
├── 🔗 URL JIRA: https://suaempresa.atlassian.net/browse/XYZ-1234 (sugerida ✅)
├── 🏷️  Workspace: xyz1234 (sugerido ✅ - VTEX válido: sem hífens)  
├── 🏪 Loja: lojaexemplo (digitar)
└── ✅ URL final: https://xyz1234--lojaexemplo.myvtex.com
```

### Exemplo 3: Branch Corporativa (Enterprise)
```bash
Branch atual: bugfix/proj-456-corrigir-api
│
🧠 Sistema detecta automaticamente:
├── Tipo: bugfix
├── Código JIRA: PROJ-456
└── Descrição: corrigir-api

🏢 Template Enterprise sugere:
├── 📋 Código da tarefa: PROJ-456 (detectado ✅)
├── 🔗 URL JIRA: https://suaempresa.atlassian.net/browse/PROJ-456 (sugerida ✅)
├── 📚 Documentação: (opcional)
└── ❌ Workspace: NÃO pergunta (irrelevante)
```

### Exemplo 4: Branch Simples (GitHub/Minimal)
```bash
Branch atual: fix-button-color
│
🧠 Sistema detecta: Branch simples sem código JIRA

🎯 Template GitHub/Minimal:
└── ✅ Zero perguntas - direto ao commit!
```

## 🔄 Fluxos Inteligentes por Template

### 🎯 Template Default/GitHub
```
Branch: qualquer-nome-de-branch
│
🔄 Selecione o template de PR:
→ 1) 📝 Default

✅ Template GitHub selecionado - sem campos extras necessários
🔄 Configurando commit conventional...
```

### ⚡ Template Minimal  
```
Branch: fix-small-bug
│
🔄 Selecione o template de PR:
→ 4) ⚡ Minimal

✅ Template Minimal selecionado - sem campos extras necessários  
🔄 Configurando commit conventional...
```

### 🏢 Template Enterprise (com detecção)
```
Branch: feature/proj-456-new-integration
│
🧠 Sistema detecta: PROJ-456

🔄 Selecione o template de PR:
→ 2) 🏢 Enterprise

🏢 Template Enterprise - coletando informações corporativas...
🏢 Informações Corporativas (opcionais):
💡 Detectado da branch: PROJ-456
📋 Código da tarefa (detectado: PROJ-456, Enter para usar ou digite outro): [Enter]
💡 URL sugerida: https://suaempresa.atlassian.net/browse/PROJ-456
🔗 Usar esta URL? (y/N) ou digite a URL correta: y
📚 URL da documentação (opcional): 
🔄 Configurando commit conventional...
```

### 🏢 Template Enterprise
```
� Selecione o template de PR:
→ 2) 🏢 Enterprise

🏢 Template Enterprise - coletando informações corporativas...
🏢 Informações Corporativas (opcionais):
�📋 Código da tarefa (ex: PROJ-123, opcional): PROJ-456
 Sugestão: https://suaempresa.atlassian.net/browse/PROJ-456
🔗 Usar esta URL? (y/N) ou digite a URL correta: y
📚 URL da documentação (opcional): 
🔄 Configurando commit conventional...
```

### 🛒 Template E-commerce (Completo)
```
🔄 Selecione o template de PR:
→ 3) 🛒 E-commerce

🛒 Template E-commerce - coletando informações de workspace...
🛒 Informações E-commerce (opcionais):
📋 Código da tarefa (ex: PROJ-123, opcional): ECP-789
� Sugestão: https://suaempresa.atlassian.net/browse/ECP-789
🔗 Usar esta URL? (y/N) ou digite a URL correta: y
📚 URL da documentação (opcional): 
🏷️  Nome do workspace DEV (ex: feature-auth, opcional): feature-carrinho
🏪 Nome da loja/projeto (ex: minhaloja, opcional): lojaexemplo
✅ Workspace URL construída: https://feature-carrinho--lojaexemplo.myvtex.com
🔄 Configurando commit conventional...
```

### 🛒 Template E-commerce (Parcial)
```
🔄 Selecione o template de PR:
→ 3) 🛒 E-commerce

🛒 Template E-commerce - coletando informações de workspace...
🛒 Informações E-commerce (opcionais):
📋 Código da tarefa (ex: PROJ-123, opcional): 
🔗 URL completa da tarefa (opcional): 
📚 URL da documentação (opcional): 
🏷️  Nome do workspace DEV (ex: feature-auth, opcional): develop
🏪 Nome da loja/projeto (ex: minhaloja, opcional): 
🌐 URL completa do workspace: https://develop.meusite.com
🔄 Configurando commit conventional...
```

## 🎨 Templates Gerados

### Com Todos os Campos
```markdown
## Workspace*
https://feature-carrinho--lojaexemplo.myvtex.com

## Tarefa/Issue*
https://minhaempresa.atlassian.net/browse/ECP-789
```

### Com Campos Opcionais Vazios
```markdown
## Workspace*
<!-- Não fornecido -->

## Tarefa/Issue*
<!-- Não fornecido -->
```

## 🔧 Configuração Avançada

### Personalizar Domínios Comuns
No arquivo `pr-templates.conf`, você pode adicionar:

```bash
# Domínios comuns para sugestão
COMMON_DOMAINS=(
    "myvtex.com"
    "shopify.com" 
    "woocommerce.com"
    "magento.com"
    "mybigcommerce.com"
)
```

### Templates Customizados
Para criar templates específicos da sua empresa:

```bash
# Copiar template base
cp automation/templates/ecommerce.md automation/templates/minha-empresa.md

# Editar conforme necessário
# Adicionar no pr-templates.conf:
TEMPLATES+=(
    "minha-empresa:minha-empresa.md:🏢 Minha Empresa:true"
)
```

## 💡 Dicas de Uso

### 🚀 **Para Desenvolvimento Rápido**
- Use template **Minimal** 
- Não preencha campos opcionais

### 🏢 **Para Ambiente Corporativo** 
- Use template **Enterprise**
- Preencha código da tarefa para link automático
- Configure workspace se necessário

### 🛒 **Para E-commerce**
- Use template **E-commerce**
- Configure workspace completo para fácil teste
- Mantenha padrão de nomenclatura consistente

### 🔄 **Para Automação Máxima**
- Configure templates customizados com valores padrão
- Use convenções de nomenclatura de workspace
- Mantenha URLs de JIRA padronizadas

---

**🎯 O objetivo é flexibilidade total**: desde o uso mais simples (sem campos extras) até o mais completo (workspace + JIRA + documentação), tudo de forma opcional e intuitiva!
