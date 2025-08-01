## [2.0.4] - 2025-07-31

### docs
- improve git flow automation with smart PR links

  Enchanced PR creation with pre-filled URLs and removed local template files for better workflow experience

## [2.0.3] - 2025-07-31

### docs
- improve git flow automation with smart PR links
  
  Enhanced PR creation with pre-filled URLs and removed local template files

## [2.0.2] - 2025-07-31

### docs
- add git automation system documentation and improve branch naming
  
  Added comprehensive documentation for git flow automation system and implemented shorter branch naming algorithm for better usability

## [2.0.1] - 2025-07-31

### docs
- add git automation system documentation and improve branch naming
  
  Added comprehensive documentation for git flow automation system and implemented shorter branch naming algorithm for better usability

## [2.0.0] - 2025-07-31

### refactor
- enhance translation system with improved architecture and documentation
  
  Major refactoring with centralized configuration, modular hooks, enhanced error handling, and comprehensive documentation

## [1.6.2] - 2025-07-31

### refactor
- simplify translation system and remove duplicated files
  
  Major refactoring of the translation system to eliminate code duplication and improve maintainability by removing 6 duplicate files and creating 4 optimized modules with centralized configuration

﻿# Changelog

Todas as mudanÃ§as notÃ¡veis deste projeto serÃ£o documentadas neste arquivo.

O formato Ã© baseado em [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), e este projeto adota [Semantic Versioning](https://semver.org/).

## [Unreleased]
## [1.6.1] - 2025-07-31

### Documentacao

- teste de versionamento

### âœ¨ Adicionado
- ðŸš€ Sistema completo de automaÃ§Ã£o Git Flow
- ðŸ“‹ Templates inteligentes de Pull Request
- ðŸ”„ Conventional commits com guia interativo
- ðŸ“ GeraÃ§Ã£o automÃ¡tica de CHANGELOG
- ðŸ·ï¸ Versionamento semÃ¢ntico automÃ¡tico
- ðŸŽ¯ DetecÃ§Ã£o automÃ¡tica de componentes afetados
- ðŸ› ï¸ Scripts NPM para automaÃ§Ã£o completa
- ðŸ¤ Guia de contribuiÃ§Ã£o completo
- ðŸ“„ CÃ³digo de conduta
- ðŸ“‹ Templates de Issue (bug report, feature request, documentation)

### â™»ï¸ Refatorado
- ðŸ” MigraÃ§Ã£o de autenticaÃ§Ã£o Google Sheets para variÃ¡veis de ambiente
- ðŸ“š Estrutura de documentaÃ§Ã£o e templates de contribuiÃ§Ã£o

### ðŸ”’ SeguranÃ§a
- ðŸ” EliminaÃ§Ã£o de arquivos de credenciais do repositÃ³rio
- ðŸ›¡ï¸ CentralizaÃ§Ã£o de credenciais em variÃ¡veis de ambiente

## [1.6.0] - 2025-07-31
### Added
- **MOTD (Message of the Day)**: Nova rota `/motd` com gerador inteligente de frases motivacionais
  - Sistema avanÃ§ado de geraÃ§Ã£o com 24.560+ combinaÃ§Ãµes gramaticalmente coerentes
  - Templates baseados em estruturas linguÃ­sticas variadas
  - VocabulÃ¡rio categorizado (contextos, aÃ§Ãµes, focos, motivaÃ§Ãµes)
  - Tabs estilo Chrome para navegaÃ§Ã£o entre HistÃ³rico e Favoritas
  - Sistema de busca em tempo real
  - EstatÃ­sticas de uso (total, hoje, streak)
  - Favoritos com preservaÃ§Ã£o inteligente
  - Atalhos de teclado (EspaÃ§o, F, C, S)
  - Funcionalidades de cÃ³pia e compartilhamento
  - Sistema de limpeza inteligente que preserva favoritas
  - Design responsivo com sidebar colapsÃ¡vel

### Changed
- **CSS Modularizado**: ReestruturaÃ§Ã£o completa do sistema de estilos
  - MigraÃ§Ã£o de arquivo monolÃ­tico (650+ linhas) para sistema modular
  - CriaÃ§Ã£o de design system com tokens centralizados
  - 11 arquivos CSS focados por componente
  - IntegraÃ§Ã£o com tokens de cores existentes do site
  - Classes utilitÃ¡rias reutilizÃ¡veis
  - VariÃ¡veis CSS padronizadas
  - DocumentaÃ§Ã£o completa da estrutura

### Technical
- ComponentizaÃ§Ã£o React com TypeScript
- Hook customizado `useMotdLogic` para lÃ³gica de estado
- localStorage para persistÃªncia de dados
- Sistema anti-repetiÃ§Ã£o para frases
- Tooltips informativos em botÃµes e aÃ§Ãµes

## [1.5.3] - 2025-07-13
### Hotfix
- Corrigido consumo duplo de token na traduÃ§Ã£o IA: agora o decremento ocorre apenas na rota `/api/translate`, nunca na validaÃ§Ã£o.
- Removidos todos os `console.log` de debug do projeto.
- Build validado e fluxo de traduÃ§Ã£o revisado.

## [1.5.2] - 2025-07-08
### Fixed
- Corrigido bug que fazia duas requisiÃ§Ãµes de traduÃ§Ã£o IA ao trocar de idioma rapidamente ou ao restaurar o idioma salvo. Agora a traduÃ§Ã£o sÃ³ Ã© requisitada uma vez por troca de idioma.

## [1.5.1] - 2025-07-03
### Changed
- Favicon personalizado: substituiÃ§Ã£o do favicon padrÃ£o do Next.js por um favicon minimalista com as iniciais "SN" e as cores do tema do site (`#0a0d0a` e `#22c55e`).
- InclusÃ£o de favicon em SVG e fallback para .ico em `/public`.

## [1.5.0] - 2025-07-03
### Added
- SEO avanÃ§ado: tÃ­tulo, descriÃ§Ã£o, palavras-chave, Open Graph, Twitter Card e Schema.org JSON-LD em `src/app/head.tsx`.
- `robots.txt` e sitemap.xml bÃ¡sico em `/public` para indexaÃ§Ã£o por motores de busca.
- Sitemap dinÃ¢mico com rotas estÃ¡ticas e dinÃ¢micas em `src/app/sitemap.xml/route.ts` (Next.js App Router).
- Palavras-chave e descriÃ§Ã£o otimizadas para "Web Solutions Architect", VTEX, VTEX IO, Fast Store, Architecture, e serviÃ§os de desenvolvimento web.
- Dados estruturados de pessoa, empresa e localizaÃ§Ã£o no Schema.org.

### Changed
- AtualizaÃ§Ã£o dos links sociais (LinkedIn, GitHub) e domÃ­nio real nos metadados.
- Melhoria na descriÃ§Ã£o dos serviÃ§os e diferenciais no SEO.

### Docs
- OrientaÃ§Ãµes sobre uso de SEO, sitemap e robots.txt adicionadas ao projeto.

## [1.4.1] - 2025-07-03
### Added
- BotÃ£o "Limpar Cache" sempre visÃ­vel quando houver traduÃ§Ãµes alÃ©m de pt-br, com feedback visual de sucesso.
- Feedback visual temporÃ¡rio ao limpar cache.

### Changed
- LÃ³gica do modal de confirmaÃ§Ã£o de traduÃ§Ã£o: sÃ³ aparece no modo IA, nunca no modo mock.
- Troca de idioma no modo mock aplica traduÃ§Ã£o mock direto, sem modal.
- Reset global de traduÃ§Ãµes e idioma ao limpar cache, prevenindo bloqueio de traduÃ§Ãµes IA por sobrescrita do mock.
- Melhor UX para alternÃ¢ncia entre modos e idiomas.

### Fixed
- Previne que traduÃ§Ãµes mock sobrescrevam permanentemente a possibilidade de traduÃ§Ã£o IA para o mesmo idioma.
- CorreÃ§Ã£o de exibiÃ§Ã£o do botÃ£o de limpar cache e reset de estado global/localStorage.

## [1.4.0] - 2025-07-03
### Changed
- RefatoraÃ§Ã£o e padronizaÃ§Ã£o completa da estrutura de componentes, pastas e estilos do projeto.
- ComponentizaÃ§Ã£o e organizaÃ§Ã£o dos subcomponentes (Navbar, Header, Footer, SectionCard, StatusBar, ThemeToggle, LanguageSelector).
- PadronizaÃ§Ã£o visual e responsiva do header/navbar, modais e selects.
- CentralizaÃ§Ã£o e internacionalizaÃ§Ã£o de todos os textos fixos da interface via `labels.ts`, com traduÃ§Ã£o dinÃ¢mica para navbar, status bar, modais e aviso de cookies.
- Ajuste do fluxo de seleÃ§Ã£o de idioma: valores do select e estado global padronizados, mas conversÃ£o automÃ¡tica para o formato esperado pela API de traduÃ§Ã£o IA.
- Garantia de que a traduÃ§Ã£o IA funcione para todos os idiomas suportados, mantendo a seleÃ§Ã£o correta no select.
- RemoÃ§Ã£o de arquivos de documentaÃ§Ã£o `.md` redundantes apÃ³s padronizaÃ§Ã£o dos componentes.

### Fixed
- CorreÃ§Ã£o do fluxo de traduÃ§Ã£o IA para funcionar com os cÃ³digos de idioma esperados pela API, sem quebrar a seleÃ§Ã£o do idioma no select.
- CorreÃ§Ã£o da traduÃ§Ã£o dinÃ¢mica dos textos fixos da interface (navbar, status bar, modais, aviso de cookies, etc.) conforme o idioma selecionado.
- Ajustes de tipagem e indexaÃ§Ã£o para garantir compatibilidade com TypeScript.

## [1.3.2] - 2025-07-03
### Fixed
- Translation confirmation modal now only opens by user action (select), never by side effects or loops.
- Clear visual feedback for invalid token in authentication modal.
- Privacy policy modal now uses themed background, border, and shadow.
- Full isolation of modal flows: "No" button only closes, "Yes" only acts after validation.
- Removed all side effects that could auto-open modals.

### Changed
- UX and accessibility refinements for all modals.
- Standardized modal state and feedback control.

## [1.1.2] - 2025-07-03
### Fixed
- Modal de confirmaÃ§Ã£o de traduÃ§Ã£o agora sÃ³ abre por aÃ§Ã£o do usuÃ¡rio (select), sem loops ou reabertura indesejada.
- Feedback visual claro para token invÃ¡lido no modal de autenticaÃ§Ã£o.
- Modal de polÃ­tica de privacidade agora segue o tema (fundo, cor, borda, sombra).
- Isolamento total do fluxo dos modais: botÃ£o "NÃ£o" sÃ³ fecha, botÃ£o "Sim" sÃ³ executa aÃ§Ã£o apÃ³s validaÃ§Ã£o.
- Removido qualquer efeito colateral de abertura automÃ¡tica de modal.

### Changed
- Refino de UX e acessibilidade dos modais.
- PadronizaÃ§Ã£o do controle de estado dos modais e feedbacks.

## [1.3.1] - 2025-07-03
### Added
- Section togglers for all main sections (Summary, Skills, Experience, Education, Languages) with animated arrow buttons to expand/collapse content.
- Triple-arrow "toggle all" button in the header, allowing all sections to be expanded or collapsed at once, with smooth rotation animation and accessible tooltips.
- New CSS modules for each component, removing inline styles and standardizing the visual style across the app.
- Responsive and accessible toggles, with proper aria-labels and keyboard navigation.
- Custom SVG icons for togglers, with proportional sizing and hover effects.

### Changed
- Increased the size of all toggler arrows by 2px for better visibility.
- Section expand/collapse animation is now slower and smoother (1.25s) for a more elegant user experience.
- Visual consistency: all arrows now use the same minimal style, and the triple-arrow toggle-all matches the section togglers.
- Minor CSS and SVG refinements for spacing, color, and animation.

## [1.3.0] - 2025-07-03
### Alterado
- InternacionalizaÃ§Ã£o completa de todos os textos fixos da interface (Navbar, rodapÃ©, botÃµes, labels, select de idiomas, modais e polÃ­tica de privacidade) com labels centralizadas em `labels.ts`.
- PersistÃªncia do idioma selecionado via localStorage, restaurando corretamente apÃ³s recarregar a pÃ¡gina.
- ExibiÃ§Ã£o dos nomes dos idiomas por extenso, no prÃ³prio idioma e no idioma da interface.
- CorreÃ§Ã£o do fluxo de cache/localStorage: traduÃ§Ãµes sempre salvas e buscadas usando o currÃ­culo original em portuguÃªs como chave base.
- Modal de confirmaÃ§Ã£o de traduÃ§Ã£o/token sÃ³ aparece quando realmente necessÃ¡rio, evitando exibiÃ§Ã£o desnecessÃ¡ria ao recarregar.
- Refino do modal de polÃ­tica de privacidade para consumir labels traduzidas, incluindo todos os itens da lista.
- Ajustes de tipagem e normalizaÃ§Ã£o dos cÃ³digos de idioma em todo o app.
- Reset do idioma padrÃ£o para 'pt-br' ao limpar cache.
- Testes e revisÃµes do fluxo de troca de idioma, persistÃªncia, cache e exibiÃ§Ã£o de modais.

## [1.2.0] - 2025-07-02
### Adicionado
- Cache local de traduÃ§Ãµes por idioma/texto (evita custo extra e requisiÃ§Ãµes desnecessÃ¡rias).
- BotÃ£o "Limpar cache de traduÃ§Ãµes" na Navbar, com feedback visual.
- Estrutura de README atualizada, com instruÃ§Ãµes modernas, estrutura real de pastas e integraÃ§Ã£o Google Sheets.
- DocumentaÃ§Ã£o detalhada de integraÃ§Ã£o, configuraÃ§Ã£o e uso no `DOCUMENTATION.md`.

### Alterado
- StatusBar agora sempre visÃ­vel e com drag & drop preservando posiÃ§Ã£o.
- Layout e espaÃ§amento refinados em todas as seÃ§Ãµes para visual mais elegante e responsivo.
- Modal de confirmaÃ§Ã£o de traduÃ§Ã£o sÃ³ aparece quando necessÃ¡rio (nÃ£o exibe para idiomas jÃ¡ traduzidos).
- CÃ³digo limpo: remoÃ§Ã£o de comentÃ¡rios, variÃ¡veis e anotaÃ§Ãµes desnecessÃ¡rias.

### Corrigido
- Problemas de proporÃ§Ã£o e alinhamento entre cards/seÃ§Ãµes.
- Problemas de sumiÃ§o da StatusBar ao trocar de idioma ou durante traduÃ§Ã£o.
- Pequenos bugs de UX e warnings/lint.

## [1.1.1] - 2025-07-02
### Alterado
- Modal de confirmaÃ§Ã£o de traduÃ§Ã£o agora segue o tema global (tokens CSS), respeitando claro/escuro.
- StatusBar com drag & drop suave e preciso (atualizaÃ§Ã£o direta no DOM, sem lag).
- CorreÃ§Ã£o de hooks e return condicional para evitar warnings do React.
- Ajuste visual e uso consistente de tokens nos botÃµes, overlays e modais.
- Refino de responsividade, acessibilidade e experiÃªncia de loading.
- Pequenas correÃ§Ãµes de lint e remoÃ§Ã£o de cÃ³digo morto.

## [1.1.0] - 2025-07-01
### Adicionado
- DocumentaÃ§Ã£o detalhada para todos os componentes, hooks, utilitÃ¡rios, dados e tipos, em arquivos Markdown individuais.
- Ãndice interativo `DOCUMENTATION.md` na raiz do projeto, com links para toda a documentaÃ§Ã£o tÃ©cnica.
- Links de navegaÃ§Ã£o "Voltar ao Ãndice" em todos os arquivos de documentaÃ§Ã£o detalhada.
- Estrutura de documentaÃ§Ã£o compatÃ­vel com Obsidian, VS Code e leitores Markdown.
- PadronizaÃ§Ã£o de navegaÃ§Ã£o e organizaÃ§Ã£o para facilitar onboarding e manutenÃ§Ã£o.

### Alterado
- README principal atualizado para destacar a documentaÃ§Ã£o tÃ©cnica e navegaÃ§Ã£o facilitada.

## [1.0.0] - 2025-07-01
### Adicionado
- Estrutura inicial do projeto Next.js com TypeScript
- Suporte a mÃºltiplos idiomas (pt-br, en, es, fr, de)
- Navbar interativa e responsiva
- Componente de traduÃ§Ã£o com fallback para mock
- Componentes: Summary, Skills, Experience, Education, Languages, Footer, BackToTop, StatusBar, FallbackModal
- Hooks customizados para internacionalizaÃ§Ã£o, tema e traduÃ§Ã£o
- EstilizaÃ§Ã£o modular com CSS customizado e tokens
- ExportaÃ§Ã£o para PDF e impressÃ£o
- Teste de traduÃ§Ã£o via rota /translate-test
- Tipagem forte para dados do currÃ­culo
- Estrutura de dados separada por idioma
- IntegraÃ§Ã£o com API de traduÃ§Ã£o
