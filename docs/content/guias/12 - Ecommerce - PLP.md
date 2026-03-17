---
tags:
  - guia
  - ecommerce
  - plp
---

# Ecommerce - PLP

## O que você encontra aqui

Esta nota explica como a PLP é montada no projeto atual.

A pergunta principal aqui é:

- de onde vem a lista de produtos;
- quem lê a URL;
- quem filtra e página;
- quem renderiza cada card;
- como o carrinho entra nesse fluxo.

## Arquivos principais

- `src/app/e-commerce/plp/PLPClient.tsx`
- `src/features/ecommerce/lib/plp.ts`
- `src/features/ecommerce/lib/plpDataSource.ts`
- `src/features/ecommerce/components/plp/PLPGrid.tsx`
- `src/features/ecommerce/components/molecules/ProductCard.tsx`
- `src/features/ecommerce/state/OrderFormContext.tsx`

## Trecho 1 - leitura da URL

```ts
const categorySlug = params.get('categoria') || undefined;
const searchTerm = params.get('q') || undefined;
const sortParam = (params.get('sort') as PLPQuery['sort']) || 'relevance';
const pageParam = Math.max(1, Number(params.get('page') || '1')) || 1;
```

## Leitura guiada

A PLP atual nasce orientada por query string.

Ela não depende de estado global para saber o que mostrar. Ela lê diretamente da URL:

- categoria;
- termo de busca;
- ordenação;
- página;
- filtros repetidos.

Isso é muito bom para a explicação porque deixa claro que a página é reconstituível pelo endereço.

## Trecho 2 - fonte de dados unificada

```ts
export async function queryPLPUnified(params: PLPQuery) {
  const source = process.env.NEXT_PUBLIC_DATA_SOURCE || 'local';
  if (source === 'local') {
    return queryLocalPLP(params);
  }

  const { products } = await queryVtexPLP({ ... });
  let result = products;
  result = applyFilters(result, params.filters);
  result = sortProducts(result, params.sort);

  return {
    products: result.slice(start, end),
    total,
    page,
    pageSize,
    category: cat,
    facets: buildFacets(result),
  };
}
```

## O que isso ensina

A PLP foi desenhada para trocar a fonte sem trocar a UI.

Hoje ela pode trabalhar em dois modos:

- `local`, usando o catálogo em memória;
- `vtex`, usando a bridge remota e depois aplicando a mesma lógica de filtros locais.

Esse é um bom exemplo de adaptador de dados.

## Trecho 3 - pipeline local da consulta

```ts
let result = allProducts;
result = filterByCategory(result, cat);
result = filterBySearch(result, searchTerm);
result = applyFilters(result, filters);
if (!sort || sort === 'relevance') {
  result = applyRegionalization(result, regionalization);
}
const total = result.length;
result = sortProducts(result, sort);
```

## Explicação em linguagem natural

A consulta local da PLP é um pipeline funcional simples.

Ela pega a coleção inteira e vai refinando passo a passo:

1. recorte por categoria;
2. recorte por termo;
3. recorte por facets;
4. regionalização quando a ordenação ainda é relevância;
5. ordenação final;
6. paginação.

Isso é fácil de ensinar porque cada função tem uma responsabilidade curta.

## Trecho 4 - regionalização ligada ao order form

```ts
const regionalization = React.useMemo(() => {
  const selectedOption = orderForm.shipping.deliveryOptions[orderForm.shipping.deliveryOptions.length - 1];
  const mode = selectedOption?.id?.startsWith('pickup') ? 'pickup' : 'delivery';
  return {
    postalCode: orderForm.shipping.selectedAddress?.postalCode,
    mode,
  } as const;
}, [orderForm.shipping.deliveryOptions, orderForm.shipping.selectedAddress?.postalCode]);
```

## O que isso ensina

A PLP não está totalmente isolada do checkout.

Ela observa o `orderForm` para entender contexto logístico. Isso permite reordenar produtos com base em entrega ou retirada, sem acoplar a página a uma API externa direta.

## Trecho 5 - renderização da grade

```tsx
export function PLPGrid({ products }: { products: UIProduct[] }) {
  return (
    <div className="plp-grid">
      {products.map((p, index) => (
        <ProductCard
          key={p.id}
          id={p.id}
          name={p.name}
          image={p.image}
          price={p.price}
          listPrice={p.listPrice}
          unit={p.unit}
          packSize={p.packSize}
          url={p.url}
          imagePriority={index < 4}
        />
      ))}
    </div>
  );
}
```

## Leitura técnica

A grade quase não carrega regra. Ela apenas distribui `ProductCard`.

Isso é bom desenho de UI porque:

- a consulta fica numa camada;
- a grade só organiza;
- o card cuida da interação por produto.

## Trecho 6 - o card conversa com o carrinho

```tsx
const { add, inc, dec, state } = useCart();
const item = state.items[id];
const hasItems = !!(item && item.qty > 0);

{!(mounted && hasItems) ? (
  <Button onClick={() => add({ id, name, price, listPrice, image, unit, packSize })}>Adicionar</Button>
) : (
  <QuantitySelector value={item.qty} onDec={() => dec(id)} onInc={() => inc(id)} />
)}
```

## O que isso ensina

A PLP não só exibe catálogo. Ela também é ponto de entrada para o carrinho.

Na prática:

- o card lê o estado atual do item;
- se ainda não existe quantidade, mostra CTA de adicionar;
- se já existe, vira seletor de quantidade.

Esse é um padrão muito bom para explicar composição entre UI e estado compartilhado.

## Ordem de execução da PLP

1. `PLPClient` lê a URL;
2. monta `sort`, `filters`, `page` e contexto regional;
3. escolhe a fonte de dados;
4. executa a consulta;
5. calcula `title`, `facets`, `products` e `total`;
6. renderiza header, toolbar, facets, grid e paginação;
7. cada `ProductCard` pode mutar o `CartContext`.

## Explicando de forma simples

> "A PLP é um orquestrador. Ela não sabe renderizar cada detalhe do produto e nem deveria. Ela lê URL, consulta os dados, passa os produtos para a grade e deixa o card cuidar da ação de compra." 

## Fechamento

Depois desta nota, o aluno já entende que a PLP atual é uma combinação de:

- leitura de URL;
- pipeline de consulta;
- fonte local ou remota;
- componentes de apresentação;
- integração com carrinho.
