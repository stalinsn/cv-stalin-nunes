---
tags:
  - guia
  - admin
  - template
  - theme
  - megamenu
---

# Painel - Template Tema MegaMenu

## O que você encontra aqui

Aqui a ideia é explicar por que o painel foi quebrado em três frentes diferentes:

- template estrutural;
- tema visual;
- mega menu.

## Arquivos principais

- `src/features/ecommpanel/components/StorefrontTemplateManager.tsx`
- `src/features/ecommpanel/components/StorefrontThemeManager.tsx`
- `src/features/ecommpanel/components/StorefrontMegaMenuManager.tsx`

## Trecho 1 - template manager como orquestrador

```tsx
const showOverview = scope === 'all';
const showHeaderCard = scope === 'all' || scope === 'header';
const showHomeCard = scope === 'all' || scope === 'home';
const showFooterCard = scope === 'all' || scope === 'footer';

function updateTemplate(mutator: (draft: StorefrontTemplate) => void) {
  setTemplate((prev) => {
    const next = cloneStorefrontTemplate(prev);
    mutator(next);
    return next;
  });
}
```

## Leitura guiada

O manager do template foi desenhado como um editor por escopo.

Ele não cria um estado para cada campo de forma solta. Ele trabalha em cima de um documento `StorefrontTemplate` clonado e mutado localmente.

Isso fácilita:

- dividir a tela por subrotas;
- manter consistencia do documento;
- publicar um snapshot único no final.

## Trecho 2 - theme manager

```tsx
const resolvedTheme = resolveStorefrontTheme(template.theme);
const themeOverrideCount = countStorefrontThemeOverrides(template.theme.overrides);

function setThemeOverrides(mutator: (draft: StorefrontThemeOverrides) => void) {
  updateTemplate((draft) => {
    mutator(draft.theme.overrides);
  });
}
```

## O que isso ensina

A tela de tema não trabalha direto no CSS. Ela trabalha num contrato de cor.

Ela ainda resolve um preview local com `resolveStorefrontTheme`, o que é muito bom para explicar com clareza a diferença entre:

- dado configurado;
- dado resolvido;
- dado renderizado.

## Trecho 3 - mega menu manager

```tsx
const enabledDepartments = template.header.departmentsMenu.filter((category) => category.enabled).length;
const totalSections = template.header.departmentsMenu.reduce((total, category) => total + category.sections.length, 0);
const publishedLinks = template.header.departmentsMenu.reduce((total, category) => total + countEnabledDepartmentLinks(category), 0);
```

## Leitura em linguagem natural

O mega menu já foi isolado porque ele tem outra natureza.

Diferente de um campo fixo de header, ele tende a crescer para:

- mais itens;
- mais seções;
- possivel arvore externa;
- possivel alimentação por API.

Por isso ele faz sentido como área própria do painel.

## Explicando de forma simples

> "Template, tema e mega menu parecem uma coisa só do ponto de vista visual. Mas tecnicamente não são. O tema resolve cor. O template resolve estrutura fixa. O mega menu resolve hierarquia de navegação."

## Próxima leitura

- [[04 - Runtime - Template e Tema]]
- [[08 - Painel - Persistencia e Publicacao]]
