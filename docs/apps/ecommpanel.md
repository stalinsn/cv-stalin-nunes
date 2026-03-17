# EcommPanel (Admin Mock)

Rota: `/ecommpanel/login`

## Escopo

Painel administrativo modular para operação do e-commerce com foco em:

- Autenticação e sessão segura.
- RBAC (roles + permissões + overrides).
- Gestão de usuários.
- Gestão de feature flags do storefront.
- Gestão de rotas/páginas dinâmicas.
- Editor visual de páginas e publicação.

## Credenciais seed (mock)

- `main@ecommpanel.local` / `Admin@123456`
- `owner@ecommpanel.local` / `Lojista@123456`

## Módulos de navegação

- Dashboard
- Usuários
- Site/Storefront
  - Rotas
  - Editor
  - Feature Flags
  - Blocos

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

- `GET/POST /api/ecommpanel/site/pages`
- `PATCH /api/ecommpanel/site/pages/[pageId]`
- `POST /api/ecommpanel/site/pages/[pageId]/publish`
- `POST /api/ecommpanel/site/pages/[pageId]/draft`
- `GET/POST /api/ecommpanel/site/routes`
- `DELETE /api/ecommpanel/site/routes/[pageId]`
- `POST /api/ecommpanel/site/routes/[pageId]/restore`

## Publicação para o e-commerce (modo arquivo)

Ao salvar/publicar páginas, o painel sincroniza snapshot de páginas publicadas para consumo do e-commerce.

### Arquivos gerados

- `site-pages.published.json`
- `manifest.json`

### Caminho de persistência

- Padrão: `src/data/site-runtime`
- Customizado: `ECOM_CONTENT_PATH=/caminho/compartilhado/site-runtime`

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
