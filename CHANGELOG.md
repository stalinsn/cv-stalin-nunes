# Changelog

Todas as mudanças notáveis deste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) e este projeto segue [Semantic Versioning](https://semver.org/).

## [1.0.0] - 2026-03-17

### Added
- Aplicação pública consolidada em torno do CV multilíngue.
- Fluxo de tradução por IA com suporte a token e cache local.
- Exportação standalone do CV via `yarn export:cv`.
- Geração de preview do CV via Playwright.
- Índice técnico enxuto em `docs/README_INDEX.md`.

### Changed
- A rota raiz `/` agora redireciona diretamente para `/cv`.
- README, documentação raiz, scripts e `.env.example` foram simplificados para o escopo do CV.
- `tsconfig.json` passou a ignorar artefatos gerados em `exports/`.

### Removed
- Apps e rotas do antigo hub (`MOTD`, `E-commerce`, `EcommPanel` e site interno de docs).
- APIs, features, dados e estilos que pertenciam apenas ao hub.
- Scripts e automações específicas do mono-repo anterior.
