# Runtime de Conteúdo do E-commerce

Documento central do fluxo de conteúdo entre `EcommPanel` e `E-commerce`.

## Escopo

Esse runtime cobre dois domínios publicados pelo painel:

- `Páginas dinâmicas` do site builder.
- `Template estrutural do storefront`, incluindo tema, header, home, footer e mega menu.

O objetivo é manter o storefront desacoplado do painel e operar hoje com arquivos JSON, sem depender de banco de dados nem de geração de arquivos em `src/app/e-commerce` para cada nova rota.

## Modos de operação

### Runtime de servidor

Quando o storefront roda em `yarn dev` ou `next start`:

- novas rotas dinâmicas são resolvidas por runtime;
- mudanças de template, tema e mega menu são lidas do snapshot publicado;
- não é necessário rebuild para nova página dinâmica;
- a troca de snapshot é feita por escrita atômica em arquivo.

### Export estático

Quando o storefront roda como export estático:

- o conteúdo publicado continua existindo em JSON;
- porém novas rotas exigem nova exportação do app para existir como saída estática;
- mudanças puramente visuais dependem do que já foi incluído no bundle exportado.

Conclusão prática:

- `server runtime`: ideal para iteração operacional;
- `static export`: ideal para distribuição desacoplada, mas exige nova exportação para consolidar novas rotas.

## Fluxo fim a fim

1. O painel grava documentos administrativos locais em `src/data/ecommpanel`.
2. Ao salvar/publicar, ele normaliza os dados e publica snapshots em `src/data/site-runtime` ou no caminho definido por `ECOM_CONTENT_PATH`.
3. O storefront lê somente os snapshots publicados.
4. A resolução de rota dinâmica acontece no catch-all do Next, sem criar novos arquivos em `src/app/e-commerce`.

## Persistência administrativa local

### Site builder

Arquivos principais:

- `src/data/ecommpanel/site-routes.json`
- `src/data/ecommpanel/site-pages/<pageId>.json`

Espelho legado mantido por compatibilidade:

- `src/data/ecommpanel/site-pages.json`

Semântica:

- `site-routes.json` guarda o registro de páginas sem os blocos completos;
- cada arquivo em `site-pages/` guarda o documento detalhado da página, principalmente `slots` e blocos;
- o agregado legado continua sendo escrito, mas a fonte principal agora é a estrutura quebrada.

### Storefront template

Arquivos principais:

- `src/data/ecommpanel/storefront/meta.json`
- `src/data/ecommpanel/storefront/theme.json`
- `src/data/ecommpanel/storefront/header.json`
- `src/data/ecommpanel/storefront/home.json`
- `src/data/ecommpanel/storefront/footer.json`

Espelho legado mantido por compatibilidade:

- `src/data/ecommpanel/storefront-template.json`

Semântica:

- `meta.json` guarda metadados do documento, como `schemaVersion`, `updatedAt` e `brandName`;
- os demais arquivos isolam domínios operacionais do storefront;
- o mega menu está persistido dentro de `header.json`, mas é operado em tela dedicada no admin.

## Snapshots publicados para o storefront

### Páginas dinâmicas

Arquivos publicados:

- `site-pages.published.json`
- `manifest.json`

Semântica:

- `site-pages.published.json` contém somente páginas publicadas, já prontas para resolução por runtime;
- `manifest.json` registra metadados do snapshot, incluindo `generatedAt`, `pagesCount` e `checksumSha256`.

### Template do storefront

Arquivo publicado:

- `storefront-template.published.json`

Semântica:

- contém a versão normalizada do template estrutural completo consumido pelo storefront;
- serve como fonte de verdade para tema, home, header, footer e mega menu;
- não usa manifest separado hoje.

## Caminho de publicação

Padrão local:

- `src/data/site-runtime`

Modo desacoplado:

```bash
ECOM_CONTENT_PATH=/caminho/compartilhado/site-runtime
```

Permissões recomendadas:

- `EcommPanel`: leitura e escrita
- `E-commerce`: somente leitura

## Resolução de rotas dinâmicas

O storefront usa:

- catch-all em `src/app/e-commerce/[...cmsPath]/page.tsx`
- resolver em `src/features/ecommerce/server/routeResolver.ts`
- leitura de snapshot em `src/features/site-runtime/server/publishedStore.ts`

Comportamento:

- se a rota estiver no snapshot publicado, a página é resolvida como `dynamic`;
- se colidir com rota nativa do storefront, prevalece a rota nativa;
- se não existir em nenhum dos dois fluxos, retorna `not_found`.

## Namespaces operacionais de rota

O painel trata caminhos do site builder como `namespace + caminho final`.

Namespaces atuais:

- `Raiz`: `quem-somos`
- `Landing`: `landing/black-friday`
- `Campanhas`: `campanhas/dia-das-maes`
- `Institucional`: `institucional/quem-somos`
- `Conteúdo`: `conteudo/guia-do-cafe`
- `Custom`: prefixo livre

Benefícios:

- padronização operacional;
- presets automáticos de layout/blocos por tipo de página;
- transição mais simples para banco depois.

Caminhos reservados pelo storefront:

- `plp`
- `cart`
- `checkout`
- `paginas`

Também existem padrões nativos reservados, como PDP (`/<slug>/p`) e rotas de páginas internas do storefront.

## Tema e prioridade de overrides

O storefront usa o template publicado como base autoritativa.

Prioridade prática:

1. `storefront-template.published.json`
2. overrides explícitos por query string, como `?theme=classic` e `?campaign=black-friday`
3. fallback para defaults internos quando não há snapshot publicado válido

Importante:

- o storefront não reaplica silenciosamente preferências antigas do navegador sobre o template publicado;
- query params continuam existindo como ferramenta explícita de inspeção local.

## Atomicidade e segurança da publicação

A escrita dos artefatos publicados é feita de forma atômica:

- grava em arquivo temporário;
- renomeia para o arquivo final.

Isso reduz risco de leitura parcial do snapshot pelo storefront durante publicação.

## Relação com banco de dados futuro

A estrutura atual já foi quebrada por domínio para facilitar a migração futura.

Separação atual recomendada para futura persistência real:

- `storefront theme`
- `storefront header`
- `storefront home`
- `storefront footer`
- `storefront mega menu`
- `site routes`
- `site pages`

Hoje a operação continua em JSON, mas o desenho já evita um documento monolítico como única fonte de verdade.
