[⬅ Voltar ao Índice](../README_INDEX.md)

# constants/languages.ts

> **Status**: `[CORE]` - Configuração centralizada de idiomas suportados

## 📋 Descrição

Arquivo de constantes que centraliza toda a configuração de idiomas do sistema. Define:
- **Idiomas suportados** e seus códigos internos
- **Mapeamento para códigos de API** (formato esperado pelo backend)
- **Metadados** como nomes, flags e configurações específicas
- **Idioma padrão** da aplicação

## 🔧 API

### `SUPPORTED_LANGUAGES`
```typescript
const SUPPORTED_LANGUAGES = {
  PTBR: 'ptbr',
  EN: 'en',
  ES: 'es', 
  FR: 'fr',
  DE: 'de',
} as const;
```

### `LANGUAGE_CONFIG`
```typescript
{
  [idioma]: {
    name: string;       // Nome completo do idioma
    apiCode: string;    // Código para API (pt-br, en-us, etc.)
    flag: string;       // Emoji da bandeira
  }
}
```

### `DEFAULT_LANGUAGE`
- Define o idioma padrão: `ptbr`

## 🏗️ Exemplo de Uso

```typescript
import { 
  SUPPORTED_LANGUAGES, 
  LANGUAGE_CONFIG, 
  DEFAULT_LANGUAGE 
} from '@/constants/languages';

// Verificar idioma suportado
const isSupported = targetLang in LANGUAGE_CONFIG;

// Obter configuração completa
const config = LANGUAGE_CONFIG[SUPPORTED_LANGUAGES.EN];
console.log(config.name);     // "English"
console.log(config.apiCode);  // "en-us"
console.log(config.flag);     // "🇺🇸"
```

## 🔗 Interações

**Usado por:**
- `utils/languageUtils.ts` - Funções utilitárias de idioma
- `hooks/useI18n.ts` - Hook principal de internacionalização
- `lib/translateMock.ts` - Sistema de fallback

**Integra com:**
- API Backend via `apiCode` mapping
- Frontend via códigos internos consistentes

## 🛠️ Considerações Técnicas

### Type Safety
- **TypeScript const assertions** para inferência automática de tipos
- **SupportedLanguage type** gerado automaticamente
- **Compile-time validation** de idiomas válidos

### Extensibilidade
- **Fácil adição** de novos idiomas
- **Retrocompatibilidade** mantida via códigos internos
- **Configuração centralizada** evita duplicação

## 📝 Manutenção

### Adicionando Novo Idioma

1. **Adicionar ao SUPPORTED_LANGUAGES:**
   ```typescript
   const SUPPORTED_LANGUAGES = {
     // ... existentes
     IT: 'it',  // Novo idioma
   } as const;
   ```

2. **Configurar em LANGUAGE_CONFIG:**
   ```typescript
   [SUPPORTED_LANGUAGES.IT]: {
     name: 'Italiano',
     apiCode: 'it-it',
     flag: '🇮🇹',
   },
   ```

3. **Verificar dependências:**
   - Adicionar dados mock em `data/cv-it.ts`
   - Atualizar API backend se necessário
   - Testar normalização em `languageUtils.ts`

### Alterando Idioma Padrão
```typescript
export const DEFAULT_LANGUAGE = SUPPORTED_LANGUAGES.EN; // Exemplo
```

### Debugging
- Verificar consistency entre `apiCode` e backend
- Validar flags rendering em diferentes sistemas
- Testar type inference em TypeScript
