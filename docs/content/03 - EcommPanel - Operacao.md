---
tags:
  - admin
  - ecommpanel
---

# EcommPanel - Operação

## Papel do app

O `EcommPanel` é a camada administrativa do e-commerce.

Hoje ele concentra:

- autenticação e permissão;
- template do storefront;
- tema visual;
- mega menu;
- criação de rotas;
- editor visual de páginas;
- publicação para a loja.

## Áreas principais do menu

### Template

Subrotas:

- visão geral
- header
- home
- footer

### Tema

Subrotas:

- visão geral
- preset
- overrides

### Mega Menu

Subrotas:

- visão geral
- base
- arvore

### Builder

Áreas:

- rotas
- editor
- blocos

## Comportamento de publicação

### Páginas

- `Salvar rascunho`: atualiza o documento administrativo
- `Publicar`: envia a página para o snapshot consumido pela loja
- `Rascunho`: tira a página do snapshot público

### Template, tema e mega menu

- qualquer publicação sobrescreve o snapshot estrutural completo;
- a loja passa a ler a nova versão em runtime no modo servidor.

## Leitura seguinte

- [[05 - Builder e Namespaces]]
- [[06 - Persistencia e Arquivos]]
- [[07 - Runbook Rapido]]
