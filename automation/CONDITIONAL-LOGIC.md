# 🧠 Lógica Condicional dos Templates

## 🎯 Filosofia do Sistema

O sistema agora é **inteligente e contextual**, adaptando as perguntas com base no template escolhido. **Não faz mais perguntas irrelevantes!**

## 🔄 Mapeamento Template → Campos

### 🎯 **Default/GitHub** (`github`)
```bash
✅ Uso: Projetos GitHub padrão, pull requests simples
❌ Campos: Nenhum campo extra
🎪 Fluxo: Template → Commit → Pronto!
📋 Ideal para: Features simples, correções, melhorias gerais
```

### ⚡ **Minimal** (`minimal`) 
```bash
✅ Uso: Correções rápidas, hotfixes, mudanças triviais
❌ Campos: Nenhum campo extra
🎪 Fluxo: Template → Commit → Pronto!
📋 Ideal para: Typos, styles, ajustes pequenos
```

### 🏢 **Enterprise** (`enterprise`)
```bash
✅ Uso: Ambientes corporativos com JIRA
✅ Campos: JIRA + Documentação
❌ Workspace: NÃO pergunta (não é relevante para corporativo)
🎪 Fluxo: Template → JIRA → Docs → Commit → Pronto!
📋 Ideal para: Features empresariais, integrações, APIs
```

### 🛒 **E-commerce** (`ecommerce`)
```bash
✅ Uso: Projetos e-commerce, lojas online
✅ Campos: JIRA + Workspace + Documentação  
✅ Workspace: Pergunta completo (para testar loja)
🎪 Fluxo: Template → JIRA → Workspace → Docs → Commit → Pronto!
📋 Ideal para: Features de loja, checkout, produtos, UI
```

## 🧩 Lógica de Implementação

### Arquivo de Configuração (`pr-templates.conf`)
```bash
# Formato: NOME:ARQUIVO:DESCRIÇÃO:EXEMPLO:TEMPLATE_TYPE
TEMPLATES=(
    "default:default.md:🎯 Padrão GitHub:...:github"
    "enterprise:enterprise.md:🏢 Empresarial:...:enterprise"
    "ecommerce:ecommerce.md:🛒 E-commerce:...:ecommerce"
    "minimal:minimal.md:⚡ Minimalista:...:minimal"
)
```

### Funções Específicas (`template-manager.sh`)
```bash
template_check_extra_fields() {
    case "$template_type" in
        "github"|"minimal")
            # Sem campos extras
            ;;
        "enterprise")
            template_collect_enterprise_fields  # JIRA + Docs
            ;;
        "ecommerce")
            template_collect_ecommerce_fields   # JIRA + Workspace + Docs
            ;;
    esac
}
```

## 🎯 Benefícios da Lógica Condicional

### ✅ **Experiência Otimizada**
- **Desenvolvedores GitHub**: Zero fricção, direto ao ponto
- **Equipes Enterprise**: Foco em rastreabilidade (JIRA)
- **Times E-commerce**: Workspace para validação completa

### ✅ **Redução de Atrito**
- **Antes**: Todos templates perguntavam tudo (irrelevante)
- **Agora**: Cada template pergunta só o necessário

### ✅ **Flexibilidade Mantida**
- Todos os campos continuam opcionais
- Sistema se adapta às necessidades
- Fácil de expandir para novos tipos

## 📊 Matriz de Decisão

| Template | JIRA | Workspace | Docs | Uso Recomendado |
|----------|------|-----------|------|-----------------|
| 🎯 **Default** | ❌ | ❌ | ❌ | GitHub simples |
| ⚡ **Minimal** | ❌ | ❌ | ❌ | Hotfixes rápidos |
| 🏢 **Enterprise** | ✅ | ❌ | ✅ | Corporativo + JIRA |
| 🛒 **E-commerce** | ✅ | ✅ | ✅ | Lojas + testes |

## 🚀 Expansibilidade

### Adicionar Novo Tipo de Template
```bash
# 1. Adicionar no pr-templates.conf
"meuTemplate:arquivo.md:Descrição:Exemplo:meuTipo"

# 2. Criar função específica
template_collect_meuTipo_fields() {
    # Campos específicos para meuTipo
}

# 3. Adicionar no case do template_check_extra_fields
"meuTipo")
    template_collect_meuTipo_fields
    ;;
```

### Personalizar Campos por Empresa
```bash
# Criar arquivo local: automation/config/custom-fields.conf
ENTERPRISE_FIELDS_CUSTOM=(
    "CUSTOM_PROMPT:🏢 Campo da empresa:"
)
```

## 💡 Casos de Uso Práticos

### 🎯 **Desenvolvedor Freelancer** 
```bash
→ Usa: Default/Minimal
→ Benefício: Zero configuração, direto ao código
```

### 🏢 **Empresa Corporativa**
```bash
→ Usa: Enterprise
→ Benefício: Rastreabilidade JIRA automática
→ Não perde tempo: Workspace irrelevante
```

### 🛒 **Equipe E-commerce**
```bash
→ Usa: E-commerce
→ Benefício: URL de teste automática
→ Facilita: Validação rápida da feature
```

### ⚡ **Hotfix Urgente**
```bash
→ Usa: Minimal
→ Benefício: Máxima velocidade
→ Sem fricção: Zero perguntas extras
```

---

**🧠 Resultado**: Sistema inteligente que se adapta ao contexto, eliminando perguntas irrelevantes e otimizando o fluxo para cada caso de uso!
