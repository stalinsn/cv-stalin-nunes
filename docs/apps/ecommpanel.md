# EcommPanel (Admin Mock)

Rota: `/ecommpanel/login`

## Escopo

Painel administrativo modular para operação do e-commerce com foco em:

- Autenticação e sessão segura.
- RBAC (roles + permissões + overrides).
- Gestão de usuários.
- Gestão do template estrutural do storefront (header, home e footer).
- Gestão dedicada de tema visual (preset, campanha e overrides de cor).
- Gestão dedicada do mega menu de departamentos.
- Gestão contextual de módulos do storefront dentro das próprias telas de edição.
- Gestão de rotas/páginas dinâmicas.
- Editor visual de páginas e publicação.

## Estado atual do produto

Hoje o painel já cobre quatro frentes principais do storefront:

- `Template`: campos fixos de header, home e footer.
- `Tema`: preset, campanha e overrides de cor com prioridade sobre os tokens padrão.
- `Mega Menu`: edição dedicada da árvore de departamentos e do gatilho do dropdown.
- `Builder`: criação de rotas, edição visual de páginas, publicação e lixeira temporária.

## Credenciais seed (mock)

- `main@ecommpanel.local` / `Admin@123456`
- `owner@ecommpanel.local` / `Lojista@123456`

## Módulos de navegação

- Dashboard
- Usuários
- Site/Storefront
  - Template
    - Visão geral
    - Header
    - Home
    - Footer
  - Tema
    - Visão geral
    - Preset
    - Overrides
  - Mega Menu
    - Visão geral
    - Base
    - Árvore
  - Rotas
  - Editor
  - Blocos

## Fluxos operacionais

### Template

Rotas:

- `/ecommpanel/admin/site/template`
- `/ecommpanel/admin/site/template/header`
- `/ecommpanel/admin/site/template/home`
- `/ecommpanel/admin/site/template/footer`

Escopo:

- edição estrutural do header;
- módulos fixos da home;
- módulos fixos do footer;
- ativação contextual de partes do storefront que já existem no template.

### Tema

Rotas:

- `/ecommpanel/admin/site/theme`
- `/ecommpanel/admin/site/theme/preset`
- `/ecommpanel/admin/site/theme/overrides`

Escopo:

- seleção de `preset`;
- seleção de `campaign`;
- overrides finos de cor para header, footer, superfícies, texto e marca.

### Mega Menu

Rotas:

- `/ecommpanel/admin/site/mega-menu`
- `/ecommpanel/admin/site/mega-menu/base`
- `/ecommpanel/admin/site/mega-menu/tree`

Escopo:

- gatilho do menu de departamentos;
- árvore de departamentos;
- seções internas e links do dropdown.

### Rotas e editor visual

Rotas:

- `/ecommpanel/admin/site/routes`
- `/ecommpanel/admin/site/editor`

Escopo:

- criação de páginas dinâmicas por namespace operacional;
- edição visual com `layoutPreset`, `slots` e blocos;
- publicação do snapshot para o storefront;
- exclusão com retenção temporária em lixeira.

## Endpoints principais

### Auth

- `POST /api/ecommpanel/auth/login`
- `POST /api/ecommpanel/auth/logout`
- `POST /api/ecommpanel/auth/forgot-password`
- `POST /api/ecommpanel/auth/reset-password`
- `GET /api/ecommpanel/auth/me`

### Administração

- `GET/POST /api/ecommpanel/admin/users`

### Site builder

- `GET/PATCH /api/ecommpanel/site/template`
- `GET/POST /api/ecommpanel/site/pages`
- `PUT /api/ecommpanel/site/pages/[pageId]`
- `POST /api/ecommpanel/site/pages/[pageId]/publish`
- `POST /api/ecommpanel/site/pages/[pageId]/draft`
- `GET/POST /api/ecommpanel/site/routes`
- `DELETE /api/ecommpanel/site/routes/[pageId]`
- `POST /api/ecommpanel/site/routes/[pageId]/restore`

## Namespaces operacionais de rota

O cadastro de rotas e o editor visual trabalham com `namespace + caminho final`, em vez de um slug solto. Isso padroniza a operação e facilita futura migração para banco.

- `Raiz`: páginas de primeiro nível, como `/quem-somos`
- `Landing`: páginas de entrada promocional, como `/landing/black-friday`
- `Campanhas`: calendário comercial recorrente, como `/campanhas/dia-das-maes`
- `Institucional`: páginas de marca e confiança, como `/institucional/quem-somos`
- `Conteúdo`: materiais editoriais e orgânicos, como `/conteudo/guia-do-cafe`
- `Custom`: prefixo livre para estruturas fora do padrão operacional

O painel protege caminhos reservados do storefront, como `plp`, `cart`, `checkout` e `paginas`.

Cada namespace já sugere um `layoutPreset` e um conjunto inicial de blocos, para que a página nasça mais próxima do seu objetivo operacional.

## Publicação para o e-commerce (modo arquivo)

Ao salvar/publicar páginas, o painel sincroniza snapshot de páginas publicadas para consumo do e-commerce.

No modo servidor (`yarn dev` / `next start`), essas páginas são resolvidas em runtime pelo catch-all do storefront e não exigem geração de arquivos em `src/app/e-commerce` nem rebuild para novos caminhos. Em export estático, novas rotas continuam exigindo nova exportação.

Ao salvar/publicar o template, o painel também sincroniza:

- `storefront-template.published.json`
- `theme` publicado com `preset`, `campaign` e overrides opcionais de cor
- estrutura do mega menu separada no admin, mas persistida no mesmo snapshot do template

## Semântica de publicação

### Páginas do builder

- `Salvar rascunho`: atualiza a persistência administrativa local.
- `Publicar`: move a página para o snapshot consumido pelo storefront.
- `Rascunho`: remove a página publicada do snapshot público sem apagar o documento administrativo.

### Template do storefront

- salvar em qualquer uma das telas de template, tema ou mega menu atualiza o documento estrutural completo;
- o runtime publicado do storefront é sobrescrito de forma atômica;
- o storefront passa a ler a nova versão sem necessidade de rebuild em modo servidor.

### Arquivos gerados

- `site-pages.published.json`
- `manifest.json`

### Persistência administrativa local

Os dados editáveis do painel agora ficam quebrados em documentos menores:

- Rotas do site: `src/data/ecommpanel/site-routes.json`
- Conteúdo por página: `src/data/ecommpanel/site-pages/<pageId>.json`
- Storefront:
  - `src/data/ecommpanel/storefront/meta.json`
  - `src/data/ecommpanel/storefront/theme.json`
  - `src/data/ecommpanel/storefront/header.json`
  - `src/data/ecommpanel/storefront/home.json`
  - `src/data/ecommpanel/storefront/footer.json`

Os arquivos legados agregados (`site-pages.json` e `storefront-template.json`) permanecem como espelho compatível enquanto a fonte principal da operação passa a ser a estrutura quebrada.

## Persistência publicada

Arquivos consumidos pelo storefront:

- `src/data/site-runtime/site-pages.published.json`
- `src/data/site-runtime/manifest.json`
- `src/data/site-runtime/storefront-template.published.json`

Se `ECOM_CONTENT_PATH` estiver definido, esses artefatos passam a ser publicados nesse diretório compartilhado.

### Caminho de persistência

- Padrão: `src/data/site-runtime`
- Customizado: `ECOM_CONTENT_PATH=/caminho/compartilhado/site-runtime`

## Observações de arquitetura

- o painel não cria arquivos em `src/app/e-commerce` para cada nova rota;
- o storefront resolve páginas dinâmicas por runtime no catch-all;
- a escrita dos snapshots publicados é atômica, reduzindo risco de leitura parcial;
- o modelo atual em JSON já foi quebrado por domínio para facilitar futura migração para banco.

Referência detalhada: [../ECOM_CONTENT_RUNTIME.md](../ECOM_CONTENT_RUNTIME.md)

## Comandos úteis

```bash
yarn dev
yarn build
yarn start
yarn lint
yarn export:ecommpanel
```

## Operação isolada (app exportado)

```bash
cd exports/ecommpanel
yarn install
yarn dev
```

Se o e-commerce estiver em outro deploy, configure ambos com o mesmo `ECOM_CONTENT_PATH` (painel com escrita, ecommerce com leitura).
