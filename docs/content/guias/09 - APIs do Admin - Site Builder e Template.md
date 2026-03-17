---
tags:
  - guia
  - api
  - admin
---

# APIs do Admin - Site Builder e Template

## O que você encontra aqui

Esta nota mostra como a UI do admin conversa com o backend do próprio Next.

A pergunta certa aqui não é só "qual endpoint existe?".

A pergunta certa é:

- quem chama a API;
- o que a API valida;
- qual store server-side ela aciona;
- o que isso publica para o storefront.

## Arquivos principais

- `src/app/api/ecommpanel/site/routes/route.ts`
- `src/app/api/ecommpanel/site/pages/route.ts`
- `src/app/api/ecommpanel/site/pages/[pageId]/route.ts`
- `src/app/api/ecommpanel/site/pages/[pageId]/publish/route.ts`
- `src/app/api/ecommpanel/site/pages/[pageId]/draft/route.ts`
- `src/app/api/ecommpanel/site/template/route.ts`
- `src/features/ecommpanel/server/auth.ts`
- `src/features/ecommpanel/server/siteBuilderStore.ts`
- `src/features/ecommpanel/server/storefrontTemplateStore.ts`

## Visão geral da camada de API

A UI do painel não escreve arquivo direto do navegador.

Ela faz `fetch` para rotas internas do app admin, e essas rotas:

1. autenticam o usuário;
2. validam permissão;
3. validam CSRF e origem;
4. chamam os stores server-side;
5. os stores persistem os dados e publicam os snapshots.

## Trecho 1 - guarda de segurança padrão

```ts
async function requireSiteContentPermission(req: NextRequest) {
  const auth = await getApiAuthContext(req);
  if (!auth) return { error: errorNoStore(401, 'Não autenticado.') };
  if (!hasPermission(auth.user, 'site.content.manage')) {
    return { error: errorNoStore(403, 'Sem permissão para gerenciar páginas.') };
  }
  return { auth };
}
```

## Leitura guiada

Esse padrão aparece várias vezes.

A API primeiro protege o acesso. Ela não confia no fato de a UI ter escondido ou mostrado botão.

A regra prática é:

- UI ajuda a experiência;
- API faz a segurança real.

## Trecho 2 - validação de origem e CSRF

```ts
if (!isTrustedOrigin(req)) {
  return errorNoStore(403, 'Origem não permitida.');
}

if (!hasValidCsrf(req, guard.auth.csrfToken)) {
  return errorNoStore(403, 'Token CSRF inválido.');
}
```

## O que isso ensina

Toda mutação importante da área admin hoje passa por duas travas:

- a origem da requisição precisa bater com o host esperado;
- o header `x-csrf-token` precisa casar com o token da sessão.

Isso é bom para documentação orientada porque mostra claramente a diferença entre:

- estar autenticado;
- estar autorizado;
- estar protegido contra request forjada.

## Trecho 3 - criação de rota

```ts
const title = body?.title?.trim() || '';
const slug = normalizeSlug(body?.slug || '');

if (!isValidSlug(slug)) {
  return errorNoStore(400, 'Caminho inválido...');
}

const reservedError = getReservedStorefrontSlugError(slug);
if (reservedError) {
  return errorNoStore(409, reservedError);
}

const page = createSitePage({ title, slug, description: body?.description });
```

## Leitura em linguagem natural

A rota de criação não só recebe dados e salva.

Ela primeiro:

- normaliza o caminho;
- rejeita formato inválido;
- bloqueia colisão com rotas nativas;
- evita duplicidade;
- só depois cria a página.

Ou seja, a API também é parte da regra de negócio, não apenas transporte.

## Trecho 4 - salvar o editor visual

```ts
const page = updateSitePage(pageId, {
  title,
  slug,
  description,
  layoutPreset,
  slots,
  seo,
  theme,
});
```

## O que isso ensina

O `PUT` da página trabalha com um documento quase inteiro.

Ele não salva um campo por vez. Ele recebe uma fotografia da página editada:

- metadados;
- rota;
- SEO;
- tema local;
- layout;
- slots e blocos.

Isso ajuda a manter a página coerente como entidade.

## Trecho 5 - publicar ou voltar para rascunho

```ts
const page = setSitePageStatus(pageId, 'published');
```

```ts
const page = setSitePageStatus(pageId, 'draft');
```

## Leitura técnica

Publicar e voltar para rascunho não são endpoints gigantes. A inteligência está no store.

A API só:

- autentica;
- autoriza;
- chama a mudança de status.

Isso é um bom ponto de explicação sobre controller fino e regra de negócio centralizada.

## Trecho 6 - template estrutural

```ts
export async function PATCH(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as UpdateTemplateBody | null;
  if (!body?.template) {
    return errorNoStore(400, 'Payload do template é obrigatório.');
  }

  const template = updateStorefrontTemplate(body.template);
  return jsonNoStore({ ok: true, template });
}
```

## O que essa rota faz

Ela recebe o documento inteiro do template e delega a normalização e persistência para o store.

Isso significa que:

- `Template`;
- `Tema`;
- `Mega Menu`

acabam publicando pelo mesmo endpoint base, porque no fim todos alteram o mesmo documento estrutural.

## Endpoints mais importantes hoje

### Builder

- `GET /api/ecommpanel/site/routes`
- `POST /api/ecommpanel/site/routes`
- `DELETE /api/ecommpanel/site/routes/[pageId]`
- `POST /api/ecommpanel/site/routes/[pageId]/restore`
- `GET /api/ecommpanel/site/routes/trash`
- `GET /api/ecommpanel/site/pages`
- `POST /api/ecommpanel/site/pages`
- `GET /api/ecommpanel/site/pages/[pageId]`
- `PUT /api/ecommpanel/site/pages/[pageId]`
- `POST /api/ecommpanel/site/pages/[pageId]/publish`
- `POST /api/ecommpanel/site/pages/[pageId]/draft`

### Storefront estrutural

- `GET /api/ecommpanel/site/template`
- `PATCH /api/ecommpanel/site/template`

### Diagnóstico de runtime

- `GET /api/ecommpanel/site/resolve?path=/algum-caminho`

## Explicando de forma simples

> "A UI do admin só orquestra. A API valida segurança e contrato. O store server-side persiste e publica. Quando a gente entende essas três camadas, entende o painel inteiro."

## Próxima leitura

- [[10 - Integracao End-to-End - Admin para Storefront]]
