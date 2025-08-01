# 🏷️ Regras de Workspace VTEX - Guia Atualizado

## 🎯 **Problema Corrigido**

### ❌ **Antes (INCORRETO):**
```bash
feature/abc-3022 → workspace: feature-abc-3022
release/xyz-1234 → workspace: release-xyz-1234
bugfix/proj-456  → workspace: bugfix-proj-456
```

### ✅ **Agora (CORRETO para VTEX):**
```bash
feature/abc-3022 → workspace: abc3022
release/xyz-1234 → workspace: xyz1234  
bugfix/proj-456  → workspace: proj456
```

## 📋 **Regras do VTEX Workspace**

### ✅ **Permitido:**
- **Letras**: a-z, A-Z
- **Números**: 0-9
- **Minúsculas**: VTEX converte automaticamente

### ❌ **NÃO Permitido:**
- **Hífens**: `-`
- **Underscores**: `_`
- **Pontos**: `.`
- **Espaços**: ` `
- **Caracteres especiais**: `@`, `#`, `$`, etc.

## 🔧 **Como o Sistema Agora Funciona**

### **Função Atualizada: `git_suggest_workspace_name()`**
```bash
# Entrada: abc-3022
# Processamento:
1. Remove todos os caracteres especiais: abc3022
2. Converte para minúsculas: abc3022
3. Resultado: abc3022 ✅

# Entrada: XYZ-1234-fix-urgent
# Processamento:  
1. Remove caracteres especiais: XYZ1234fixurgent
2. Converte para minúsculas: xyz1234fixurgent
3. Resultado: xyz1234fixurgent ✅
```

### **Exemplos Práticos:**
```bash
feature/ABC-3022-checkout    → abc3022checkout
release/v2.1.0-XYZ-1234     → xyz1234
bugfix/PROJ-456-urgent-fix   → proj456urgentfix
hotfix/emergency-CCL-789     → ccl789
```

## 🌐 **URLs Finais Corretas**

### **Antes vs Agora:**
```bash
❌ Antes: https://feature-abc-3022--minhaloja.myvtex.com
✅ Agora:  https://abc3022--minhaloja.myvtex.com

❌ Antes: https://release-xyz-1234--loja.myvtex.com  
✅ Agora:  https://xyz1234--loja.myvtex.com

❌ Antes: https://bugfix-proj-456--empresa.myvtex.com
✅ Agora:  https://proj456--empresa.myvtex.com
```

## 🧪 **Testes para Validar**

### **1. Testar Detecção:**
```bash
# Branch: feature/abc-3022-test
yarn gitflow

# Esperar ver:
# 🏷️  Workspace: [Enter para abc3022test]  ✅
```

### **2. Testar Sanitização:**
```bash
# Branch: fix-urgent-button
yarn gitflow  

# Esperar ver:
# 🏷️  Workspace: [Enter para fixurgentbutton]  ✅
```

### **3. Testar URL Final:**
```bash
# Branch: release/v1.2.0-xyz-1234
# Template: E-commerce
# Loja: minhaloja

# URL esperada:
# https://xyz1234--minhaloja.myvtex.com  ✅
```

## 📝 **Documentação Atualizada**

### **Arquivos Corrigidos:**
- ✅ `QUICK-START.md` - Exemplos de workspace corrigidos
- ✅ `WORKSPACE-EXAMPLES.md` - URLs finais atualizadas
- ✅ `BRANCH-DETECTION.md` - Sugestões corretas
- ✅ `BRANCH-DETECTION-TEST.md` - Casos de teste atualizados
- ✅ `AUTOMATION-SUMMARY.md` - Exemplos corrigidos
- ✅ `git-utils.sh` - Função `git_suggest_workspace_name()` corrigida

### **Padrão Agora:**
```bash
JIRA: ABC-3022 → Workspace: abc3022
JIRA: XYZ-1234 → Workspace: xyz1234  
JIRA: PROJ-456 → Workspace: proj456
```

## 🎯 **Resultado**

### ✅ **Benefícios:**
- **Compatibilidade**: 100% compatível com VTEX
- **Simplicidade**: Workspaces mais limpos e simples
- **Consistência**: Sempre o mesmo padrão
- **Automação**: Detecção ainda funciona perfeitamente

### 🚀 **Fluxo Ainda Automático:**
1. Branch: `feature/abc-3022-checkout`
2. Sistema detecta: `ABC-3022`
3. Sugere workspace: `abc3022checkout`
4. Usuário confirma: Enter
5. Informa loja: `minhaloja`
6. URL final: `https://abc3022checkout--minhaloja.myvtex.com` ✅

---

**🎯 Resultado**: Workspaces válidos para VTEX, automação mantida, documentação corrigida! 🚀
