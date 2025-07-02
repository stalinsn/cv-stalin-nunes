# translateService

## 1. Descrição
Serviço central para orquestrar as traduções, escolhendo entre IA, gratuita ou mock.

## 2. Parâmetros
- `text: string` — Texto a ser traduzido
- `targetLang: string` — Idioma de destino
- `mode: string` — Modo de tradução (ai, free, mock)

## 3. Funcionalidades
- Decide qual serviço de tradução usar

## 4. Interações
- Usado por hooks e componentes de tradução

## 5. Considerações de Manutenção
- Mantenha a lógica de fallback atualizada

## 6. Links de referência
- Funcional: Usado em `useI18n`
