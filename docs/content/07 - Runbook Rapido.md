---
tags:
  - runbook
  - operação
---

# Runbook Rápido

## Desenvolvimento local

```bash
yarn install
yarn dev
```

Acessos:

- `http://localhost:3000/e-commerce`
- `http://localhost:3000/ecommpanel/login`

## Fluxo mínimo de validação

1. entrar no painel;
2. alterar tema ou template;
3. publicar;
4. validar refletido na loja;
5. criar rota no builder;
6. abrir editor da página;
7. salvar rascunho;
8. publicar;
9. validar a rota no storefront.

## Modo desacoplado

```bash
yarn export:ecommerce
yarn export:ecommpanel
```

## Observação importante

- `server runtime`: novas rotas entram sem rebuild;
- `export estatico`: nova rota exige nova exportação.

## Quando olhar rollback

Se a publicação sair errada, os arquivos publicados principais para rollback rápido sao:

- `site-pages.published.json`
- `manifest.json`
- `storefront-template.published.json`

## Leitura seguinte

- [[06 - Persistencia e Arquivos]]
- [[90 - Glossario]]
