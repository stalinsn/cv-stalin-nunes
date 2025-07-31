[⬅ Voltar ao Índice](../README_INDEX.md)

# utils/translationCache.ts

> **Status**: `[CACHE]` - Sistema de cache persistente para traduções

## 📋 Descrição

Utilitário robusto para gerenciamento de cache de traduções no localStorage. Implementa:
- **Cache versionado** para invalidação controlada
- **Validação de integridade** dos dados armazenados
- **SSR compatibility** com verificações de ambiente
- **Estatísticas de uso** para monitoramento

## 🔧 API

### `getTranslationCache(text: string, lang: string): string | null`

Recupera tradução do cache local.

```typescript
const cached = getTranslationCache(JSON.stringify(cvData), 'en');
if (cached) {
  const translatedData = JSON.parse(cached);
  // Usar dados do cache
}
```

### `setTranslationCache(text: string, lang: string, translation: string): void`

Armazena tradução no cache com validação.

```typescript
const result = await translateAPI(data, 'es');
setTranslationCache(
  JSON.stringify(data), 
  'es', 
  JSON.stringify(result.translated)
);
```

### `clearTranslationCache(): void`

Remove todo o cache de traduções.

```typescript
clearTranslationCache(); // Limpa tudo
console.log('Cache limpo!');
```

### `getCacheStats(): { count: number; totalSize: number }`

Obtém estatísticas do cache atual.

```typescript
const stats = getCacheStats();
console.log(`${stats.count} traduções, ${stats.totalSize} bytes`);
```

## 🏗️ Funcionamento Interno

### Sistema de Chaves
```
Formato: "translation_v1_{lang}_{hash}"
Exemplo: "translation_v1_en_a1b2c3d4"
```

### Hash Algorithm
- **djb2 algorithm** para performance
- **Collision resistance** adequada para uso
- **Deterministic** para consistency entre sessões

### Validação de Dados
```typescript
// Antes de salvar
JSON.parse(translation); // Valida se é JSON válido

// Antes de retornar  
JSON.parse(cached);      // Valida integridade do cache
```

## 🛠️ Considerações Técnicas

### Performance
- **O(1) lookups** via localStorage native
- **Hash generation** otimizada (< 1ms para CV completo)
- **Lazy validation** apenas quando necessário

### Robustez
- **try/catch** em todas as operações localStorage
- **Graceful degradation** se localStorage indisponível
- **Version prefix** para invalidação de cache antigo

### Memory Management
- **Automatic cleanup** via `clearTranslationCache()`
- **Size monitoring** via `getCacheStats()`
- **No memory leaks** (uses browser storage, not JS memory)

## 🔗 Interações

**Usado por:**
- `hooks/useI18n.ts` - Cache principal de traduções
- `app/page.tsx` - Inicialização com cache existente

**Independente de:**
- APIs externas
- Componentes React
- State management libraries

## 📊 Exemplo de Fluxo

```typescript
// 1. Verificar cache antes de traduzir
const cacheKey = JSON.stringify(cvData);
const cached = getTranslationCache(cacheKey, 'fr');

if (cached) {
  // Cache hit - usar dados existentes
  const translatedData = JSON.parse(cached);
  return translatedData;
} else {
  // Cache miss - traduzir via API
  const result = await translateAPI(cvData, 'fr');
  
  // Salvar para próxima vez
  setTranslationCache(cacheKey, 'fr', JSON.stringify(result.translated));
  
  return result.translated;
}
```

## 📝 Manutenção

### Invalidação de Cache

Para forçar invalidação (ex: mudança de estrutura de dados):

```typescript
// Método 1: Alterar versão no código
const CACHE_VERSION = 'v2_'; // era 'v1_'

// Método 2: Limpar programaticamente
clearTranslationCache();
```

### Monitoramento

```typescript
// Verificar usage do cache
const stats = getCacheStats();
if (stats.totalSize > 5000000) { // > 5MB
  console.warn('Cache muito grande, considerar limpeza');
}
```

### Debugging

```typescript
// Ver todas as chaves de cache
Object.keys(localStorage).filter(k => k.startsWith('translation_'));

// Inspecionar entrada específica
const cached = getTranslationCache(data, 'en');
console.log('Cache entry:', cached);
```

### Troubleshooting

**Cache não salva:**
- Verificar localStorage permissions
- Validar se JSON é serializável
- Checar quota do storage

**Cache corrompido:**
- Executar `clearTranslationCache()`
- Verificar mudanças na estrutura de dados
- Atualizar versão do cache
