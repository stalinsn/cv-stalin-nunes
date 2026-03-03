# App Lab (Next.js) — CV, MOTD, E-commerce e EcommPanel

Monorepo de aplicações em Next.js/TypeScript com execução conjunta ou separada por export.

## Visão geral

O projeto está organizado em 4 apps principais:

- `CV` (`/cv`): currículo multilíngue.
- `MOTD` (`/motd`): mensagens do dia.
- `E-commerce` (`/e-commerce`): vitrine, PLP/PDP, carrinho e checkout.
- `EcommPanel` (`/ecommpanel`): painel administrativo mock para governança do e-commerce.

Referência arquitetural: [docs/SYSTEM_MAP.md](docs/SYSTEM_MAP.md)

## Quick start

```bash
git clone https://github.com/stalinsn/cv-stalin-nunes.git
cd cv-stalin-nunes
cp .env.example .env.local
yarn install
yarn dev
```

Acesse: `http://localhost:3000`

## Comandos disponíveis

### Execução e build

```bash
yarn dev           # Desenvolvimento
yarn dev:tp        # Desenvolvimento com Turbopack
yarn build         # Build produção
yarn start         # Sobe build de produção
yarn lint          # ESLint em src/
yarn format        # Check de formatação CSS
yarn format:write  # Corrige formatação CSS
```

### Previews

```bash
yarn previews:install
yarn previews:gen
yarn previews:dev
yarn previews:cv
yarn previews:cv:dev
```

### Exportação de apps independentes

```bash
yarn export:cv
yarn export:motd
yarn export:ecommerce
yarn export:ecommpanel
yarn export:all
```

Saída padrão: `exports/<app>`.

Cada export cria um projeto Next independente com dependências mínimas + arquivos necessários para rodar isolado.

## Operação por app

### CV

- Rota: `/cv`
- Doc: [docs/apps/cv.md](docs/apps/cv.md)

### MOTD

- Rota: `/motd`
- Doc: [docs/apps/motd.md](docs/apps/motd.md)

### E-commerce

- Rota: `/e-commerce`
- Doc: [docs/apps/ecommerce.md](docs/apps/ecommerce.md)

### EcommPanel

- Rota: `/ecommpanel/login`
- Doc: [docs/apps/ecommpanel.md](docs/apps/ecommpanel.md)

## Integração EcommPanel -> E-commerce (modo arquivo)

O painel publica páginas dinâmicas em artefatos JSON e o e-commerce consome apenas o snapshot publicado.

### Artefatos

- `site-pages.published.json`
- `manifest.json`

### Caminho padrão

Sem variável de ambiente, os arquivos ficam em:

- `src/data/site-runtime`

### Caminho customizado (recomendado para deploy separado)

Defina em ambos os projetos:

```bash
ECOM_CONTENT_PATH=/caminho/compartilhado/site-runtime
```

Recomendação de permissão em produção:

- Painel: `read/write`
- E-commerce: `read-only`

## Rodar exports de forma independente

Exemplo com e-commerce exportado:

```bash
cd exports/ecommerce
yarn install
yarn dev
```

Exemplo com painel exportado:

```bash
cd exports/ecommpanel
yarn install
yarn dev
```

Observação: em build local, rotas de tradução podem exigir `OPENAI_API_KEY`.

## Documentação complementar

- Índice técnico: [docs/README_INDEX.md](docs/README_INDEX.md)
- Apps: [docs/apps/README.md](docs/apps/README.md)
- Runbook operacional: [docs/RUNBOOK.md](docs/RUNBOOK.md)
- Roadmap técnico: [docs/IMPLEMENTATION_ROADMAP.md](docs/IMPLEMENTATION_ROADMAP.md)
- Backlog executável P0: [docs/P0_EXECUTION_BACKLOG.md](docs/P0_EXECUTION_BACKLOG.md)
- Automação Git: [docs/GIT_AUTOMATION.md](docs/GIT_AUTOMATION.md)

## Prioridades de implementação (sem gaps)

### Funcional agora (crítico para operação real)

- `API v1` entre painel e e-commerce: contrato estável para evitar quebra quando os apps estiverem separados.
- `Banco de dados real (PostgreSQL)`: sair de mock para persistência confiável de usuários, catálogo e configurações.
- `Auth + RBAC persistidos`: garantir controle de acesso consistente, auditoria e trilha de responsabilidade.
- `Catálogo administrável`: CRUD de produtos/SKUs/categorias/coleções no painel para escalar além dos JSONs mock.
- `Regionalização por CEP`: definir sortimento, preço e entrega conforme localização do cliente.
- `Carrinho server-side com idempotência`: evitar pedidos duplicados e inconsistências no checkout.
- `Gateway de pagamento (sandbox)`: validar fluxo real de autorização, captura e falha antes de produção.
- `Webhooks de pagamento assinados`: atualizar status do pedido com segurança e rastreabilidade.
- `Motor básico de promoções`: suportar desconto por SKU/categoria/cupom com regras claras.
- `Configurações operacionais da loja`: compra mínima, entrega, retirada e flags por página/contexto.
- `Observabilidade mínima`: logs estruturados, correlation ID, métricas e alertas para suporte.
- `Testes críticos E2E`: cobrir funil completo (PLP -> PDP -> carrinho -> checkout -> confirmação).

### Pode esperar (alto valor, mas fase seguinte)

- `MFA para admins`: reforço de segurança para perfis críticos após base de auth estabilizada.
- `Busca avançada (OpenSearch)`: relevância, sinônimos e boosting para melhorar descoberta de produtos.
- `Cache distribuído (Redis)`: ganho de performance e redução de carga quando o tráfego aumentar.
- `Motor avançado de promoções`: combos, progressivos e prioridade de regras com simulador completo.
- `Conta completa do cliente`: favoritos, recompra, histórico avançado e preferências personalizadas.
- `Editor CMS com workflow`: aprovação em múltiplas etapas, versionamento e rollback por publicação.
- `Preview por ambiente/token`: validar páginas antes de publicar sem expor conteúdo em produção.
- `Antifraude avançado`: camadas adicionais de risco após integração inicial do gateway.
- `SLO/Error budget/chaos`: maturidade operacional para fase de escala e eventos sazonais.
- `Multi-tenant`: preparar o mesmo painel para múltiplas lojas/marcas no futuro.

### Decisão técnica recomendada de dados

- `PostgreSQL` como fonte de verdade transacional (pedidos, usuários, catálogo base).
- `OpenSearch` para busca e filtros de PLP quando o catálogo crescer.
- `Redis` para cache e sessão em cenários de maior volume.

Resumo: essa combinação reduz risco no checkout e mantém flexibilidade para escalar.

## Licença

Consulte [LICENSE](LICENSE).
