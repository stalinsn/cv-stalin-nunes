# Documentação das Constantes

[⬅ Voltar ao Índice](../README_INDEX.md)

Configurações centralizadas e constantes do sistema.

---

## 🌐 Sistema de Idiomas

- [languages.ts](languages.md) `[CORE]`
  - **Configuração centralizada** de idiomas suportados
  - **Mapeamento de códigos** interno vs API
  - **Metadados** como nomes, flags e configurações

---

## 🏗️ Filosofia de Constantes

O sistema centraliza todas as configurações em constantes tipadas para:

- **Type Safety** - Inferência automática de tipos
- **Single Source of Truth** - Uma fonte para cada configuração
- **Extensibilidade** - Fácil adição de novos idiomas
- **Manutenibilidade** - Mudanças centralizadas

### Exemplo de Estrutura
```typescript
export const SUPPORTED_LANGUAGES = {
  PTBR: 'ptbr',
  EN: 'en',
  // ...
} as const;

export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[keyof typeof SUPPORTED_LANGUAGES];
```

---

Constantes bem definidas são a base de um sistema robusto e extensível.
