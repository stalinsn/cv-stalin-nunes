# CV Stalin Nunes

Aplicação Next.js focada no currículo multilíngue de Stalin Souza Nunes, com tradução por IA, validação por token, cache local, exportação em PDF e impressão.

## Rotas

- `/` redireciona para `/cv`
- `/cv` renderiza o currículo
- `/api/translate` executa a tradução
- `/api/validate-token` valida tokens de uso

## Quick Start

```bash
git clone https://github.com/stalinsn/cv-stalin-nunes.git
cd cv-stalin-nunes
cp .env.example .env.local
yarn install
yarn dev
```

Acesse: [http://localhost:3000/cv](http://localhost:3000/cv)

## Scripts

```bash
yarn dev
yarn dev:tp
yarn build
yarn start
yarn lint
yarn format
yarn format:write
```

Scripts auxiliares:

```bash
yarn previews:install
yarn previews:gen
yarn previews:dev
yarn export:cv
```

## Variáveis de ambiente

Baseie-se em `.env.example`.

Obrigatórias para a tradução por IA:
- `OPENAI_API_KEY`
- `NEXT_PUBLIC_OPENAI_MODEL`
- `NEXT_PUBLIC_ENABLE_AI`
- `NEXT_PUBLIC_ENABLE_FREE`

Obrigatórias para o fluxo de token via Google Sheets:
- `GOOGLE_SHEET_ID`
- `GOOGLE_SERVICE_ACCOUNT_*`

Opcional:
- `AI_TRANSLATE_PASSWORD` para bypass administrativo do fluxo de token
- `NEXT_PUBLIC_BASE_URL` para sitemap e metadata

## Estrutura principal

```text
src/
├── app/
│   ├── cv/
│   └── api/
├── components/
├── data/
├── hooks/
├── lib/
├── styles/
├── types/
└── utils/
```

## Fluxo técnico

1. o usuário acessa `/cv`
2. `useI18n` resolve idioma atual, cache e modo de tradução
3. se necessário, o usuário valida um token em `/api/validate-token`
4. a tradução é executada em `/api/translate`
5. a resposta é persistida em cache local e refletida na UI

## Documentação

- visão técnica geral: [DOCUMENTATION.md](DOCUMENTATION.md)
- índice de módulos: [docs/README_INDEX.md](docs/README_INDEX.md)
- visão do app: [docs/apps/cv.md](docs/apps/cv.md)

## Licença

Consulte [LICENSE](LICENSE).
