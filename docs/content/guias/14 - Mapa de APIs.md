---
tags:
  - guia
  - api
  - mapa
---

# Mapa de APIs

## O que você encontra aqui

Esta nota funciona como referência rápida dos endpoints mais importantes que implementamos no admin e no ecommerce.

Ela não substitui as notas conceituais. Ela serve como mapa operacional.

## Envelope padrão de resposta

As APIs do admin usam dois helpers importantes:

```ts
export function jsonNoStore(payload: unknown, init?: ResponseInit): NextResponse {
  const response = NextResponse.json(payload, init);
  response.headers.set('Cache-Control', 'no-store, max-age=0');
  return response;
}

export function errorNoStore(status: number, error: string, details?: unknown): NextResponse {
  return jsonNoStore({ error, ...(details ? { details } : {}) }, { status });
}
```

## Leitura guiada

Isso significa que, em geral, as respostas seguem dois formatos:

### sucesso

```json
{
  "ok": true
}
```

ou um documento específico como `user`, `page`, `template`, `routes`.

### erro

```json
{
  "error": "Mensagem de erro",
  "details": {}
}
```

## Auth do admin

### `POST /api/ecommpanel/auth/login`

Faz login e cria sessão.

#### request

```json
{
  "email": "main@ecommpanel.local",
  "password": "Admin@123456"
}
```

#### success

```json
{
  "ok": true,
  "user": {
    "id": "usr-main-001",
    "email": "main@ecommpanel.local",
    "roleIds": ["main_admin"],
    "permissions": ["site.layout.manage", "site.content.manage"]
  },
  "csrfToken": "...",
  "mustChangePassword": false
}
```

#### erros comuns

- `400` quando falta email ou senha
- `401` para credenciais invalidas
- `423` para conta bloqueada
- `429` para rate limit

### `GET /api/ecommpanel/auth/me`

Retorna a sessão autenticada atual.

#### success

```json
{
  "authenticated": true,
  "user": {
    "id": "usr-main-001",
    "email": "main@ecommpanel.local"
  },
  "csrfToken": "..."
}
```

### `POST /api/ecommpanel/auth/logout`

Revoga a sessão atual. Exige origem confiável e CSRF quando existe sessão ativa.

#### success

```json
{
  "ok": true
}
```

### `POST /api/ecommpanel/auth/forgot-password`

Dispara a recuperação simulada.

#### request

```json
{
  "email": "main@ecommpanel.local"
}
```

#### success

```json
{
  "ok": true,
  "message": "Se o e-mail existir e estiver ativo, enviaremos as instrucoes de recuperacao.",
  "debugResetToken": "..."
}
```

### `POST /api/ecommpanel/auth/reset-password`

Consome token e troca a senha.

#### request

```json
{
  "token": "token-recebido",
  "password": "NovaSenha@12345"
}
```

#### success

```json
{
  "ok": true,
  "sessionsRevoked": 2
}
```

## Builder do site

### `GET /api/ecommpanel/site/routes`

Lista rotas resumidas.

#### success

```json
{
  "routes": [
    {
      "id": "page-abc",
      "title": "Landing Black Friday",
      "slug": "landing/black-friday",
      "status": "draft",
      "updatedAt": "2026-03-17T10:00:00.000Z",
      "publishedAt": null
    }
  ]
}
```

### `POST /api/ecommpanel/site/routes`

Cria rota e página inicial.

#### request

```json
{
  "title": "Landing Black Friday",
  "slug": "landing/black-friday",
  "description": "Campanha principal"
}
```

#### success

```json
{
  "ok": true,
  "route": {
    "id": "page-abc",
    "title": "Landing Black Friday",
    "slug": "landing/black-friday"
  }
}
```

#### erros comuns

- `400` para titulo ou slug ausente
- `400` para slug inválido
- `409` para colisão com rota nativa ou duplicidade

### `DELETE /api/ecommpanel/site/routes/[pageId]`

Move a rota para lixeira lógica.

#### success

```json
{
  "ok": true,
  "route": {
    "id": "page-abc",
    "status": "deleted"
  }
}
```

### `POST /api/ecommpanel/site/routes/[pageId]/restore`

Restaura da lixeira.

#### success

```json
{
  "ok": true,
  "route": {
    "id": "page-abc",
    "status": "draft"
  }
}
```

### `GET /api/ecommpanel/site/routes/trash`

Lista rotas removidas lógicamente.

## Páginas do builder

### `GET /api/ecommpanel/site/pages`

Retorna os documentos completos conhecidos pelo builder.

### `POST /api/ecommpanel/site/pages`

Cria página completa a partir de título e slug.

#### request

```json
{
  "title": "Institucional",
  "slug": "institucional/quem-somos",
  "description": "Pagina institucional"
}
```

#### success

```json
{
  "ok": true,
  "page": {
    "id": "page-xyz",
    "title": "Institucional",
    "slug": "institucional/quem-somos",
    "layoutPreset": "institutional"
  }
}
```

### `GET /api/ecommpanel/site/pages/[pageId]`

Retorna uma página específica.

### `PUT /api/ecommpanel/site/pages/[pageId]`

Atualiza o documento inteiro da página.

#### request

```json
{
  "title": "Quem somos",
  "slug": "institucional/quem-somos",
  "description": "Historia da empresa",
  "layoutPreset": "institutional",
  "slots": [
    {
      "id": "main",
      "name": "Main",
      "blocks": []
    }
  ],
  "seo": {
    "title": "Quem somos",
    "description": "Historia da empresa"
  },
  "theme": {
    "preset": "classic"
  }
}
```

#### success

```json
{
  "ok": true,
  "page": {
    "id": "page-xyz",
    "title": "Quem somos",
    "slug": "institucional/quem-somos"
  }
}
```

### `POST /api/ecommpanel/site/pages/[pageId]/publish`

Publica a página para o runtime.

#### success

```json
{
  "ok": true,
  "page": {
    "id": "page-xyz",
    "status": "published"
  }
}
```

### `POST /api/ecommpanel/site/pages/[pageId]/draft`

Volta a página para rascunho.

#### success

```json
{
  "ok": true,
  "page": {
    "id": "page-xyz",
    "status": "draft"
  }
}
```

### `GET /api/ecommpanel/site/resolve?path=/landing/black-friday`

Endpoint de diagnostico do runtime.

#### success dinâmico

```json
{
  "source": "dynamic",
  "path": "/landing/black-friday",
  "page": {
    "id": "page-abc",
    "slug": "landing/black-friday"
  }
}
```

#### success nativo

```json
{
  "source": "native",
  "path": "/checkout",
  "page": null
}
```

## Template estrutural

### `GET /api/ecommpanel/site/template`

Retorna o documento consolidado do template.

#### success

```json
{
  "template": {
    "schemaVersion": 3,
    "theme": {
      "preset": "classic",
      "campaign": "black-friday",
      "overrides": {}
    },
    "header": {},
    "home": {},
    "footer": {}
  }
}
```

### `PATCH /api/ecommpanel/site/template`

Atualiza o template inteiro e republica o snapshot do storefront.

#### request

```json
{
  "template": {
    "schemaVersion": 3,
    "theme": {
      "preset": "fresh",
      "campaign": null,
      "overrides": {
        "colorBrandPrimary": "#0f766e"
      }
    }
  }
}
```

#### success

```json
{
  "ok": true,
  "template": {
    "schemaVersion": 3,
    "theme": {
      "preset": "fresh"
    }
  }
}
```

## Ecommerce storefront

### `POST /api/checkout`

Fecha o pedido no ambiente atual de simulação.

#### request

```json
{
  "orderFormId": "of-123",
  "items": [
    {
      "id": "sku-1",
      "name": "Cafe",
      "quantity": 2,
      "price": 19.9
    }
  ],
  "clientProfileData": {
    "firstName": "Stalin",
    "email": "stalin@example.com"
  },
  "shipping": {
    "selectedAddress": {
      "postalCode": "01001-000",
      "city": "Sao Paulo",
      "state": "SP"
    }
  },
  "payments": [
    {
      "system": "pix",
      "value": 39.8
    }
  ],
  "totalizers": [],
  "value": 39.8
}
```

#### success

```json
{
  "orderId": "ORD-ABC123",
  "status": "created"
}
```

#### erros comuns

- `400` para carrinho vazio
- `400` para dados do cliente incompletos
- `400` para endereço ausente
- `400` para pagamento ausente

## Explicando de forma simples

> "O mapa de APIs é o desenho da fronteira entre camadas. Quando o aluno aprende a ler esse mapa, ele para de pensar só em componente visual e passa a entender o sistema como contratos entre cliente, servidor, persistência e runtime." 
