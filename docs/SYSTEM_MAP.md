# Mapa do Sistema (App Lab)

Visão arquitetural consolidada dos apps principais (`cv`, `motd`, `e-commerce`) e do novo projeto adicional `ecommpanel`.

## Estrutura de apps

- `src/app/cv`:
  - App independente de currículo multilíngue
  - Foco em conteúdo estático/dinâmico, tradução e exportação
- `src/app/motd`:
  - App independente de mensagem do dia
  - Foco em UX, interações rápidas e favoritos/histórico
- `src/app/e-commerce`:
  - Storefront demo com PLP/PDP/carrinho/checkout
  - Consome dados mock e integrações API (VTEX proxy, checkout mock)
- `src/app/ecommpanel`:
  - Novo app administrativo (mock) separado do storefront
  - Responsável por autenticação, controle de acesso e gestão operacional

## Fronteiras e acoplamento

- `cv` e `motd`: não dependem do `e-commerce`.
- `e-commerce`: continua independente, sem dependência obrigatória do painel.
- `ecommpanel`: camada administrativa externa, preparada para manipular o e-commerce via REST (`/api/ecommpanel/*`) e por snapshots JSON publicados.

## Fluxo-alvo de administração

1. Usuário autentica no `ecommpanel`.
2. Permissões efetivas (role + allow/deny) são resolvidas.
3. Painel chama endpoints administrativos protegidos.
4. Endpoints aplicam validações de segurança e (no futuro) persistem em banco.
5. Storefront consome apenas as configurações/dados publicados.

## Bridge de conteúdo atual

O acoplamento entre `ecommpanel` e `e-commerce` está concentrado em um runtime de conteúdo por arquivo.

### Persistência administrativa

Site builder:

- `src/data/ecommpanel/site-routes.json`
- `src/data/ecommpanel/site-pages/<pageId>.json`

Storefront:

- `src/data/ecommpanel/storefront/meta.json`
- `src/data/ecommpanel/storefront/theme.json`
- `src/data/ecommpanel/storefront/header.json`
- `src/data/ecommpanel/storefront/home.json`
- `src/data/ecommpanel/storefront/footer.json`

### Snapshot publicado

- `site-pages.published.json`
- `manifest.json`
- `storefront-template.published.json`

### Responsabilidade do storefront

- resolver páginas dinâmicas no catch-all;
- respeitar rotas nativas e namespaces reservados;
- aplicar o template publicado como base autoritativa do tema e da estrutura da home.

## Camadas de segurança (mock atual)

- Hash de senha com `scrypt` + salt.
- Sessão por cookie `httpOnly` + `sameSite` + `secure` em produção.
- CSRF token para mutações administrativas.
- Rate limiting por rota e fingerprint de requisição.
- Lockout após tentativas inválidas de login.
- RBAC com permissões granulares (`allow`/`deny` por usuário).
- Log de auditoria para eventos sensíveis.

## Evolução planejada

- Persistência real (users/sessions/audit/tokens) em banco.
- Integração de segredos/KMS para material sensível.
- Integrações REST versionadas para módulos do e-commerce:
  - catálogo, preços, conteúdo, logística e configurações de loja.
- Migração do runtime atual em JSON para persistência por domínio em banco, preservando a separação já adotada entre `theme`, `header`, `home`, `footer`, `mega menu`, `site routes` e `site pages`.
- Painel visual para ativar/desativar módulos por página e contexto (home, PLP, PDP, checkout), expandindo o modelo já aplicado ao template atual.

Referência detalhada: [ECOM_CONTENT_RUNTIME.md](ECOM_CONTENT_RUNTIME.md)
