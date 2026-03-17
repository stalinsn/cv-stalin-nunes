---
tags:
  - guia
  - integração
  - runtime
---

# Integração End-to-End - Admin para Storefront

## O que você encontra aqui

Esta nota amarra o fluxo inteiro de integração entre `EcommPanel` e `E-commerce`.

## Pergunta central

Quando alguém mexe no painel, o que acontece até isso aparecer na loja?

## Fluxo 1 - páginas dinâmicas

### Passo 1 - UI do admin

A tela de rotas ou editor faz `fetch` para a API interna.

Exemplos:

- `POST /api/ecommpanel/site/routes`
- `PUT /api/ecommpanel/site/pages/[pageId]`
- `POST /api/ecommpanel/site/pages/[pageId]/publish`

### Passo 2 - API do admin

A API valida:

- sessão;
- permissão;
- origem;
- CSRF;
- formato do caminho;
- colisão com rota nativa.

### Passo 3 - store server-side

O `siteBuilderStore`:

- salva o registro de rotas;
- salva os documentos detalhados por página;
- mantem espelho legado;
- publica o snapshot do runtime.

### Passo 4 - snapshot publicado

Arquivos principais:

- `site-pages.published.json`
- `manifest.json`

### Passo 5 - storefront

Quando o usuário acessa uma rota dinâmica:

1. o catch-all recebe o caminho;
2. o `routeResolver` classifica a rota;
3. se o snapshot tiver a página, ela vira `CmsPageRenderer`.

## Fluxo 2 - template, tema e mega menu

### Passo 1 - UI do admin

As três telas publicam pelo mesmo endpoint estrutural:

- `PATCH /api/ecommpanel/site/template`

### Passo 2 - API do admin

A API:

- autentica;
- autoriza com `site.layout.manage`;
- valida origem e CSRF;
- entrega o documento para o store.

### Passo 3 - store server-side

O `storefrontTemplateStore`:

- normaliza o template;
- salva `meta`, `theme`, `header`, `home`, `footer`;
- mantem agregado legado;
- publica `storefront-template.published.json`.

### Passo 4 - storefront

O layout da loja:

1. resolve o template publicado;
2. resolve o tema em CSS variables;
3. passa o template para `Header`, `Footer` e `Home`.

## Trecho compacto do fluxo de páginas

```text
UI admin
-> API /site/pages
-> siteBuilderStore
-> site-pages.published.json
-> routeResolver
-> CmsPageRenderer
```

## Trecho compacto do fluxo estrutural

```text
UI admin
-> API /site/template
-> storefrontTemplateStore
-> storefront-template.published.json
-> EcommerceLayout
-> Header / Home / Footer
```

## O que significa "integração" neste projeto

Integração aqui não quer dizer chamada direta do painel para um backend externo.

Hoje ela significa:

- o admin publica artefatos;
- o storefront consome esses artefatos;
- os dois lados compartilham um contrato de dados.

Essa é uma integração desacoplada por runtime de conteúdo.

## Quando precisa rebuild e quando não precisa

### Não precisa rebuild

Quando a loja roda em `yarn dev` ou `next start`:

- nova página dinâmica publicada;
- alteração de template;
- alteração de tema;
- alteração de mega menu.

### Precisa nova exportação

Quando a loja roda como export estático e você quer consolidar novas rotas na saída estática.

## Explicando de forma simples

> "O painel não empurra componente para a loja. Ele publica contrato. A loja lê esse contrato e se reconfigura em runtime. Isso é o centro da arquitetura que construímos até aqui."

## Fechamento

Se alguém entender esta nota e a nota [[09 - APIs do Admin - Site Builder e Template]], já consegue explicar a integração inteira com segurança técnica.
