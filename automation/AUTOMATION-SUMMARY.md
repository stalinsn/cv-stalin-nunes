# 🚀 Automaçã```bash
# O sistema analisa sua branch atual e extrai informações:

Branch: feature/abc-3022-novo-checkout
│
🧠 Sistema detecta automaticamente:
├── Tipo: feature
├── Código JIRA: ABC-3022  
├── Descrição: novo-checkout
└── Sugestões: URL JIRA + workspace

🎯 Resultado:
├── 📋 Código pré-preenchido: ABC-3022
├── 🔗 URL sugerida: https://empresa.atlassian.net/browse/ABC-3022
└── 🏷️  Workspace sugerido: feature-abc-3022
```umo Final

## ✅ Sistema Implementado

### 🏗️ Arquitetura Modular (24 arquivos)
- **9 Módulos especializados** em `automation/modules/`
- **4 Templates de PR** em `automation/templates/`
- **Configuração centralizada** em `automation/config/`
- **Documentação completa** 

### 🎯 Funcionalidades Principais

#### 1. **Detecção Inteligente de Branch**
```bash
# O sistema analisa sua branch atual e extrai informações:

Branch: feature/ccl-3022-novo-checkout
│
🧠 Sistema detecta automaticamente:
├── Tipo: feature
├── Código JIRA: CCL-3022  
├── Descrição: novo-checkout
└── Sugestões: URL JIRA + workspace

🎯 Resultado:
├── 📋 Código pré-preenchido: CCL-3022
├── � URL sugerida: https://empresa.atlassian.net/browse/CCL-3022
└── 🏷️  Workspace sugerido: feature-ccl-3022
```

#### 2. **Templates Contextuais Inteligentes**
```bash
# Cada template adapta as perguntas ao contexto:

🎯 GitHub/Minimal:
→ Zero perguntas extras (máxima velocidade)

🏢 Enterprise:
→ JIRA detectado + URL sugerida + docs opcionais
→ SEM workspace (irrelevante corporativo)

🛒 E-commerce:  
→ JIRA detectado + workspace sugerido + URL construída
→ Foco em testes de loja
```

#### 3. **URLs de Workspace Automáticas**
- **Detecção da branch**: Sugere workspace baseado no nome da branch
- **Domínio automático**: `.myvtex.com` (configurável)  
- **Construção automática**: `https://feature-abc-3022--minhaloja.myvtex.com`
- **Zero digitação manual** para casos padrão

## 🎯 Como Usar

### Método 1: Via package.json
```bash
yarn gitflow
# ou
npm run gitflow
```

### Método 2: Execução direta
```bash
./automation/git-flow.sh
```

### Método 3: Migração/teste
```bash
bash automation/migrate.sh
```

## 📋 Templates Disponíveis

| Template | Arquivo | Uso Recomendado |
|----------|---------|-----------------|
| 📝 **Default** | `default.md` | Funcionalidades gerais |
| 🏢 **Enterprise** | `enterprise.md` | Projetos corporativos |
| 🛒 **E-commerce** | `ecommerce.md` | Lojas e marketplaces |
| ⚡ **Minimal** | `minimal.md` | Correções rápidas |

## 🔧 Configuração Personalizada

### Templates (`automation/config/pr-templates.conf`)
```bash
# Formato: nome:arquivo:descrição:exemplo:campos_extras
TEMPLATES=(
    "Default:default.md:Template padrão balanceado:feature/user-auth com task ABC-123:"
    "Enterprise:enterprise.md:Para ambientes corporativos:feature/integration-api com documentação:"
    "E-commerce:ecommerce.md:Para projetos e-commerce:feature/checkout com workspace dev:workspace_dev,store_name"
    "Minimal:minimal.md:Template mínimo e direto:fix/button-color, mudança simples:"
)

# Domínio automático para workspaces
AUTO_WORKSPACE_DOMAIN="myvtex.com"
```

## 🚀 Benefícios

#### 4. **Sistema Multiplataforma**
- ✅ Windows (Git Bash)
- ✅ Linux  
- ✅ macOS

### ✅ **Para o Desenvolvedor**
- **Detecção automática** - sistema lê sua branch e pré-preenche
- **Zero fricção** - templates simples sem perguntas irrelevantes
- **Sugestões inteligentes** - JIRA + workspace baseados na branch
- **Multiplataforma** - funciona em qualquer SO

### ✅ **Para a Equipe**
- **Commits conventional** automáticos
- **Versionamento semântico** consistente
- **Changelogs** gerados automaticamente
- **PRs padronizados** com contexto adequado

### ✅ **Para o Projeto**
- **Sistema exportável** - copia apenas a pasta `automation/`
- **Sem dependências obrigatórias** - funciona com bash puro
- **Configuração flexível** - adaptável a diferentes projetos
- **Documentação completa** - fácil manutenção

## 🎯 Próximos Passos Opcionais

1. **Testes automatizados** do sistema
2. **Integração com CI/CD** (GitHub Actions, etc.)
3. **Templates adicionais** conforme necessidade
4. **Configurações por projeto** (override local)

---

**📝 Criado**: Janeiro 2025  
**🔄 Versão**: 3.0 (Modular)  
**📱 Compatibilidade**: Windows, Linux, macOS  
**🚀 Status**: ✅ Produção
