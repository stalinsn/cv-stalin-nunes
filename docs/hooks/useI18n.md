[⬅ Voltar ao Índice](../README_INDEX.md)

# useI18n.ts

> **Status**: `[CORE]` - Hook principal para internacionalização e tradução

## 📋 Descrição

Hook central que gerencia todo o estado de internacionalização da aplicação. Implementa:
- **Gerenciamento de estado** para idioma atual e traduções em cache
- **Tradução automática** via IA com fallback inteligente
- **Cache persistente** com localStorage e validações
- **Loading states** e tratamento de erros robusto

## 🔧 API do Hook

### Retorno

```typescript
{
  // Estados principais
  lang: SupportedLanguage;           // Idioma atual
  data: CvData;                      // Dados do CV no idioma atual
  translations: TranslationCache;    // Cache de todas as traduções
  
  // Estados da tradução
  loading: boolean;                  // Estado de carregamento
  error: string | null;              // Mensagem de erro atual
  translationMode: TranslationMode;  // 'ai' | 'mock'
  userAcceptedFallback: boolean;     // Usuário aceitou usar fallback
  status: TranslationStatus;         // Estatísticas da última tradução
  
  // Funções de controle
  handleTranslate: (lang, token?, origem?) => Promise<void>;
  switchLang: (lang) => void;        // Troca para idioma já em cache
  saveTranslation: (lang, data) => void;
  clearTranslations: () => void;
  setTranslationMode: (mode) => void;
  setUserAcceptedFallback: (accepted) => void;
}
```

## 🏗️ Fluxo de Tradução

```
1. handleTranslate(targetLang) chamado
           ↓
2. Verifica cache localStorage
           ↓ (não encontrado)
3. Verifica cache em memória
           ↓ (não encontrado)
4. Chama translateService.translateWithAI()
           ↓
5. Salva resultado nos caches
           ↓
6. Atualiza estado da aplicação
```

### Estados de Fallback

```
IA falha → error state → usuário escolhe → mock translation
                    ↓
             setUserAcceptedFallback(true)
                    ↓
              usa dados estáticos
```

## 🔧 Funcionalidades Principais

### 1. **Tradução Automática**
```typescript
// Traduz para inglês com token de autorização
await handleTranslate('en', 'auth-token-123', 'navbar-click');
```

### 2. **Troca de Idioma (Cache)**
```typescript
// Troca para idioma já traduzido (instantâneo)
switchLang('es');
```

### 3. **Gestão de Cache**
```typescript
// Limpa todas as traduções exceto português
clearTranslations();

// Salva tradução customizada
saveTranslation('fr', customFrenchData);
```

### 4. **Controle de Modo**
```typescript
// Alterna entre IA e mock
setTranslationMode('mock');
```

## 📊 Estados e Dados

### TranslationStatus
```typescript
{
  tokensUsed: number | null;    // Tokens consumidos na IA
  elapsedTime: number | null;   // Tempo de tradução (ms)  
  payloadSize: number | null;   // Tamanho do payload (bytes)
  charCount: number | null;     // Caracteres traduzidos
  model: string;                // Modelo de IA utilizado
}
```

### Cache Management
- **localStorage**: Cache persistente entre sessões
- **Memory cache**: Cache rápido para sessão atual
- **Validation**: Verifica integridade do JSON antes de usar

## 🔗 Interações

**Usado por:**
- `app/page.tsx` - Aplicação principal
- `components/Navbar.tsx` - Seletor de idioma
- `components/*` - Diversos componentes que precisam de dados traduzidos

**Usa:**
- `lib/translateService.ts` - Interface de tradução
- `utils/translationCache.ts` - Gerenciamento de cache
- `hooks/useLocalStorage.ts` - Persistência SSR-safe
- `constants/languages.ts` - Configurações de idioma

## 🛠️ Considerações Técnicas

### Performance
- **useCallback** em funções críticas para evitar re-renders
- **Cache em memória** para trocas rápidas de idioma
- **localStorage** para persistência entre sessões

### SSR Compatibility
- **Hidratação segura** com `useLocalStorage`
- **Estado inicial consistente** entre servidor e cliente
- **Fallbacks graceful** para ambiente não-browser

### Error Handling
- **Mensagens específicas** para diferentes tipos de erro
- **Fallback automático** para dados estáticos
- **Recovery mechanism** via user acceptance

## 📝 Manutenção

### Adicionando Novos Idiomas
1. Atualizar `constants/languages.ts`
2. Adicionar dados mock em `data/cv-{lang}.ts`  
3. Testar fluxo de tradução e fallback

### Debugging
- Verificar estado via React DevTools
- Logs de cache no localStorage
- Status da última tradução no `status` object

### Troubleshooting Comum
- **"Tradução não salva"** → Verificar localStorage permissions
- **"Erro de hidratação"** → Verificar SSR compatibility
- **"Cache inválido"** → Limpar localStorage ou atualizar versão
