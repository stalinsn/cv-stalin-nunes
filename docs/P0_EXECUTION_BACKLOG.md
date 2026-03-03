# Backlog Executável P0 (Plano de Fechamento)

Plano objetivo para sair de mock e entrar em operação técnica confiável do `e-commerce` + `ecommpanel`.

## Meta do P0

Entregar base de produção com:

1. Contrato de integração estável entre painel e storefront.
2. Persistência real de identidade e catálogo.
3. Fluxo mínimo transacional de checkout e pagamento sandbox.
4. Operação monitorável com testes críticos automatizados.

## Premissas

- Time enxuto (fullstack + apoio devops).
- Primeiro deploy em ambiente único, com capacidade de separar serviços depois.
- Foco em estabilidade funcional antes de otimizações avançadas.

## Backlog priorizado (ordem de execução)

| ID | Item | Objetivo funcional | Estimativa | Dependências | Entregável | Critério de aceite |
|---|---|---|---|---|---|---|
| P0-01 | Contrato `api/v1` painel <-> ecommerce | Evitar quebra de integração com apps separados | 2-3 dias | Nenhuma | Documento de contrato + handlers v1 + testes de contrato iniciais | Rotas `v1` ativas, com payload validado e versionado |
| P0-02 | Fundamento de dados (PostgreSQL + migrations) | Trocar mock por persistência confiável | 2-3 dias | P0-01 | Camada DB + migrations + seed inicial | Ambiente sobe com migrations e seed sem intervenção manual |
| P0-03 | Auth/RBAC persistidos + auditoria | Garantir segurança operacional e rastreabilidade | 4-5 dias | P0-02 | Tabelas de auth/session/roles/audit + endpoints adaptados | Login, sessão, permissões e trilha de auditoria funcionando em DB |
| P0-04 | Catálogo mínimo persistido | Habilitar CRUD real de produtos/categorias/SKUs | 5-6 dias | P0-02 | Domínio catálogo + API CRUD + listagem no painel | Produto criado no painel aparece no storefront |
| P0-05 | Regionalização por CEP (MVP) | Definir sortimento e entrega por região | 3-4 dias | P0-04 | Serviço de CEP + regras regionais básicas | Mudança de CEP altera sortimento/SLA no fluxo de compra |
| P0-06 | Carrinho server-side idempotente | Evitar inconsistência de estado no checkout | 4-5 dias | P0-04 | API de carrinho + chaves idempotentes | Repetição de request não duplica item/pedido |
| P0-07 | Checkout transacional + criação de pedido | Consolidar pedido com consistência | 4-5 dias | P0-06 | Pipeline de pedido (draft -> confirmado) | Pedido é criado uma única vez com totais corretos |
| P0-08 | Gateway sandbox + webhook assinado | Validar ciclo financeiro ponta a ponta | 4-5 dias | P0-07 | Integração sandbox + endpoint webhook seguro | Pagamento altera status do pedido via webhook validado |
| P0-09 | Promoções MVP | Ativar regras comerciais mínimas | 3-4 dias | P0-04 | Motor simples de promo + cupom | Desconto é aplicado e explicado no resumo do pedido |
| P0-10 | Configurações operacionais da loja | Controlar limite mínimo, entrega e flags | 2-3 dias | P0-03 | Módulo de configurações + aplicação no storefront | Alteração no painel reflete no comportamento da loja |
| P0-11 | Observabilidade mínima | Reduzir tempo de diagnóstico em incidente | 2-3 dias | P0-03 | Logs estruturados, correlation ID, healthcheck, alertas base | Incidente é rastreável por request ID fim-a-fim |
| P0-12 | Testes críticos E2E e go-live checklist | Garantir regressão controlada | 3-4 dias | P0-04..P0-11 | Suite E2E + checklist de liberação | Fluxo de compra e publicação de página passam no CI |

## Sequência recomendada por ondas

### Onda 1 (semana 1-2) - Fundação

- `P0-01`, `P0-02`, `P0-03`
- Saída: segurança e integração versionada com persistência real.

### Onda 2 (semana 3-4) - Core comercial

- `P0-04`, `P0-05`, `P0-06`, `P0-07`
- Saída: catálogo real + compra com consistência transacional.

### Onda 3 (semana 5-6) - Financeiro e operação

- `P0-08`, `P0-09`, `P0-10`, `P0-11`, `P0-12`
- Saída: ciclo financeiro validado + monitoramento + suíte de confiança para deploy.

## Alternativas arquiteturais (quando necessário)

- Se `OpenSearch` atrasar: usar busca SQL com índice textual inicialmente.
- Se gateway principal atrasar: subir com gateway sandbox único e isolar via adapter.
- Se regionalização externa falhar: fallback por faixa de CEP local até integração oficial.

## Definição de pronto (DoD) por item

Cada item P0 só fecha com:

1. Código revisado + lint/build verdes.
2. Critérios de aceite validados em ambiente de homologação.
3. Documentação atualizada (`README`, `RUNBOOK` e endpoint/schema).
4. Log de auditoria/observabilidade aplicado quando o item envolver mutação crítica.

## Indicadores de sucesso do P0

- Taxa de falha no checkout abaixo do limite definido.
- Tempo médio de diagnóstico de incidente reduzido por correlation ID.
- Publicação de conteúdo via painel refletida no storefront sem intervenção manual.
- Zero regressão crítica nos fluxos E2E de compra e publicação.
