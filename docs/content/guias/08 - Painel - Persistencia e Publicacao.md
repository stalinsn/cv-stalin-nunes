---
tags:
  - guia
  - persistência
  - publicação
---

# Painel - Persistência e Publicação

## O que você encontra aqui

Esta nota fecha o ciclo entre admin e storefront.

## Arquivos principais

- `src/features/ecommpanel/server/siteBuilderStore.ts`
- `src/features/ecommpanel/server/storefrontTemplateStore.ts`
- `src/features/site-runtime/server/publishedStore.ts`

## Trecho 1 - starter por namespace

```ts
function createStarterSlotsForSlug(slug: string): { layoutPreset: SiteLayoutPreset; slots: SitePageSlot[] } {
  const namespace = resolveSiteRouteNamespaceBySlug(slug);
  const slots = createSlotsForPreset(namespace.layoutPreset);

  namespace.starterPlan.forEach((plan, slotIndex) => {
    const slot = slots[slotIndex];
    if (!slot) return;
    slot.blocks.push(...plan.map((blockType) => createBlock(blockType)));
  });

  return {
    layoutPreset: namespace.layoutPreset,
    slots,
  };
}
```

## O que isso ensina

A persistência do builder já nasce acoplada ao namespace operacional.

Ou seja:

- namespace não é só cosmético;
- ele afeta layout inicial e blocos iniciais.

## Trecho 2 - salvar o builder quebrado por dominio

```ts
const registry: PersistedSiteRouteRegistry = {
  routes: pages.map((page) => toPageRecord(page)),
};
writeJsonAtomic(ROUTES_FILE, registry);
writeJsonAtomic(LEGACY_DATA_FILE, { pages });

for (const page of pages) {
  const document: PersistedSitePageDocument = {
    pageId: page.id,
    slots: page.slots,
  };
  writeJsonAtomic(getPageDocumentPath(page.id), document);
}

syncPublishedRuntimeSnapshot(pages);
```

## Leitura guiada

Esse trecho mostra três camadas ao mesmo tempo:

- persistência nova em arquivos menores;
- espelho legado por compatibilidade;
- publicação do snapshot para o storefront.

## Trecho 3 - salvar template estrutural

```ts
writeJsonAtomic(META_FILE, meta);
writeJsonAtomic(THEME_FILE, normalized.theme);
writeJsonAtomic(HEADER_FILE, normalized.header);
writeJsonAtomic(HOME_FILE, normalized.home);
writeJsonAtomic(FOOTER_FILE, normalized.footer);
writeJsonAtomic(LEGACY_DATA_FILE, normalized);

publishRuntimeStorefrontTemplate(normalized);
```

## O que isso ensina

O template segue a mesma filosofia do builder:

- fonte principal quebrada por dominio;
- agregado legado ainda mantido;
- publicação imediata do runtime estrutural.

## Trecho 4 - escrita atomica do snapshot

```ts
function writeJsonAtomic(filePath: string, value: unknown): void {
  const payload = JSON.stringify(value, null, 2);
  const tmpPath = `${filePath}.tmp-${process.pid}-${Date.now()}`;
  fs.writeFileSync(tmpPath, payload, 'utf-8');
  fs.renameSync(tmpPath, filePath);
}
```

## Explicação em linguagem natural

Isso existe para evitar leitura parcial.

Em uma explicação orientada, eu colocaria assim:

> "O storefront não pode pegar um arquivo pela metade enquanto o painel está publicando. Por isso ele escreve primeiro num temporário e só depois troca o nome do arquivo."

## Ordem de execução do fluxo completo

1. o operador muda algo no painel;
2. o manager envia a mutação para a API;
3. o store server-side normaliza e salva os documentos administrativos;
4. o store publica o snapshot runtime;
5. o storefront passa a consumir a nova versão.

## Explicando de forma simples

> "Persistência administrativa e publicação não são a mesma coisa. Primeiro o painel grava sua fonte de verdade interna. Depois ele gera um artefato público de runtime para a loja consumir."

## Fechamento da trilha

Depois desta nota, o aluno normalmente já entende o fluxo inteiro do que implementamos entre painel e storefront.
