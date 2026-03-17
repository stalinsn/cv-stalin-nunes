# Guia de Contribuição

Este repositório agora mantém somente o aplicativo do CV multilíngue. O foco é preservar uma base pequena, legível e fácil de evoluir.

## Setup

```bash
yarn install
cp .env.example .env.local
yarn dev
```

Pré-requisitos:
- Node.js 20+
- Yarn
- credenciais OpenAI e Google Sheets se você for testar tradução por IA com validação de token

## Escopo esperado

Mudanças aceitas normalmente entram em um destes grupos:
- conteúdo e dados do currículo
- internacionalização e cache de traduções
- fluxo de token/tradução por IA
- acessibilidade, layout e responsividade do CV
- exportação/impressão do currículo
- documentação técnica do próprio CV

## Padrões

- use TypeScript estrito
- prefira componentes funcionais
- mantenha imports via `@/`
- evite adicionar dependências sem necessidade clara
- atualize a documentação quando o comportamento mudar

## Fluxo de contribuição

```bash
git checkout -b feature/minha-mudanca
yarn lint
yarn build
```

Antes de abrir PR:
- valide `/cv`
- valide o fluxo de tradução
- valide a exportação/impressão se sua mudança tocar esse trecho
- revise impactos em `.env.example`, `README.md` e `docs/`

## Segurança

- nunca commite `.env.local`
- nunca exponha credenciais do Google Service Account
- trate `OPENAI_API_KEY` e `AI_TRANSLATE_PASSWORD` como segredos

## Referências

- visão geral do projeto: [README.md](README.md)
- documentação técnica: [DOCUMENTATION.md](DOCUMENTATION.md)
- índice dos módulos: [docs/README_INDEX.md](docs/README_INDEX.md)
