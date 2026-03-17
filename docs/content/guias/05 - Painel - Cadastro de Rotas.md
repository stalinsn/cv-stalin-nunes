---
tags:
  - guia
  - admin
  - routes
---

# Painel - Cadastro de Rotas

## O que você encontra aqui

Esta nota mostra como a tela de rotas deixou de trabalhar com slug bruto e passou a trabalhar com namespace operacional.

## Arquivos principais

- `src/features/ecommpanel/components/SiteRoutesManager.tsx`
- `src/features/ecommpanel/siteNamespaces.ts`

## Trecho 1 - definicao dos namespaces

```ts
export const SITE_ROUTE_NAMESPACES: SiteRouteNamespace[] = [
  {
    id: 'landing',
    prefix: 'landing',
    examplePath: 'landing/black-friday',
    layoutPreset: 'three_horizontal',
    starterPlan: [['hero'], ['banner'], ['cta']],
  },
  {
    id: 'institutional',
    prefix: 'institucional',
    examplePath: 'institucional/quem-somos',
    layoutPreset: 'three_vertical',
    starterPlan: [['hero'], ['rich_text'], ['cta']],
  },
];
```

## Leitura guiada

Aqui o painel define um vocabulário operacional.

Ele não diz apenas "como fica a URL". Ele também diz:

- qual é o tipo de página;
- qual preset de layout combina com ela;
- quais blocos iniciais fazem sentido.

## Trecho 2 - montagem do caminho final

```ts
const selectedNamespace = getSiteRouteNamespace(namespaceId);
const composedPath = buildNamespacedRoutePath({ namespaceId, customPrefix, leafPath });
```

## O que isso muda na prática

A tela de rotas agora trabalha com intenção e não só com string.

O usuário monta a rota a partir de:

- um contexto operacional;
- um caminho final;
- e, no caso `custom`, um prefixo manual.

## Trecho 3 - criação da rota

```tsx
const req = await fetch('/api/ecommpanel/site/routes', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-csrf-token': csrfToken,
  },
  body: JSON.stringify({ title, slug: composedPath }),
});
```

## Ordem de execução

1. a tela carrega rotas e lixeira;
2. o operador escolhe namespace;
3. digita o `leafPath`;
4. o sistema monta `composedPath`;
5. o POST envia o caminho final já normalizado para a API.

## Explicando de forma simples

> "A tela de rotas não cria só URL. Ela cria uma página dentro de um sistema operacional de caminhos. Isso torna o builder mais consistente e prepara a migração futura para banco."

## Próxima leitura

- [[06 - Painel - Editor Visual]]
- [[08 - Painel - Persistencia e Publicacao]]
