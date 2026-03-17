---
tags:
  - guia
  - template
  - theme
---

# Runtime - Template e Tema

## O que você encontra aqui

Esta nota explica como o storefront:

- resolve o template publicado;
- transforma overrides em CSS variables;
- aplica isso no layout inteiro.

## Arquivos principais

- `src/features/ecommerce/server/storefrontTemplateResolver.ts`
- `src/features/site-runtime/storefrontTemplate.ts`
- `src/features/site-runtime/storefrontTheme.ts`
- `src/app/e-commerce/layout.tsx`

## Trecho 1 - o contrato do template

```ts
export type StorefrontTemplate = {
  schemaVersion: number;
  updatedAt: string;
  brandName: string;
  theme: StorefrontTemplateTheme;
  header: { ... };
  home: { ... };
  footer: { ... };
};
```

## Leitura guiada

O template é o contrato central do storefront publicado.

Ele junta três camadas:

- identidade visual;
- estrutura fixa da loja;
- módulos que podem ser ligados e desligados.

Ou seja, ele não é só "tema". Ele é um documento estrutural.

## Trecho 2 - resolver o template publicado

```ts
export function resolveStorefrontTemplate(): StorefrontTemplate {
  const snapshot = readPublishedRuntimeStorefrontTemplate();
  if (!snapshot?.template) {
    return createDefaultStorefrontTemplate();
  }

  return normalizeStorefrontTemplate(snapshot.template);
}
```

## O que isso ensina

A loja sempre tenta trabalhar com um documento normalizado.

A ordem é:

1. tenta ler o snapshot publicado;
2. se não existir, cai para default;
3. normaliza a estrutura antes de usar.

Isso evita que o resto da UI precise ficar se defendendo o tempo inteiro.

## Trecho 3 - converter override em variavel CSS

```ts
if (backgroundColor) variables['--ecom-color-bg'] = backgroundColor;
if (surfaceColor) variables['--ecom-color-surface'] = surfaceColor;
if (brandColor) {
  variables['--ecom-color-brand'] = brandColor;
}
if (headerPromoStartColor) {
  variables['--ecom-header-promo-bg'] = buildGradient('90deg', headerPromoStartColor, headerPromoEndColor);
}
```

## Lógica por tras

`resolveStorefrontTheme` não renderiza componente. Ela traduz configuração em variáveis CSS.

Isso é importante para explicar arquitetura:

- a configuração continua em TypeScript/JSON;
- a renderização final continua em CSS;
- a ponte entre os dois mundos são as custom properties.

## Trecho 4 - aplicação no layout

```tsx
const template = resolveStorefrontTemplate();
const resolvedTheme = resolveStorefrontTheme(template.theme);
const storefrontMainProps = {
  className: 'ecom',
  'data-theme': resolvedTheme.preset,
  'data-campaign': resolvedTheme.campaign,
  style: resolvedTheme.variables,
};
```

## Ordem de execução

1. o layout resolve o template;
2. resolve o tema a partir do template;
3. injeta `data-theme`, `data-campaign` e `style` no `<main>`;
4. header, footer e páginas consomem esse mesmo contexto visual.

## Explicando de forma simples

> "O painel não mexe direto no CSS. Ele publica um contrato. O storefront lê esse contrato, deriva variáveis CSS e aplica isso no layout raiz. Assim a interface inteira muda sem reescrever os componentes."

## Próxima leitura

- [[07 - Painel - Template Tema MegaMenu]]
- [[08 - Painel - Persistencia e Publicacao]]
