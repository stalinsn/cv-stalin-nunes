# E-commerce (Demo)

Rota: `/e-commerce`

## Escopo

Storefront com estrutura de supermercado e foco em:

- Home com vitrines e banners.
- PLP e PDP.
- Carrinho com drawer e fluxo para checkout.
- Checkout e confirmação.
- Renderização de páginas dinâmicas publicadas pelo painel.
- Consumo de template publicado para header, home, footer, tema e mega menu.

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

### Resolução de rota

- `src/app/e-commerce/[...cmsPath]`
- `src/features/ecommerce/server/routeResolver.ts`
- `src/features/site-runtime/server/publishedStore.ts`

Fluxo:

1. normaliza o caminho pedido;
2. tenta resolver no snapshot publicado;
3. se não encontrar, verifica se o caminho pertence ao storefront nativo;
4. se não pertencer a nenhum dos dois, retorna `not_found`.

Rotas e namespaces reservados:

- `plp`
- `cart`
- `checkout`
- `paginas`
- PDP no padrão `/<slug>/p`

### Snapshot lido

- `site-pages.published.json`
- `manifest.json`
- `storefront-template.published.json`

### Caminho de leitura

- Padrão: `src/data/site-runtime`
- Customizado: `ECOM_CONTENT_PATH=/caminho/compartilhado/site-runtime`

## Template publicado

O storefront tenta resolver o template publicado e, se não houver snapshot válido, usa fallback interno.

Domínios consumidos hoje:

- `theme`
- `header`
- `home`
- `footer`
- `mega menu`

Arquivo lido:

- `storefront-template.published.json`

Resolver:

- `src/features/ecommerce/server/storefrontTemplateResolver.ts`

## Prioridade de tema

O template publicado é a base autoritativa do storefront.

Prioridade efetiva:

1. snapshot publicado pelo painel;
2. query string explícita de inspeção, como `?theme=classic` ou `?campaign=black-friday`;
3. defaults internos do storefront.

O app não reaplica silenciosamente preferências antigas do navegador sobre o que foi publicado pelo admin.

## Modos de execução

- `yarn dev` / `next start`: novas rotas dinâmicas não exigem rebuild.
- `export:ecommerce`: novas rotas exigem nova exportação para compor a saída estática.

Referência detalhada: [../ECOM_CONTENT_RUNTIME.md](../ECOM_CONTENT_RUNTIME.md)

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
