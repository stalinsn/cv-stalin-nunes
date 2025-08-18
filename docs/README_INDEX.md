# 📚 Índice da Documentação

Bem-vindo à documentação técnica do projeto! Após refatoração completa do sistema de tradução.

---

## 🏗️ Visão Geral da Arquitetura

- **[Arquitetura do Sistema](ARCHITECTURE.md)** `[ESSENCIAL]`
  - Visão geral, fluxos, e design decisions do sistema de tradução refatorado

---

## 🤖 Automação e Workflow

- **[Git Flow Automation](GIT_AUTOMATION.md)** `[NOVO]`
  - Sistema automatizado de commits, versionamento e releases

---

## 📦 Documentação por Módulo

### **Core System**
- **[Hooks](hooks/README.md)** - Estado, tradução, tema e funcionalidades reutilizáveis
- **[Lib](lib/README.md)** - Serviços de tradução, exportação e integrações
- **[Types](types/README.md)** - Tipagens TypeScript e contratos

### **Utilities & Config**
- **[Utils](utils/README.md)** - Utilitários para idiomas e cache
- **[Constants](constants/)** - Configurações centralizadas (idiomas, etc.)

### **Interface & Presentation**
- **[Componentes](components/README.md)** - Componentes React da aplicação
- **[Dados](data/README.md)** - Estrutura de dados, labels e i18n
- **[Styles](styles/README.md)** - Estilos, responsividade e design tokens

---

## 🚀 Quick Start

### **Para Desenvolvedores**
1. 📖 Leia [ARCHITECTURE.md](ARCHITECTURE.md) para entender o sistema
2. 🔧 Veja [hooks/useI18n.md](hooks/useI18n.md) para o hook principal
3. 🌐 Consulte [constants/languages.md](constants/languages.md) para idiomas

### **Para Tradução**
1. 🔄 [lib/translateService.md](lib/translateService.md) - Interface principal
2. 📦 [utils/translationCache.md](utils/translationCache.md) - Sistema de cache
3. 🔧 [utils/languageUtils.md](utils/languageUtils.md) - Utilitários de idioma

### **Para Manutenção**
1. 🏗️ [ARCHITECTURE.md](ARCHITECTURE.md) - Princípios e extensibilidade
2. 📋 Cada README.md setorial para contexto específico
3. 🐛 Seções de debugging nas documentações individuais

---

## 🔄 Sistema de Tradução (Refatorado)

**Status atual:** ✅ Sistema simplificado e otimizado

### **Arquivos Core (mantidos):**
- `hooks/useI18n.ts` - Hook principal
- `lib/translateService.ts` - Interface de API
- `utils/translationCache.ts` - Cache persistente
- `constants/languages.ts` - Configuração de idiomas

### **Arquivos Removidos:**
- ~~`hooks/useLanguage.ts`~~ - Duplicado
- ~~`lib/translateAI.ts`~~ - Duplicado  
- ~~`utils/translate.ts`~~ - Duplicado
- ~~`lib/translation.ts`~~ - Não utilizado

---

---

## 🧭 Apps

- [CV](apps/cv.md)
- [MOTD](apps/motd.md)
- [E‑commerce](apps/ecommerce.md)

Consulte cada seção para detalhes técnicos específicos. A documentação é atualizada continuamente para refletir o estado atual do código.
