[⬅ Voltar ao Índice](../../DOCUMENTATION.md)

# FallbackModal

## 1. Descrição do Componente
Modal exibido quando a tradução automática falha, oferecendo ao usuário a opção de usar uma tradução mock.

## 2. Propriedades
- `open: boolean` — Controla a exibição do modal
- `onAccept: () => void` — Callback para aceitar o fallback
- `onCancel: () => void` — Callback para recusar o fallback

## 3. Funcionalidades
- Exibe mensagem de erro e opções de ação.
- Garante melhor experiência em caso de falha na IA.

## 4. Interações
- Usado em conjunto com o hook de tradução e status global.

## 5. Considerações de Manutenção
- Mensagens podem ser internacionalizadas.
- Certifique-se de tratar corretamente o estado de abertura.

## 6. Links de referência
- Testes: (Adicionar link se houver)
- Funcional: Usado em `src/app/page.tsx`
