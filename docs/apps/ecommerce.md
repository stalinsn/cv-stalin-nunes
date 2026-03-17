# E-commerce (Demo)

Rota: `/e-commerce`

## Escopo

Storefront com estrutura de supermercado e foco em:

- Home com vitrines e banners.
- PLP e PDP.
- Carrinho com drawer e fluxo para checkout.
- Checkout e confirmação.
- Renderização de páginas dinâmicas publicadas pelo painel.

## Rotas principais

- `/e-commerce`
- `/e-commerce/plp`
- `/e-commerce/[slug]/p`
- `/e-commerce/cart`
- `/e-commerce/checkout`
- `/e-commerce/checkout/confirmation`
- `/e-commerce/[...cmsPath]` (rotas dinâmicas publicadas)

## Fonte de dados

A variável `NEXT_PUBLIC_DATA_SOURCE` define a origem dos dados:

- `local`
- `vtexMock`
- `vtexLive`

Com `vtexLive`, configure também as variáveis `VTEX_*` no `.env.local`.

## Páginas dinâmicas publicadas pelo painel

O e-commerce tenta resolver páginas dinâmicas publicadas e, se não encontrar, aplica fallback para rotas nativas.

### Snapshot lido

- `site-pages.published.json`
- `manifest.json`

### Caminho de leitura

- Padrão: `src/data/site-runtime`
- Customizado: `ECOM_CONTENT_PATH=/caminho/compartilhado/site-runtime`

## Comandos úteis

```bash
yarn dev
yarn build
yarn start
yarn lint
yarn export:ecommerce
```

## Operação isolada (app exportado)

```bash
cd exports/ecommerce
yarn install
yarn dev
```

Se usar integração com painel separado, configure `ECOM_CONTENT_PATH` apontando para o diretório compartilhado de snapshot publicado.
