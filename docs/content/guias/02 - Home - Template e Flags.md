---
tags:
  - guia
  - ecommerce
  - home
---

# Home - Template e Flags

## O que você encontra aqui

Aqui o foco é mostrar que a home não depende de um único controle. Ela cruza:

- template publicado;
- módulos internos do template;
- feature flags técnicas.

## Arquivos principais

- `src/app/e-commerce/page.tsx`
- `src/features/ecommerce/components/organisms/Header.tsx`
- `src/features/ecommerce/components/organisms/Dropdowns.tsx`

## Trecho 1 - home da loja

```tsx
const template = resolveStorefrontTemplate();
const homeModules = template.home.modules;
const homeEnabled = homeModules.enabled;

{homeEnabled && homeModules.heroMessage && isOn('ecom.home.hero.main') && <HeroBanner message={template.home.heroMessage} />}
{homeEnabled && homeModules.showcaseDaily && isOn('ecom.home.showcase.daily') && <Showcase title={template.home.dailyShowcaseTitle} flag="ecom.showcaseDaily" />}
{homeEnabled && homeModules.services && isOn('ecom.home.services') && <ServicesBar items={template.home.services} />}
```

## Explicação em linguagem natural

Essa parte é muito boa para ensinar separação de responsabilidades.

A regra prática é:

- o `template` diz o que a operação quer publicar;
- a `feature flag` diz o que o sistema esta técnicamente disposto a renderizar.

Ou seja, a condição final quase sempre é composta.

Explicando de forma simples:

> "O painel manda a intenção de negócio. A flag ainda protege o comportamento técnico. Só renderiza quando os dois lados concordam."

## Trecho 2 - header consumindo template

```tsx
const headerModules = template.header.modules;
const showPromoBar = headerModules.promoBar && isOn('ecom.header.promoBar');
const showUtilBar = headerModules.utilLinks && isOn('ecom.header.utilBar');
const showQuickLogin = headerModules.quickLogin && isOn('ecom.header.actions.loginQuick');
const showNavDepartments = headerModules.departmentsMenu && isOn('ecom.header.nav.departments');
```

## O que isso ensina

O `Header` virou um orquestrador.

Ele não calcula tema, não decide schema, não busca snapshot. Ele faz outra coisa:

- recebe um `template` pronto;
- avalia quais partes devem aparecer;
- distribui esse template para as subpartes.

Esse padrão é composição funcional de UI.

## Trecho 3 - mega menu com fallback

```tsx
const templateCategories = React.useMemo(
  () => mapTemplateDepartmentsToMega(template?.header.departmentsMenu || []),
  [template]
);
const hasTemplateCategories = templateCategories.length > 0;
const [cats, setCats] = useState<MegaCategory[]>(hasTemplateCategories ? templateCategories : fallbackCategories);
```

## Leitura técnica

Aqui o dropdown está preparado para três cenarios:

1. usar categorias publicadas pelo painel;
2. cair para fallback local;
3. no futuro, trocar para fonte externa.

Isso é importante porque mostra uma arquitetura preparada para evolução, sem quebrar a API visual do componente.

## Ordem de execução da home

1. a página resolve o template publicado;
2. lê os módulos da home;
3. cruza isso com feature flags;
4. renderiza os blocos estáticos permitidos;
5. o header usa a mesma ideia para topo e mega menu.

## Explicando de forma simples

> "A home não é uma página de if solto. Ela é uma página orientada por contrato. O template publicado entra como fonte de configuração, e as flags entram como grade de segurança técnica."

## Próxima leitura

- [[03 - Runtime - Paginas Dinâmicas]]
- [[04 - Runtime - Template e Tema]]
