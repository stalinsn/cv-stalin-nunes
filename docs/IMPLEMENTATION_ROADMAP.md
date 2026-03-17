# Roadmap de Implementação (E-commerce + EcommPanel)

Próximos passos priorizados para evoluir de mock funcional para plataforma de operação real.

## Matriz de prioridade

### P0 - Essencial para operar em produção

1. Contrato `api/v1` entre painel e storefront (evita quebra de integração).
2. Persistência real de auth/RBAC/auditoria (segurança e rastreabilidade).
3. Base de catálogo em banco (`products`, `skus`, `categories`, `collections`).
4. Regionalização + simulação logística por CEP (sortimento e entrega corretos).
5. Checkout transacional com idempotência (consistência de pedidos).
6. Gateway sandbox + webhooks assinados (validar ciclo financeiro).
7. Motor inicial de promoções e cupons (regra comercial mínima).
8. Observabilidade + alertas + testes E2E críticos (operação segura).

### P1 - Aceleração de performance e operação

1. Busca dedicada (`OpenSearch`) para relevância/filtros.
2. Cache distribuído (`Redis`) para leitura de catálogo e sessões.
3. Configurações operacionais avançadas (janelas, limites, regras por canal).
4. Conta de cliente completa (favoritos, histórico, recompra).
5. Editor CMS com versionamento e aprovação.

### P2 - Escala e diferenciação

1. MFA e políticas avançadas de segurança administrativa.
2. Motor promocional avançado (regras compostas e conflito de prioridades).
3. SLO/error budget/chaos testing para operação de alto volume.
4. Multi-tenant para expansão do painel para múltiplas lojas.

## Fase 0 - Fundamentos de plataforma (imediato)

1. Separar deploy de `e-commerce` e `ecommpanel` com ambientes próprios.
2. Definir contrato de integração versionado (`/api/v1/...`) entre painel e storefront.
3. Padronizar observabilidade mínima: logs estruturados, correlation ID, healthcheck.
4. Definir estratégia de segredos (vault/secret manager).

## Fase 1 - Identidade e segurança

1. Migrar auth mock para persistência real (users, sessions, password reset, audit).
2. Implementar MFA opcional para perfis administrativos críticos.
3. Adicionar trilha de auditoria completa por ação administrativa.
4. Implementar política de rotação de credenciais e expiração de sessão.

## Fase 2 - Catálogo e armazenamento de produtos

Objetivo: sair de JSON estático para catálogo administrável.

### Recomendação técnica

1. Banco relacional (`PostgreSQL`) para entidades transacionais e consistência.
2. Índice de busca dedicado (`OpenSearch/Elasticsearch`) para navegação/filtros.
3. Cache (`Redis`) para leitura de PLP/PDP e preços.

### Modelo mínimo de domínio

1. `products` (produto pai).
2. `skus` (variações/comercialização).
3. `categories` (árvore).
4. `collections` (coleções promocionais/temáticas).
5. `prices` (preço base, promo, validade, regionalidade).
6. `inventory` (estoque por seller/loja/centro de distribuição).

### API de catálogo

1. `GET /catalog/products`
2. `GET /catalog/products/:slug`
3. `GET /catalog/categories`
4. `POST/PATCH /catalog/products` (painel)

## Fase 3 - Regionalização e logística

1. Serviço de regionalização por CEP/geolocalização (com consentimento e fallback).
2. Regras de sortimento por região (o que aparece e o que não aparece).
3. Cálculo de SLA/frete por região e janela de entrega.
4. Endpoints de simulação logística por item e carrinho.

## Fase 4 - Checkout e pagamentos

1. Modelar carrinho server-side com idempotência.
2. Integrar gateway de pagamento (cartão, pix, carteira, boleto conforme estratégia).
3. Implementar fluxo de autorização/captura/estorno.
4. Criar webhook handler assinado para atualização de status de pagamento.
5. Orquestrar anti-fraude e regras de risco.

## Fase 5 - Promoções e motor comercial

1. Módulo de promoções com regras combináveis.
2. Promoções por coleção, categoria, SKU, canal e regionalização.
3. Cupons com limite, janela de validade e uso por cliente.
4. Simulador de preço final no painel com explicabilidade da regra aplicada.

## Fase 6 - Conta do cliente (B2C)

1. Cadastro/login de cliente final.
2. Endereços, favoritos, histórico de pedidos, recompra.
3. Preferências (comunicação, regionalização, loja preferida).
4. LGPD: consentimento, exportação e anonimização de dados.

## Fase 7 - Configurações operacionais da loja

1. Limite mínimo de compra.
2. Regras de entrega e retirada.
3. Janelas de operação por loja/região.
4. Configuração de feature flags por página/contexto.

## Fase 8 - CMS e editor visual avançado

1. Versionamento de páginas (draft/published/rollback por versão).
2. Workflows de aprovação (editor -> aprovador -> publicação).
3. Componentes dinâmicos com schema e validação.
4. Preview isolado por ambiente e token de acesso.

## Fase 9 - Qualidade e governança

1. Testes E2E críticos (compra completa, publicação de página, promoções).
2. SLOs de latência e disponibilidade por serviço.
3. Política de backup e disaster recovery.
4. Matriz de ownership por domínio (catálogo, checkout, conteúdo, auth).

## Decisão de dados: SQL vs NoSQL

### Recomendação

- Usar arquitetura híbrida:
1. `PostgreSQL` como fonte de verdade.
2. `OpenSearch` para busca/PLP.
3. `Redis` para cache de leitura e sessão.

### Quando usar NoSQL puro

- Apenas se o domínio priorizar documentos altamente flexíveis sem forte relação transacional.
- Para e-commerce com checkout/pagamento, SQL tende a reduzir risco operacional.

## Entregáveis de curto prazo (30-45 dias)

1. Contrato `api/v1` entre painel e storefront.
2. Banco Postgres com migrations iniciais (auth + catálogo base).
3. CRUD de produtos/categorias/coleções no painel.
4. Resolver de rotas dinâmicas via API com cache.
5. Prova de conceito de checkout com gateway sandbox.
