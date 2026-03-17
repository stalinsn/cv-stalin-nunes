---
tags:
  - guia
  - runtime
  - routes
---

# Runtime - Páginas Dinâmicas

## O que você encontra aqui

Esta nota mostra como a loja resolve páginas dinâmicas sem criar arquivo novo no Next para cada rota.

## Arquivos principais

- `src/features/site-runtime/server/publishedStore.ts`
- `src/features/ecommerce/server/routeResolver.ts`
- `src/app/e-commerce/[...cmsPath]/page.tsx`

## Trecho 1 - publicar snapshot

```ts
export function publishRuntimePages(pages: RuntimeResolvedPage[]): RuntimeContentManifest {
  const snapshot: RuntimePublishedSnapshot = {
    schemaVersion: SITE_RUNTIME_SCHEMA_VERSION,
    generatedAt,
    pages,
  };

  writeJsonAtomic(getSnapshotPath(), snapshot);
  writeJsonAtomic(getManifestPath(), manifest);
}
```

## Leitura em linguagem natural

O painel não publica HTML. Ele publica uma representação de conteúdo.

O storefront depois interpreta esse snapshot.

A parte didática aqui é entender o desacoplamento:

- painel escreve;
- storefront le;
- nenhum dos dois precisa conhecer o componente interno do outro nesse momento.

## Trecho 2 - resolver o caminho

```ts
export function resolveStorefrontPath(pathname: string): RuntimeResolveResult {
  const path = normalizeRuntimePath(pathname);
  const page = resolveDynamicRuntimePath(path);
  if (page) {
    return { source: 'dynamic', path, page };
  }

  if (isNativeStorefrontPath(path)) {
    return { source: 'native', path, page: null };
  }

  return { source: 'not_found', path, page: null };
}
```

## O que essa função faz de verdade

Ela decide em qual mundo a rota vive:

- mundo dinâmico publicado;
- mundo nativo do storefront;
- mundo inexistente.

Essa função não renderiza nada. Ela classifica o caminho.

Isso é excelente para leitura guiada, porque mostra separação entre:

- resolver;
- decidir;
- renderizar.

## Trecho 3 - página catch-all

```tsx
const resolved = resolveStorefrontPath(path);

if (resolved.source !== 'dynamic' || !resolved.page) {
  notFound();
}

return <CmsPageRenderer page={resolved.page} />;
```

## Ordem de execução

1. o usuário acessa uma rota fora do conjunto nativo;
2. o catch-all recebe esse caminho;
3. o resolver tenta achar no snapshot;
4. se encontrar, devolve `dynamic`;
5. a página renderiza `CmsPageRenderer`.

## Explicando de forma simples

> "O catch-all não sabe tudo. Ele sabe delegar. Primeiro ele pergunta ao resolver se o caminho existe no runtime publicado. Se existir, vira página CMS. Se não existir, o fluxo morre com `notFound`."

## Ponto conceitual importante

Isso não é orientação a objeto. Isso é um pipeline funcional simples:

- normalizar;
- consultar snapshot;
- classificar;
- renderizar.

## Próxima leitura

- [[04 - Runtime - Template e Tema]]
- [[08 - Painel - Persistencia e Publicacao]]
