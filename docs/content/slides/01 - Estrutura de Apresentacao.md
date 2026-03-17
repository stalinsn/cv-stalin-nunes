---
tags:
  - slides
  - outline
---

# Estrutura de Apresentação

## Slide 1 - Visão geral

- quais apps existem
- foco atual no painel e storefront

## Slide 2 - Problema que a arquitetura resolve

- evitar gerar arquivo Next para cada página
- desacoplar painel e loja

## Slide 3 - Fluxo de conteúdo

- admin edita
- publica JSON
- loja consome snapshot

## Slide 4 - Template do storefront

- header
- home
- footer
- mega menu
- tema

## Slide 5 - Builder de páginas

- rotas
- namespaces
- editor visual
- publicação

## Slide 6 - Persistência atual

- `src/data/ecommpanel`
- `src/data/site-runtime`

## Slide 7 - Operação diaria

- publicar template
- validar storefront
- publicar páginas
- validar rotas

## Slide 8 - Evolução futura

- modo temporário público
- banco de dados
- produto independente
