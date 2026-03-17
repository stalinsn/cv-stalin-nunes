---
tags:
  - arquitetura
  - overview
---

# Visão Geral do Projeto

## Apps principais

O monorepo tem quatro apps principais:

- `CV` em `/cv`
- `MOTD` em `/motd`
- `E-commerce` em `/e-commerce`
- `EcommPanel` em `/ecommpanel`

## Foco atual da integração

O eixo de trabalho mais importante neste momento é a dupla:

- `EcommPanel`: operação administrativa
- `E-commerce`: storefront que consome conteúdo publicado

## O que já existe hoje

- template estrutural do storefront editavel;
- tema visual com presets, campanha é overrides;
- mega menu operado em tela dedicada;
- builder de páginas dinâmicas;
- editor visual de páginas por rota;
- persistência local por JSON;
- runtime publicado para consumo desacoplado.

## Leitura seguinte

- [[02 - Arquitetura e Runtime]]
- [[03 - EcommPanel - Operacao]]
- [[04 - E-commerce - Operacao]]
