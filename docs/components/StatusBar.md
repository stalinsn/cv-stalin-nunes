[⬅ Voltar ao Índice](../README_INDEX.md)

# StatusBar

## 1. Descrição do Componente
Exibe informações de status sobre a tradução, como tokens usados, tempo, payload, etc.

## 2. Propriedades
- `loading: boolean` — Indica se está carregando
- `statusMessage: string` — Mensagem de status
- `tokensUsed: number | null`
- `elapsedTime: number | null`
- `payloadSize: number | null`
- `charCount: number | null`
- `model: string`

## 3. Funcionalidades
- Exibe estatísticas detalhadas da tradução.
- Mostra mensagens dinâmicas de status.

## 4. Interações
- Interage com hooks de tradução e status global.

## 5. Considerações de Manutenção
- Atualize as propriedades conforme novas métricas forem adicionadas.

## 6. Links de referência
- Testes: (Adicionar link se houver)
- Funcional: Usado em `src/app/page.tsx`
