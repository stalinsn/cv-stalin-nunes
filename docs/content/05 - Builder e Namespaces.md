---
tags:
  - builder
  - routes
  - namespace
---

# Builder e Namespaces

## Modelo atual

O builder não trata mais a página como um slug solto.

Ele trabalha com:

- `namespace`
- `caminho final`

Isso ajuda a padronizar operação, layout inicial e organização futura em banco.

## Namespaces operacionais

### Raiz

Exemplo:

- `quem-somos`

Uso:

- páginas diretas da loja sem pasta operacional.

### Landing

Exemplo:

- `landing/black-friday`

Uso:

- páginas de conversão e entrada de campanha.

### Campanhas

Exemplo:

- `campanhas/dia-das-maes`

Uso:

- calendario comercial recorrente.

### Institucional

Exemplo:

- `institucional/quem-somos`

Uso:

- páginas de marca, ajuda e confiança.

### Conteúdo

Exemplo:

- `conteudo/guia-do-cafe`

Uso:

- editoriais, SEO e materiais orgânicos.

### Custom

Uso:

- prefixos livres fora do padrão operacional atual.

## Presets iniciais

Cada namespace já sugere:

- um `layoutPreset`;
- um conjunto inicial de blocos.

Isso faz a página nascer mais próxima do uso esperado.

## Protecoes

O painel bloqueia caminhos reservados do storefront para evitar colisão com rotas nativas.

## Leitura seguinte

- [[03 - EcommPanel - Operacao]]
- [[06 - Persistencia e Arquivos]]
