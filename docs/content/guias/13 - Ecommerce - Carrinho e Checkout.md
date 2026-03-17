---
tags:
  - guia
  - ecommerce
  - carrinho
  - checkout
---

# Ecommerce - Carrinho e Checkout

## O que você encontra aqui

Esta nota explica o fluxo que vai do clique em `Adicionar` até a criação simulada do pedido.

A ideia é separar mentalmente três camadas:

- `CartContext`, que guarda itens e quantidades;
- `OrderFormContext`, que projeta o carrinho para um formato de checkout;
- `CheckoutView`, que valida a jornada e envia o pedido.

## Arquivos principais

- `src/app/e-commerce/providers.tsx`
- `src/features/ecommerce/state/CartContext.tsx`
- `src/features/ecommerce/state/OrderFormContext.tsx`
- `src/features/ecommerce/components/cart/CartView.tsx`
- `src/features/ecommerce/components/cart/CartSummary.tsx`
- `src/features/ecommerce/components/cart/CartShipping.tsx`
- `src/features/ecommerce/components/checkout/CheckoutView.tsx`
- `src/app/api/checkout/route.ts`
- `src/features/ecommerce/lib/vtexCheckoutService.ts`

## Trecho 1 - providers aninhados

```tsx
<CartProvider>
  <OrderFormProvider>{children}</OrderFormProvider>
</CartProvider>
```

## Leitura guiada

A ordem importa.

O `OrderFormProvider` depende do `CartProvider`, porque ele transforma os itens do carrinho em uma estrutura maior de checkout.

Em uma explicação orientada, eu colocaria assim:

> "O carrinho é a matéria-prima. O order form é a projeção comercial e logística desse carrinho."

## Trecho 2 - reducer do carrinho

```ts
type Action =
  | { type: 'ADD'; payload: Omit<CartItem, 'qty'> & { qty?: number } }
  | { type: 'INC'; id: string }
  | { type: 'DEC'; id: string }
  | { type: 'REMOVE'; id: string }
  | { type: 'CLEAR' }
  | { type: 'HYDRATE'; payload: CartState };
```

## O que isso ensina

O carrinho é propositalmente pequeno.

Ele sabe fazer poucas coisas, mas faz isso muito bem:

- hidratar do storage;
- adicionar;
- incrementar;
- decrementar;
- remover;
- limpar.

Essa simplicidade ajuda a não contaminar o carrinho com regra de frete, cupom e pagamento.

## Trecho 3 - order form sincronizado com o carrinho

```ts
const items: OrderFormItem[] = Object.values(cart.items).map((item) => ({
  id: item.id,
  name: item.name,
  image: item.image,
  price: item.price,
  listPrice: item.listPrice,
  unit: item.unit,
  packSize: item.packSize,
  quantity: item.qty,
}));

const pricing = buildOrderPricing({
  items,
  shipping: prev.shipping,
  coupon: prev.marketingData.coupon,
});
```

## Explicação em linguagem natural

O `OrderFormContext` fica observando o carrinho e recalcula a visão comercial.

Ou seja:

- `CartContext` não conhece totalizador;
- `OrderFormContext` conhece.

Ele transforma quantidade e preço em uma entidade mais rica:

- items do pedido;
- totalizadores;
- valor final;
- mensagens de cupom;
- shipping;
- paymentData;
- preferencias do cliente.

## Trecho 4 - resumo do carrinho mexe no order form

```tsx
const { orderForm, updateMarketing } = useOrderForm();

<button onClick={() => updateMarketing({ coupon })}>Aplicar</button>
```

## O que isso ensina

Cupom não altera o carrinho bruto. Cupom altera o `marketingData` do order form.

Esse detalhe é importante na explicação porque mostra que nem toda mutação da compra deveria cair no mesmo estado.

## Trecho 5 - frete no carrinho

```tsx
const addr = await lookupCep(cep);
const { option } = estimateShipping(cep);
setShipping({ address: addr ? { ... } : null, option });
```

## Leitura técnica

A área de frete do carrinho injeta endereço e modalidade no order form.

Quando o projeto está em modo VTEX vivo, o `OrderFormContext` ainda tenta enriquecer isso chamando `simulateShipping`.

Ou seja, o fluxo atual mistura:

- simulação local simples;
- integração opcional com VTEX.

## Trecho 6 - validação por etapas no checkout

```ts
function handleContinue(nextStep: CheckoutStep) {
  if (shouldValidate('profile', nextStep) && !validateProfile()) return;
  if (shouldValidate('address', nextStep) && !validateAddress()) return;
  if (shouldValidate('shipping', nextStep) && !validateShipping()) return;
  if (shouldValidate('payment', nextStep) && !validatePayment()) return;
  openStep(nextStep);
}
```

## O que isso ensina

O checkout não valida tudo o tempo todo.

Ele valida progressivamente, conforme o usuário avanca.

Isso é uma boa oportunidade de explicar com clareza a diferença entre:

- wizard de etapas;
- validação incremental;
- validação final antes do submit.

## Trecho 7 - fechamento do pedido

```ts
fetch('/api/checkout', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
})
  .then(async (response) => {
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  })
  .then((result) => {
    clear();
    setOrderForm((prev) => ({ ...prev, items: [], totalizers: [], value: 0 }));
    router.push(`/e-commerce/checkout/confirmation?orderId=${encodeURIComponent(result.orderId)}`);
  })
```

## Explicação em linguagem natural

A tela de checkout monta um payload consolidado do pedido e envia para a API interna.

Se der certo:

- limpa o carrinho;
- limpa o miolo transacional do order form;
- redireciona para confirmação.

## Trecho 8 - API de checkout

```ts
if (!Array.isArray(body.items) || body.items.length === 0) {
  return NextResponse.json({ error: 'Carrinho vazio' }, { status: 400 });
}
if (!body.clientProfileData || !body.clientProfileData.email) {
  return NextResponse.json({ error: 'Dados do cliente incompletos' }, { status: 400 });
}
if (!body.shipping || !body.shipping.selectedAddress) {
  return NextResponse.json({ error: 'Endereco não informado' }, { status: 400 });
}
if (!Array.isArray(body.payments) || body.payments.length === 0) {
  return NextResponse.json({ error: 'Forma de pagamento não selecionada' }, { status: 400 });
}
```

## O que isso ensina

Mesmo com validação na UI, a API ainda valida o mínimo obrigatorio.

Isso é o desenho correto:

- a UI guia;
- a API protege a consistencia.

## Ordem de execução do fluxo completo

1. o usuário adiciona produto na PLP ou PDP;
2. o `CartContext` persiste itens no navegador;
3. o `OrderFormContext` deriva items, totalizadores e valor final;
4. a página de carrinho exibe items, cupom e frete;
5. o checkout coleta perfil, endereço, shipping e pagamento;
6. o cliente envia `POST /api/checkout`;
7. a API valida o payload e cria um `orderId` simulado;
8. a UI limpa o estado e vai para confirmação.

## Explicando de forma simples

> "Carrinho e checkout não são a mesma coisa. O carrinho guarda a intenção de compra. O order form organiza essa intenção em estrutura comercial e logística. O checkout apenas conduz o usuário pela validação dessa estrutura até o submit final." 

## Fechamento

Depois desta nota, o aluno consegue seguir o fluxo inteiro da compra sem se perder entre componentes, contextos e API.
