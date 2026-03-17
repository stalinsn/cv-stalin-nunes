# Documentação dos Hooks

[⬅ Voltar ao Índice](../README_INDEX.md)

Hooks customizados para gerenciamento de estado, funcionalidades reutilizáveis e lógica de negócio.

---

## 🔧 Hooks Principais

- [useI18n.ts](useI18n.md) `[CORE]`
  - **Hook principal** para internacionalização e tradução
  - Gerencia estado global de idioma e cache
  - Orquestração de tradução IA + fallbacks

- [useTheme.ts](useTheme.md) `[UI]`
  - **Alternância de tema** dark/light
  - Persistência de preferência do usuário

---

## ⚠️ Hooks Removidos na Refatoração

- ~~`useLanguage.ts`~~ → Consolidado em `useI18n.ts`
- ~~`useAITranslation.ts`~~ → Lógica movida para `useI18n.ts`
- ~~`useTranslation.ts`~~ → Substituído por sistema centralizado

---

## 🏗️ Arquitetura de Hooks

```
┌─────────────────┐    ┌──────────────────┐
│     useI18n     │───▶│   translateService│
│   (orchestr.)   │    │     (API)        │
└─────────────────┘    └──────────────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌──────────────────┐
│ useLocalStorage │    │ Error Handling   │
│   (persist.)    │    │   + Fallbacks    │
└─────────────────┘    └──────────────────┘
```

### Principios de Design
- **Single Responsibility** - Cada hook tem uma função específica
- **Composition over Inheritance** - Hooks pequenos e componíveis
- **Side Effect Management** - useEffect bem definidos
- **Type Safety** - TypeScript rigoroso em todas as interfaces

---

Hooks bem estruturados são a base de componentes React reutilizáveis e maintíveis.
