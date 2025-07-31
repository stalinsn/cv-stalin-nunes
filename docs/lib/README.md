# Documentação da Lib

[⬅ Voltar ao Índice](../README_INDEX.md)

Esta pasta contém serviços core, utilitários e integrações para funcionalidades essenciais do sistema.

---

## 🔄 Sistema de Tradução

### Arquivos Ativos
- [translateService.ts](translateService.md) `[CORE]`
  - **Interface principal** para tradução via API de IA
- [translateMock.ts](translateMock.md) `[FALLBACK]`
  - Tradução simulada para desenvolvimento e fallback
- [translateFree.ts](translateFree.md) `[ALTERNATIVE]`
  - Serviço de tradução gratuita (LibreTranslate)

### ⚠️ Arquivos Removidos na Refatoração
- ~~`translateAI.ts`~~ → Consolidado em `translateService.ts`
- ~~`translation.ts`~~ → Lógica movida para hooks e constantes

---

## 📄 Exportação e Utilitários

- [exportPDF.ts](exportPDF.md) `[UTILS]`
  - Exportação do currículo em formato PDF
- [exportPrint.ts](exportPrint.md) `[UTILS]`
  - Otimização para impressão do currículo

---

## 🏗️ Arquitetura do Sistema de Tradução

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   useI18n()     │───▶│ translateService │───▶│ /api/translate  │
│   (Frontend)    │    │     (Client)     │    │   (Backend)     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ Cache + Storage │    │ Error Handling   │    │ OpenAI + Auth   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

Cada arquivo possui escopo específico e responsabilidade única.
