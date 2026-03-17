---
tags:
  - guia
  - auth
  - rbac
  - segurança
---

# Painel - Auth RBAC e Segurança

## O que você encontra aqui

Esta nota explica a camada de segurança do admin como um fluxo completo.

A ideia aqui é mostrar que autenticação, autorização e proteção contra abuso são camadas diferentes.

## Arquivos principais

- `src/app/api/ecommpanel/auth/login/route.ts`
- `src/app/api/ecommpanel/auth/me/route.ts`
- `src/app/api/ecommpanel/auth/logout/route.ts`
- `src/app/api/ecommpanel/auth/forgot-password/route.ts`
- `src/app/api/ecommpanel/auth/reset-password/route.ts`
- `src/features/ecommpanel/server/auth.ts`
- `src/features/ecommpanel/server/rbac.ts`
- `src/features/ecommpanel/server/rateLimit.ts`
- `src/features/ecommpanel/server/mockStore.ts`
- `src/features/ecommpanel/config/security.ts`

## Trecho 1 - barreiras antes mesmo da senha

```ts
if (!isTrustedOrigin(req)) {
  return errorNoStore(403, 'Origem não permitida.');
}

const rate = checkRateLimit(
  `auth:login:${getRequestFingerprint(req)}`,
  PANEL_SECURITY.rateLimits.login.limit,
  PANEL_SECURITY.rateLimits.login.windowMs,
);

if (!rate.allowed) {
  const response = errorNoStore(429, 'Muitas tentativas. Aguarde para tentar novamente.');
  response.headers.set('Retry-After', String(rate.retryAfterSeconds));
  return response;
}
```

## Leitura guiada

O login não começa verificando senha.

Ele começa verificando se a requisição veio da origem esperada e se aquele cliente ainda está dentro da janela de tentativas aceitáveis.

Em termos didáticos, isso é importante porque mostra que segurança não é só criptografia. Segurança também é reduzir superfície de abuso.

## Trecho 2 - verificação da conta e bloqueio temporário

```ts
if (isUserLocked(user)) {
  return errorNoStore(423, 'Conta temporariamente bloqueada por segurança.');
}

const passwordMatches = await verifyPassword(password, user.passwordHash);
if (!passwordMatches) {
  const lock = recordFailedLogin(user.id);

  if (lock.locked) {
    return errorNoStore(423, 'Conta temporariamente bloqueada por segurança.');
  }

  return errorNoStore(401, INVALID_CREDENTIALS_MESSAGE);
}
```

## O que isso ensina

Aqui existem duas proteções diferentes:

- o rate limit por fingerprint da requisição;
- o bloqueio da própria conta depois de repetidas falhas.

Hoje a política está em `security.ts`:

- máximo de `5` erros antes de bloquear a conta;
- bloqueio de `15 minutos`;
- limite de `10` tentativas de login por `10 minutos` no rate limiter.

## Trecho 3 - criação da sessão e cookies

```ts
const { session, rawSessionId } = createSession({
  userId: user.id,
  userAgent: getUserAgent(req),
  ip: getClientIp(req),
});

const response = jsonNoStore({
  ok: true,
  user: authenticatedUser,
  csrfToken: session.csrfToken,
  mustChangePassword: authenticatedUser.mustChangePassword,
});

setAuthCookies(response, rawSessionId, session.csrfToken);
```

## Leitura em linguagem natural

Depois que a senha passa, o sistema cria uma sessão server-side e devolve dois elementos para o cliente:

- o cookie da sessão;
- o token CSRF.

O ponto mais importante aqui é que a sessão persistida guarda fingerprint do ambiente de origem.

## Trecho 4 - validação da sessão em cada chamada

```ts
const session = options?.touch === false ? getSession(rawSessionId) : touchSession(rawSessionId);

if (Date.now() >= new Date(session.expiresAt).getTime()) {
  deleteSession(rawSessionId);
  return null;
}

if (!validateRequestFingerprint(req, session.userAgentHash, session.ipHash)) {
  deleteSession(rawSessionId);
  return null;
}
```

## O que isso ensina

O cookie sozinho não basta.

A cada leitura protegida, o backend:

1. encontra a sessão;
2. verifica expiração;
3. verifica se o usuário ainda está ativo;
4. verifica o hash do user-agent;
5. renova a janela ociosa quando faz sentido.

Isso é um bom exemplo de sessão com `idle ttl` e `hard ttl` trabalhando juntas.

## Trecho 5 - RBAC real

```ts
export function resolvePermissions(user: PanelUser): PanelPermission[] {
  const granted = new Set<PanelPermission>();

  for (const roleId of user.roleIds) {
    const role = PANEL_ROLES_MAP[roleId];
    if (!role) continue;
    role.permissions.forEach((permission) => granted.add(permission));
  }

  user.permissionsAllow.forEach((permission) => granted.add(permission));
  user.permissionsDeny.forEach((permission) => granted.delete(permission));

  return Array.from(granted);
}
```

## Leitura guiada

O painel não guarda só um papel fixo e pronto.

Ele resolve permissões finais a partir de:

- papéis base;
- permissões extras liberadas;
- permissões explicitamente negadas.

Isso dá mais flexibilidade e também serve muito bem para explicar a diferença entre `role` e `permission`.

## Trecho 6 - autorização e CSRF nas mutações

```ts
const auth = await getApiAuthContext(req);
if (!auth) return { error: errorNoStore(401, 'Não autenticado.') };
if (!hasPermission(auth.user, 'site.content.manage')) {
  return { error: errorNoStore(403, 'Sem permissão para gerenciar páginas.') };
}

if (!hasValidCsrf(req, auth.csrfToken)) {
  return errorNoStore(403, 'Token CSRF inválido.');
}
```

## O que isso ensina

Esse é o padrão correto para toda API administrativa:

- autenticar;
- autorizar;
- validar a mutação.

Se a UI esconder um botão, isso melhora usabilidade. Mas a segurança verdadeira continua sendo responsabilidade da rota.

## Fluxo completo de autenticação e proteção

1. o usuário envia `email` e `password` para `/api/ecommpanel/auth/login`;
2. a rota valida origem e rate limit;
3. a conta pode ser bloqueada se estiver em janela de abuso;
4. a senha é verificada;
5. o backend cria sessão, cookies e token CSRF;
6. chamadas futuras usam a sessão para obter `auth context`;
7. cada mutação exige permissão e CSRF válido;
8. o logout revoga a sessão e limpa os cookies.

## Explicando de forma simples

> "No painel, estar logado não significa poder fazer tudo. Primeiro a sessão precisa existir e ser válida. Depois a role vira permissões concretas. E, por fim, cada escrita importante ainda exige origem confiável e token CSRF." 

## Fechamento

Se o aluno entender esta nota, ele já consegue diferenciar claramente:

- login;
- sessão;
- CSRF;
- rate limit;
- lockout;
- RBAC.
