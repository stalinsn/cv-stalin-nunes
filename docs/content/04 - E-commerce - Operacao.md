---
tags:
  - ecommerce
  - storefront
---

# E-commerce - Operação

## Papel do app

O `E-commerce` é o storefront da loja.

Hoje ele entrega:

- home;
- PLP e PDP;
- carrinho e checkout;
- páginas dinâmicas publicadas pelo painel;
- leitura do template publicado para header, home, footer, tema e mega menu.

## Como as páginas dinâmicas entram

O storefront tenta resolver o caminho pedido por runtime.

Ordem prática:

1. normaliza o caminho;
2. procura no snapshot publicado;
3. se não achar, verifica se pertence a uma rota nativa;
4. caso contrario, retorna `not_found`.

## Como o template entra

O app tenta ler `storefront-template.published.json`.

Se não houver snapshot válido:

- usa fallback interno do próprio storefront.

## Prioridade do tema

1. snapshot publicado pelo painel;
2. query string explicita para inspecao local;
3. defaults internos.

## Rotas reservadas

- `plp`
- `cart`
- `checkout`
- `paginas`
- padrão de PDP `/<slug>/p`

## Leitura seguinte

- [[02 - Arquitetura e Runtime]]
- [[06 - Persistencia e Arquivos]]
