---
tags:
  - runtime
  - arquitetura
---

# Arquitetura e Runtime

## Ideia central

O projeto não cria um arquivo Next novo para cada página que nasce no painel.

Em vez disso:

1. o painel salva documentos administrativos locais;
2. publica snapshots JSON;
3. o storefront lê esses snapshots em runtime;
4. a resolucao dinâmica acontece no catch-all do `E-commerce`.

## Beneficios desse modelo

- menor acoplamento entre painel e loja;
- novas páginas dinâmicas sem gerar arquivo em `src/app/e-commerce`;
- melhor caminho para separar deploy do painel e do storefront;
- base mais simples para migrar depois para banco de dados.

## Artefatos publicados

- `site-pages.published.json`
- `manifest.json`
- `storefront-template.published.json`

## Modos de execução

### Runtime de servidor

Quando a loja roda em `yarn dev` ou `next start`:

- novas rotas dinâmicas entram por runtime;
- template e tema atualizados passam a ser lidos sem rebuild;
- o storefront continua rodando durante a troca dos snapshots.

### Export estático

Quando a loja roda como export estático:

- o JSON continua existindo;
- porem uma nova rota precisa de nova exportação para fazer parte da saída estática.

## Arquivos de referência no código

- `src/app/e-commerce/[...cmsPath]/page.tsx`
- `src/features/ecommerce/server/routeResolver.ts`
- `src/features/site-runtime/server/publishedStore.ts`
- `src/features/site-runtime/server/publishedTemplateStore.ts`

## Leitura seguinte

- [[05 - Builder e Namespaces]]
- [[06 - Persistencia e Arquivos]]
