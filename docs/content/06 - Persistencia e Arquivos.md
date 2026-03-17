---
tags:
  - persistência
  - json
  - runtime
---

# Persistência e Arquivos

## Persistência administrativa local

### Site builder

Arquivos principais:

- `src/data/ecommpanel/site-routes.json`
- `src/data/ecommpanel/site-pages/<pageId>.json`

Espelho legado:

- `src/data/ecommpanel/site-pages.json`

## Storefront

Arquivos principais:

- `src/data/ecommpanel/storefront/meta.json`
- `src/data/ecommpanel/storefront/theme.json`
- `src/data/ecommpanel/storefront/header.json`
- `src/data/ecommpanel/storefront/home.json`
- `src/data/ecommpanel/storefront/footer.json`

Espelho legado:

- `src/data/ecommpanel/storefront-template.json`

## Publicação para a loja

Arquivos publicados:

- `src/data/site-runtime/site-pages.published.json`
- `src/data/site-runtime/manifest.json`
- `src/data/site-runtime/storefront-template.published.json`

Se `ECOM_CONTENT_PATH` existir, a publicação vai para o diretorio compartilhado definido por essa variavel.

## Regra prática

- `src/data/ecommpanel`: edição administrativa
- `src/data/site-runtime`: consumo publicado pelo storefront

## O que isso prepara para o futuro

A estrutura atual já separa os dominios que podem virar entidades de banco depois:

- theme
- header
- home
- footer
- mega menu
- site routes
- site pages

## Leitura seguinte

- [[02 - Arquitetura e Runtime]]
- [[07 - Runbook Rapido]]
