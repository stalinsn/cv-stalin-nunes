[⬅ Voltar ao Índice](../README_INDEX.md)

# PasswordModal

## 1. Descrição do Componente
Modal para solicitação de senha, utilizado para proteger funcionalidades sensíveis ou administrativas.

## 2. Propriedades
- `open: boolean` — Controla a exibição do modal
- `onSubmit: (password: string) => void` — Callback para submissão da senha
- `onCancel: () => void` — Callback para cancelar

## 3. Funcionalidades
- Exibe campo de senha e botões de ação
- Chama callbacks conforme ação do usuário

## 4. Interações
- Pode ser usado em qualquer fluxo que exija autenticação

## 5. Considerações de Manutenção
- Certifique-se de tratar o estado de abertura e callbacks corretamente
- Mensagens podem ser internacionalizadas

## 6. Links de referência
- Testes: (Adicionar link se houver)
- Funcional: Usado em fluxos protegidos
