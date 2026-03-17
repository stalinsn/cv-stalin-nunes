---
tags:
  - código
  - mapa
---

# Estrutura do Código

## Pastas centrais para este fluxo

### App do storefront

- `src/app/e-commerce`

### App do painel

- `src/app/ecommpanel`
- `src/app/api/ecommpanel`

### Runtime compartilhado

- `src/features/site-runtime`

### Features do admin

- `src/features/ecommpanel`

### Features do storefront

- `src/features/ecommerce`

### Dados locais

- `src/data/ecommpanel`
- `src/data/site-runtime`

## Pontos técnicos importantes

### Resolver de páginas

- `src/app/e-commerce/[...cmsPath]/page.tsx`
- `src/features/ecommerce/server/routeResolver.ts`

### Persistência publicada

- `src/features/site-runtime/server/publishedStore.ts`
- `src/features/site-runtime/server/publishedTemplateStore.ts`

### Persistência administrativa

- `src/features/ecommpanel/server/siteBuilderStore.ts`
- `src/features/ecommpanel/server/storefrontTemplateStore.ts`

### Contratos de namespace

- `src/features/ecommpanel/siteNamespaces.ts`
- `src/features/site-runtime/routeRules.ts`

## Leitura seguinte

- [[02 - Arquitetura e Runtime]]
- [[05 - Builder e Namespaces]]
