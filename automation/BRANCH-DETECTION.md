# 🧠 Detecção Inteligente de Branch

## 🎯 Como Funciona

O sistema agora **analisa automaticamente** o nome da branch atual e **extrai informações** para pré-preencher campos do template!

## 🔍 Padrões Reconhecidos

### ✅ **Branches Convencionais**
```bash
# Formato: tipo/codigo-descricao
feature/ccl-2025-implementar-checkout
bugfix/ecp-3022-corrigir-pagamento  
hotfix/proj-456-fix-security
release/ccl-2025-v1.2.3
chore/ecp-1234-atualizar-deps
```

### 📋 **Informações Extraídas**
```bash
feature/ccl-2025-implementar-checkout
│       │       │
│       │       └── Descrição: "implementar-checkout"
│       └─────────── Código JIRA: "ccl-2025" 
└─────────────────── Tipo: "feature"
```

## 🎯 Exemplos Práticos

### Exemplo 1: E-commerce Completo
```bash
Branch atual: feature/abc-3022-novo-carrinho
│
├── 🧠 Sistema detecta:
│   ├── Tipo: feature
│   ├── Código: ABC-3022  
│   └── Descrição: novo-carrinho
│
├── 🛒 Template E-commerce pergunta:
│   ├── 📋 Código da tarefa: (ABC-3022) ✅ PRÉ-PREENCHIDO
│   ├── 🔗 URL JIRA: https://suaempresa.atlassian.net/browse/ABC-3022 ✅ SUGERIDA
│   ├── 🏷️  Workspace: feature-abc-3022 ✅ SUGERIDO
│   └── 🏪 Loja: (pergunta normalmente)
│
└── ✅ Resultado: Máxima automação!
```

### Exemplo 2: Enterprise Focado
```bash
Branch atual: bugfix/xyz-1234-corrigir-api
│
├── 🧠 Sistema detecta:
│   ├── Tipo: bugfix
│   ├── Código: XYZ-1234
│   └── Descrição: corrigir-api
│
├── 🏢 Template Enterprise pergunta:
│   ├── 📋 Código da tarefa: (XYZ-1234) ✅ PRÉ-PREENCHIDO
│   ├── 🔗 URL JIRA: https://suaempresa.atlassian.net/browse/XYZ-1234 ✅ SUGERIDA
│   ├── 📚 Docs: (pergunta normalmente)
│   └── ❌ Workspace: NÃO pergunta (irrelevante)
│
└── ✅ Resultado: Foco em rastreabilidade!
```

### Exemplo 3: Release Branch
```bash
Branch atual: release/v2.1.0-abc-3455
│
├── 🧠 Sistema detecta:
│   ├── Tipo: release
│   ├── Código: ABC-3455
│   └── Descrição: v2.1.0
│
├── 🛒 Template E-commerce pergunta:
│   ├── 📋 Código da tarefa: (ABC-3455) ✅ PRÉ-PREENCHIDO  
│   ├── 🔗 URL JIRA: https://suaempresa.atlassian.net/browse/ABC-3455 ✅ SUGERIDA
│   ├── 🏷️  Workspace: release-abc-3455 ✅ SUGERIDO
│   └── 🏪 Loja: (pergunta para teste da release)
│
└── ✅ Resultado: Release rastreável com workspace!
```

## 🎪 Fluxo Inteligente por Template

### 🎯 **GitHub/Minimal** 
```
Branch: feature/ccl-2025-nova-feature
│
└── ✅ Sistema: "Sem campos extras - direto ao commit!"
    └── ⚡ Zero fricção mesmo com código JIRA na branch
```

### 🏢 **Enterprise**
```
Branch: feature/abc-2025-nova-feature
│
├── 🧠 Detecta: ABC-2025
├── 📋 Pré-preenche: ABC-2025
├── 🔗 Sugere: https://suaempresa.atlassian.net/browse/ABC-2025
├── 📚 Pergunta: documentação
└── ❌ Não pergunta workspace (irrelevante)
```

### 🛒 **E-commerce**
```
Branch: feature/abc-2025-nova-feature
│
├── 🧠 Detecta: ABC-2025
├── 📋 Pré-preenche: ABC-2025
├── 🔗 Sugere: https://suaempresa.atlassian.net/browse/ABC-2025
├── 📚 Pergunta: documentação
├── 🏷️  Sugere workspace: feature-abc-2025
└── 🏪 Pergunta: nome da loja
```

## ⚙️ Configuração Personalizada

### JIRA Base URL (`pr-templates.conf`)
```bash
# Personalizar URL do JIRA da empresa
JIRA_BASE_URL="https://minhaempresa.atlassian.net/browse"
JIRA_BASE_URL="https://jira.empresa.com/browse"
JIRA_BASE_URL="https://empresa.atlassian.net/browse"
```

### Padrões de Branch Personalizados
```bash
# Adicionar novos padrões se necessário
BRANCH_PATTERNS=(
    "feature|feat|story"
    "bugfix|fix|hotfix|bug"
    "release|rel|version"
    "chore|docs|style|refactor|test|ci"
)
```

## 🚀 Benefícios

### ✅ **Automação Máxima**
- **Zero digitação** para códigos JIRA
- **URLs automáticas** baseadas na branch
- **Workspace sugerido** baseado no padrão

### ✅ **Flexibilidade Total**
- **Ainda é opcional** - pode digitar manualmente
- **Fallback inteligente** se não detectar padrão
- **Adaptável** a diferentes convenções

### ✅ **Consistência**
- **Padrão unificado** entre branch → JIRA → workspace
- **Rastreabilidade perfeita** do código até o deploy
- **Redução de erros** de digitação

## 💡 Cenários de Uso

### 🔥 **Fluxo Ideal (E-commerce)**
```bash
# 1. Criar branch seguindo padrão
git checkout -b feature/abc-3022-novo-checkout

# 2. Fazer alterações
# ... código ...

# 3. Executar automação
yarn gitflow
│
├── 🛒 Escolher template E-commerce
├── 📋 Sistema sugere: ABC-3022 (só apertar Enter)
├── 🔗 Sistema sugere URL completa (só apertar Y)  
├── 🏷️  Sistema sugere: feature-abc-3022 (só apertar Enter)
├── 🏪 Digitar: minhaloja
└── ✅ URL construída: https://feature-abc-3022--minhaloja.myvtex.com

# Resultado: 90% automático!
```

### ⚡ **Fluxo Simples (Minimal)**
```bash
# 1. Criar branch (pode ser qualquer nome)
git checkout -b fix-button-color

# 2. Fazer alterações  
# ... código ...

# 3. Executar automação
yarn gitflow
│
├── ⚡ Escolher template Minimal
└── ✅ Zero perguntas - direto ao commit!

# Resultado: 100% automático!
```

### 🏢 **Fluxo Corporativo (Enterprise)**
```bash
# 1. Criar branch seguindo padrão JIRA
git checkout -b feature/proj-456-new-integration

# 2. Fazer alterações
# ... código ...

# 3. Executar automação  
yarn gitflow
│
├── 🏢 Escolher template Enterprise
├── 📋 Sistema sugere: PROJ-456 (só apertar Enter)
├── 🔗 Sistema sugere URL JIRA (só apertar Y)
├── 📚 Digitar docs se necessário
└── ❌ Não pergunta workspace (irrelevante)

# Resultado: 80% automático + foco empresarial!
```

---

**🎯 Resultado**: O sistema agora **lê sua branch** e **pré-preenche tudo** automaticamente, respeitando o fluxo de trabalho que você já usa!
