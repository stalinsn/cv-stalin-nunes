# Runbook Operacional

Manual de operação para desenvolvimento, deploy e suporte dos apps `e-commerce` e `ecommpanel`.

## 1. Modos de execução

### Modo monorepo (tudo junto)

```bash
yarn install
yarn dev
```

Acessos:

- Storefront: `http://localhost:3000/e-commerce`
- Painel: `http://localhost:3000/ecommpanel/login`

### Modo desacoplado (exports)

```bash
yarn export:ecommerce
yarn export:ecommpanel
```

Executar em terminais separados:

```bash
cd exports/ecommerce && yarn install && yarn dev
cd exports/ecommpanel && yarn install && yarn dev
```

## 2. Bridge de conteúdo (painel -> storefront)

O painel publica JSON de páginas dinâmicas e o storefront consome somente o snapshot publicado.

Arquivos:

- `site-pages.published.json`
- `manifest.json`

Variável recomendada nos dois apps:

```bash
ECOM_CONTENT_PATH=/var/app/shared/site-runtime
```

Permissões:

- `ecommpanel`: leitura/escrita
- `e-commerce`: leitura

## 3. Checklist de deploy

1. Configurar variáveis de ambiente (`.env.local` ou secret manager).
2. Garantir diretório compartilhado do `ECOM_CONTENT_PATH`.
3. Ajustar permissão do sistema de arquivos.
4. Build da aplicação.
5. Smoke test de login no painel.
6. Criar/editar/publicar uma página no painel.
7. Validar renderização da rota dinâmica no storefront.

## 4. Smoke tests mínimos

1. Login com usuário mock no painel.
2. Criar rota no módulo de rotas.
3. Abrir editor e salvar rascunho.
4. Publicar página.
5. Acessar `e-commerce/<slug>` e confirmar renderização.
6. Voltar para rascunho e validar fallback.

## 5. Rollback de conteúdo

Rollback por arquivo (rápido):

1. Backup atual do diretório `ECOM_CONTENT_PATH`.
2. Restaurar versão anterior de `site-pages.published.json` e `manifest.json`.
3. Reiniciar processo do storefront (ou limpar cache do runtime).
4. Validar rotas críticas.

## 6. Incidentes comuns

### Painel publica, mas storefront não reflete

Verificar:

1. Mesmo `ECOM_CONTENT_PATH` nos dois apps.
2. Permissões de leitura no processo do storefront.
3. Presença e validade de `manifest.json` e snapshot.

### Build falha em export standalone

Verificar:

1. `yarn install` dentro da pasta exportada.
2. Variáveis obrigatórias (`OPENAI_API_KEY` em ambientes com rota de tradução ativa).
3. Se o export foi gerado após mudanças recentes (`yarn export:<app>` novamente).

## 7. Operação diária recomendada

1. Desenvolver no monorepo.
2. Validar com `yarn lint` e `yarn build`.
3. Gerar exports para ambientes desacoplados.
4. Registrar alterações de conteúdo/publicação em changelog operacional interno.
