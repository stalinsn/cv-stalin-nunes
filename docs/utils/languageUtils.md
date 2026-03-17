[⬅ Voltar ao Índice](../README_INDEX.md)

# utils/languageUtils.ts

> **Status**: `[UTILITY]` - Funções utilitárias para manipulação de códigos de idioma

## 📋 Descrição

Utilitários para normalização e conversão de códigos de idioma. Centraliza a lógica de:
- **Normalização** de códigos inconsistentes (`pt-br`, `ptbr`, `pt` → `ptbr`)
- **Conversão** entre formato interno e formato da API
- **Validação** de idiomas suportados
- **Configuração lookup** para metadados de idiomas

## 🔧 API

### `normalizeLangCode(code: string): SupportedLanguage`

Normaliza códigos de idioma para formato interno consistente.

```typescript
normalizeLangCode('pt-br')  // → 'ptbr'
normalizeLangCode('en-us')  // → 'en'  
normalizeLangCode('ES')     // → 'es'
normalizeLangCode('invalid') // → 'ptbr' (default)
```

### `toApiLangCode(lang: SupportedLanguage): string`

Converte código interno para formato esperado pela API.

```typescript
toApiLangCode('ptbr') // → 'pt-br'
toApiLangCode('en')   // → 'en-us'
toApiLangCode('es')   // → 'es-es'
```

### `isValidLanguage(lang: string): lang is SupportedLanguage`

Type guard que verifica se idioma é suportado.

```typescript
if (isValidLanguage(userInput)) {
  // userInput é garantidamente SupportedLanguage
  const config = getLanguageConfig(userInput);
}
```

### `getLanguageConfig(lang: SupportedLanguage)`

Obtém configuração completa do idioma.

```typescript
const config = getLanguageConfig('en');
// { name: 'English', apiCode: 'en-us', flag: '🇺🇸' }
```

## 🏗️ Casos de Uso

### 1. **Input do Usuário**
```typescript
// Normalizar input inconsistente
const userLang = 'PT-BR';
const normalized = normalizeLangCode(userLang); // 'ptbr'
```

### 2. **Chamada de API**
```typescript
// Converter para formato da API
const apiCode = toApiLangCode('ptbr'); // 'pt-br'
await translateService(data, apiCode);
```

### 3. **Validação**
```typescript
// Verificar se idioma é suportado
if (isValidLanguage(inputLang)) {
  await handleTranslate(inputLang);
} else {
  showError('Idioma não suportado');
}
```

### 4. **Metadados**
```typescript
// Obter nome para display
const config = getLanguageConfig('fr');
console.log(`Traduzindo para ${config.name}`); // "Traduzindo para Français"
```

## 🔗 Interações

**Usado por:**
- `hooks/useI18n.ts` - Normalização de idiomas
- `lib/translateMock.ts` - Configuração de prefixos
- `app/page.tsx` - Validação de input do usuário

**Depende de:**
- `constants/languages.ts` - Configurações base
- `types` - TypeScript para type safety

## 🛠️ Considerações Técnicas

### Type Safety
- **Type guards** com `is` predicates
- **Automatic type inference** via const assertions
- **Compile-time validation** de idiomas

### Performance
- **O(1) lookups** via object mapping
- **Memoization** desnecessária (funções puras simples)
- **Small memory footprint**

### Robustez
- **Fallback para idioma padrão** em códigos inválidos
- **Case-insensitive** normalization
- **Múltiplos formatos** de input suportados

## 📝 Manutenção

### Adicionando Suporte a Novo Formato

```typescript
function normalizeLangCode(code: string): SupportedLanguage {
  const normalized = code.toLowerCase().replace(/[-_]/g, '');
  
  switch (normalized) {
    // ... casos existentes
    case 'italiano':    // Novo formato
    case 'it':
      return SUPPORTED_LANGUAGES.IT;
    // ...
  }
}
```

### Debugging

```typescript
// Log de normalização
console.log('Input:', userInput);
console.log('Normalized:', normalizeLangCode(userInput));
console.log('API Code:', toApiLangCode(normalizeLangCode(userInput)));
```

### Testes Sugeridos

- Normalização de códigos edge case
- Validação com inputs inválidos
- Consistency entre ida e volta (normalize → api → normalize)
- Performance com inputs grandes
