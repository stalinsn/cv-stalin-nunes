[⬅ Voltar ao Índice](../README_INDEX.md)

# translateService.ts

> **Status**: `[CORE]` - Interface principal do sistema de tradução

## 📋 Descrição

Serviço central que atua como interface entre o frontend e a API de tradução. Responsável por:
- Comunicação com `/api/translate` 
- Tratamento de erros robustos
- Tipagem TypeScript rigorosa
- Transformação de dados para formato esperado

## 🔧 API

### `translateWithAI(cvData, targetLang, token?, origem?)`

**Parâmetros:**
- `cvData: CvData` — Dados completos do currículo
- `targetLang: string` — Código do idioma (formato API: `pt-br`, `en-us`, etc.)
- `token?: string` — Token de autorização (opcional)
- `origem?: string` — Identificador da origem para analytics (opcional)

**Retorno:**
```typescript
Promise<TranslationResult> {
  translated: CvData;    // Currículo traduzido
  tokensUsed: number;    // Tokens consumidos na tradução
}
```

**Exceções:**
- `Error` com mensagem específica em caso de falha HTTP ou dados inválidos

## 🏗️ Implementação

```typescript
// Exemplo de uso
import { translateWithAI } from '@/lib/translateService';

try {
  const result = await translateWithAI(cvData, 'en-us', token, 'web-app');
  console.log('Tradução concluída:', result.translated);
  console.log('Tokens utilizados:', result.tokensUsed);
} catch (error) {
  console.error('Falha na tradução:', error.message);
}
```

## 🔄 Fluxo de Dados

```
Frontend (useI18n)
       ↓
translateService.translateWithAI()
       ↓
POST /api/translate
       ↓
OpenAI API + Validation
       ↓
Response: { translated, tokensUsed }
       ↓
TranslationResult
```

## 🔗 Interações

**Usado por:**
- `hooks/useI18n.ts` - Hook principal de internacionalização

**Depende de:**
- `/api/translate` - Endpoint backend
- `types/translation.ts` - Tipagens
- `types/cv.ts` - Estrutura de dados do CV

## 🛠️ Considerações Técnicas

### Tratamento de Erros
- Valida resposta HTTP antes de parsing
- Mensagens de erro específicas e úteis
- Fallback gracioso para dados inválidos

### Performance
- Conexão direta com API (sem middleware desnecessário)
- Payload mínimo e otimizado
- Timeout implícito via fetch defaults

### Segurança
- Validação de entrada via TypeScript
- Token de autorização opcional
- Dados sensíveis não expostos nos logs

## 📝 Manutenção

**Para adicionar suporte a novos idiomas:**
1. Atualizar `constants/languages.ts`
2. Verificar se API backend suporta o idioma
3. Adicionar dados mock em `translateMock.ts`

**Para debugging:**
- Habilitar logs de rede no DevTools
- Verificar payload enviado para `/api/translate`
- Validar formato da resposta recebida
