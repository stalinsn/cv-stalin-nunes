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

O painel publica JSON de páginas dinâmicas e do template estrutural. O storefront consome somente os snapshots publicados.

Arquivos:

- `site-pages.published.json`
- `manifest.json`
- `storefront-template.published.json`

Variável recomendada nos dois apps:

```bash
ECOM_CONTENT_PATH=/var/app/shared/site-runtime
```

Permissões:

- `ecommpanel`: leitura/escrita
- `e-commerce`: leitura

Observação:

- em `yarn dev` e `next start`, o storefront lê esse conteúdo por runtime;
- em export estático, novas rotas exigem nova exportação do app.

## 3. Checklist de deploy

1. Configurar variáveis de ambiente (`.env.local` ou secret manager).
2. Garantir diretório compartilhado do `ECOM_CONTENT_PATH`.
3. Ajustar permissão do sistema de arquivos.
4. Build da aplicação.
5. Smoke test de login no painel.
6. Alterar e publicar `tema` ou `template` no painel.
7. Validar header/home/footer/mega menu no storefront.
8. Criar/editar/publicar uma página no painel.
9. Validar renderização da rota dinâmica no storefront.

## 4. Smoke tests mínimos

1. Login com usuário mock no painel.
2. Alterar `preset` ou `override` de tema e publicar.
3. Alterar um item fixo do template e publicar.
4. Alterar mega menu e publicar.
5. Criar rota no módulo de rotas.
6. Abrir editor e salvar rascunho.
7. Publicar página.
8. Acessar `e-commerce/<slug>` e confirmar renderização.
9. Voltar para rascunho e validar fallback.

## 5. Rollback de conteúdo

Rollback por arquivo (rápido):

1. Backup atual do diretório `ECOM_CONTENT_PATH`.
2. Restaurar versão anterior de `site-pages.published.json`, `manifest.json` e/ou `storefront-template.published.json`.
3. Reiniciar processo do storefront (ou limpar cache do runtime).
4. Validar rotas críticas.

## 6. Incidentes comuns

### Painel publica, mas storefront não reflete

Verificar:

1. Mesmo `ECOM_CONTENT_PATH` nos dois apps.
2. Permissões de leitura no processo do storefront.
3. Presença e validade de `manifest.json` e snapshot.

### Painel publica template, mas header/home/footer não mudam

Verificar:

1. Presença de `storefront-template.published.json`.
2. Se o storefront está lendo o mesmo `ECOM_CONTENT_PATH`.
3. Se o processo foi iniciado em modo servidor ou em export estático.

### Nova rota criada no painel não aparece em ambiente exportado

Verificar:

1. Se a página foi realmente publicada.
2. Se o ambiente é export estático.
3. Se a exportação do e-commerce foi refeita após a criação da rota.

### Build falha em export standalone

Verificar:

1. `yarn install` dentro da pasta exportada.
2. Variáveis obrigatórias (`OPENAI_API_KEY` em ambientes com rota de tradução ativa).
3. Se o export foi gerado após mudanças recentes (`yarn export:<app>` novamente).

## 7. Operação diária recomendada

1. Desenvolver no monorepo.
2. Publicar alterações de template/tema/mega menu e validar no storefront.
3. Publicar páginas dinâmicas e validar resolução por runtime.
4. Validar com `yarn lint` e `yarn build`.
5. Gerar exports para ambientes desacoplados quando necessário.
6. Registrar alterações de conteúdo/publicação em changelog operacional interno.

Referência detalhada: [ECOM_CONTENT_RUNTIME.md](ECOM_CONTENT_RUNTIME.md)
