# Documentação Técnica

Este repositório agora mantém apenas o aplicativo do CV. A documentação complementar continua em `docs/`, organizada por domínio do código.

## Onde começar

- visão geral e setup: [README.md](README.md)
- índice dos módulos: [docs/README_INDEX.md](docs/README_INDEX.md)
- documentação do app: [docs/apps/cv.md](docs/apps/cv.md)

## Estrutura da documentação

- `docs/components/`: componentes React do CV
- `docs/hooks/`: hooks de idioma, tema e fluxo de tradução
- `docs/data/`: dados estáticos, labels e idiomas
- `docs/lib/`: integração de tradução, PDF e impressão
- `docs/types/`: contratos TypeScript
- `docs/utils/`: cache, sanitização e helpers

## Variáveis de ambiente

Configure o arquivo `.env.local` a partir de `.env.example`.

Variáveis principais:
- `OPENAI_API_KEY`
- `NEXT_PUBLIC_OPENAI_MODEL`
- `NEXT_PUBLIC_ENABLE_AI`
- `NEXT_PUBLIC_ENABLE_FREE`
- `AI_TRANSLATE_PASSWORD`
- `GOOGLE_SHEET_ID`
- `GOOGLE_SERVICE_ACCOUNT_*`
- `NEXT_PUBLIC_BASE_URL`

## Fluxo técnico resumido

1. o usuário acessa `/cv`
2. `useI18n` resolve idioma, cache e modo de tradução
3. `POST /api/validate-token` valida o token quando necessário
4. `POST /api/translate` chama o provedor de tradução configurado
5. o resultado é salvo em cache local e refletido na interface

## Referências externas

- [Google Sheets API](https://developers.google.com/sheets/api/quickstart/nodejs)
- [Google Service Accounts](https://cloud.google.com/iam/docs/service-accounts)
- [OpenAI API](https://platform.openai.com/docs/overview)
