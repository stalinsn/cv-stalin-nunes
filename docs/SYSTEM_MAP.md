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
- `ecommpanel`: camada administrativa externa, preparada para manipular o e-commerce via REST (`/api/ecommpanel/*`).

## Fluxo-alvo de administração

1. Usuário autentica no `ecommpanel`.
2. Permissões efetivas (role + allow/deny) são resolvidas.
3. Painel chama endpoints administrativos protegidos.
4. Endpoints aplicam validações de segurança e (no futuro) persistem em banco.
5. Storefront consome as configurações/dados publicados.

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
  - catálogo, preços, conteúdo, feature flags, logística e configurações de loja.
- Painel visual para ativar/desativar módulos por página e contexto (home, PLP, PDP, checkout).
