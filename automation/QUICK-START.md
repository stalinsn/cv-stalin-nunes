# ⚡ Guia Rápido de Uso - Git Flow Automation

## 🚀 **Start em 30 segundos**

### 1. **Executar**
```bash
yarn gitflow
# ou 
npm run gitflow
# ou
./automation/git-flow.sh
```

### 2. **Escolher Template**
```
🔄 Selecione o template de PR:
1) 📝 Default     - GitHub simples
2) 🏢 Enterprise  - JIRA + docs
3) 🛒 E-commerce  - JIRA + workspace + loja
4) ⚡ Minimal     - Só o essencial

→ Digite: 3
```

### 3. **Confirmar Sugestões** (se detectar branch)
```
💡 Detectado da branch: ABC-3022
📋 Código da tarefa: [Enter para ABC-3022]
🔗 URL JIRA: [Y para usar sugerida] 
🏷️  Workspace: [Enter para feature-abc-3022]
🏪 Loja: minhaloja
```

### 4. **Pronto!** ✅

---

## 🎯 **Cenários Mais Comuns**

### **🛒 E-commerce (Mais Usado)**
```bash
# 1. Criar branch com código JIRA
git checkout -b feature/abc-3022

# 2. Fazer changes e rodar
yarn gitflow

# 3. Escolher template E-commerce (3)
# 4. Apertar Enter nas sugestões
# 5. Digitar nome da loja
# ✅ Resultado: 90% automático!
```

### **⚡ Hotfix Rápido**
```bash
# 1. Fazer changes
# 2. Rodar automação
yarn gitflow

# 3. Escolher Minimal (4)
# ✅ Zero perguntas - direto!
```

### **🏢 Corporativo**
```bash
# 1. Branch com código JIRA
git checkout -b feature/proj-456-integration

# 2. Rodar automação
yarn gitflow

# 3. Escolher Enterprise (2)  
# 4. Confirmar JIRA detectado
# ✅ Foco em rastreabilidade!
```

---

## 🧠 **Detecção Automática**

### **✅ O que detecta da branch:**
- `feature/abc-3022` → Código: **ABC-3022**
- `bugfix/xyz-1234-fix` → Código: **XYZ-1234**
- `release/v2.1.0-proj-456` → Código: **PROJ-456**

### **✅ O que sugere automaticamente:**
- **JIRA URL**: `https://empresa.atlassian.net/browse/ABC-3022`
- **Workspace**: `feature-abc-3022` 
- **URL Final**: `https://feature-abc-3022--minhaloja.myvtex.com`

---

## ⚙️ **Configuração Rápida**

### **Personalizar JIRA (1x só)**
```bash
# Editar: automation/config/pr-templates.conf
JIRA_BASE_URL="https://minhaempresa.atlassian.net/browse"
```

### **Personalizar Domínio (1x só)**
```bash
# Editar: automation/config/pr-templates.conf  
AUTO_WORKSPACE_DOMAIN="myvtex.com"
```

---

## 💡 **Dicas Rápidas**

### **🎯 Para máxima velocidade:**
- Use branches com código JIRA: `feature/abc-3022`
- Escolha template E-commerce para projetos de loja
- Aperte Enter para aceitar sugestões

### **🛠️ Para debugar:**
```bash
# Ver informações detectadas
bash automation/migrate.sh

# Testar templates
ls automation/templates/
```

### **📱 Multiplataforma:**
- ✅ Windows: Git Bash
- ✅ Linux: Terminal
- ✅ macOS: Terminal

---

## 🎪 **Fluxos por Template**

| Template | Quando Usar | Perguntas |
|----------|-------------|-----------|
| 🎯 **Default** | GitHub básico | Zero |
| ⚡ **Minimal** | Hotfixes | Zero |
| 🏢 **Enterprise** | JIRA corporativo | JIRA + docs |
| 🛒 **E-commerce** | Projetos de loja | JIRA + workspace |

---

## 🆘 **Problemas Comuns**

### **Não detecta código JIRA:**
```bash
# Certifique-se que branch segue padrão:
feature/abc-3022     ✅
feature-abc-3022     ❌
abc-3022             ❌
```

### **URL workspace incorreta:**
```bash
# Verifique configuração:
AUTO_WORKSPACE_DOMAIN="myvtex.com"  ✅
AUTO_WORKSPACE_DOMAIN="vtex.com"    ❌
```

### **JIRA URL errada:**
```bash
# Configure sua empresa:
JIRA_BASE_URL="https://suaempresa.atlassian.net/browse"
```

---

**🎯 TL;DR**: Crie branch `feature/abc-3022`, rode `yarn gitflow`, escolha template 3, aperte Enter nas sugestões, digite nome da loja. Pronto! 🚀
