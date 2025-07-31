# Changelog

Todas as mudanças notáveis deste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), e este projeto adota [Semantic Versioning](https://semver.org/).

## [Unreleased]

### ✨ Adicionado
- 🚀 Sistema completo de automação Git Flow
- 📋 Templates inteligentes de Pull Request
- 🔄 Conventional commits com guia interativo
- 📝 Geração automática de CHANGELOG
- 🏷️ Versionamento semântico automático
- 🎯 Detecção automática de componentes afetados
- 🛠️ Scripts NPM para automação completa
- 🤝 Guia de contribuição completo
- 📄 Código de conduta
- 📋 Templates de Issue (bug report, feature request, documentation)

### ♻️ Refatorado
- 🔐 Migração de autenticação Google Sheets para variáveis de ambiente
- 📚 Estrutura de documentação e templates de contribuição

### 🔒 Segurança
- 🔐 Eliminação de arquivos de credenciais do repositório
- 🛡️ Centralização de credenciais em variáveis de ambiente

## [1.6.0] - 2025-07-31
### Added
- **MOTD (Message of the Day)**: Nova rota `/motd` com gerador inteligente de frases motivacionais
  - Sistema avançado de geração com 24.560+ combinações gramaticalmente coerentes
  - Templates baseados em estruturas linguísticas variadas
  - Vocabulário categorizado (contextos, ações, focos, motivações)
  - Tabs estilo Chrome para navegação entre Histórico e Favoritas
  - Sistema de busca em tempo real
  - Estatísticas de uso (total, hoje, streak)
  - Favoritos com preservação inteligente
  - Atalhos de teclado (Espaço, F, C, S)
  - Funcionalidades de cópia e compartilhamento
  - Sistema de limpeza inteligente que preserva favoritas
  - Design responsivo com sidebar colapsável

### Changed
- **CSS Modularizado**: Reestruturação completa do sistema de estilos
  - Migração de arquivo monolítico (650+ linhas) para sistema modular
  - Criação de design system com tokens centralizados
  - 11 arquivos CSS focados por componente
  - Integração com tokens de cores existentes do site
  - Classes utilitárias reutilizáveis
  - Variáveis CSS padronizadas
  - Documentação completa da estrutura

### Technical
- Componentização React com TypeScript
- Hook customizado `useMotdLogic` para lógica de estado
- localStorage para persistência de dados
- Sistema anti-repetição para frases
- Tooltips informativos em botões e ações

## [1.5.3] - 2025-07-13
### Hotfix
- Corrigido consumo duplo de token na tradução IA: agora o decremento ocorre apenas na rota `/api/translate`, nunca na validação.
- Removidos todos os `console.log` de debug do projeto.
- Build validado e fluxo de tradução revisado.

## [1.5.2] - 2025-07-08
### Fixed
- Corrigido bug que fazia duas requisições de tradução IA ao trocar de idioma rapidamente ou ao restaurar o idioma salvo. Agora a tradução só é requisitada uma vez por troca de idioma.

## [1.5.1] - 2025-07-03
### Changed
- Favicon personalizado: substituição do favicon padrão do Next.js por um favicon minimalista com as iniciais "SN" e as cores do tema do site (`#0a0d0a` e `#22c55e`).
- Inclusão de favicon em SVG e fallback para .ico em `/public`.

## [1.5.0] - 2025-07-03
### Added
- SEO avançado: título, descrição, palavras-chave, Open Graph, Twitter Card e Schema.org JSON-LD em `src/app/head.tsx`.
- `robots.txt` e sitemap.xml básico em `/public` para indexação por motores de busca.
- Sitemap dinâmico com rotas estáticas e dinâmicas em `src/app/sitemap.xml/route.ts` (Next.js App Router).
- Palavras-chave e descrição otimizadas para "Web Solutions Architect", VTEX, VTEX IO, Fast Store, Architecture, e serviços de desenvolvimento web.
- Dados estruturados de pessoa, empresa e localização no Schema.org.

### Changed
- Atualização dos links sociais (LinkedIn, GitHub) e domínio real nos metadados.
- Melhoria na descrição dos serviços e diferenciais no SEO.

### Docs
- Orientações sobre uso de SEO, sitemap e robots.txt adicionadas ao projeto.

## [1.4.1] - 2025-07-03
### Added
- Botão "Limpar Cache" sempre visível quando houver traduções além de pt-br, com feedback visual de sucesso.
- Feedback visual temporário ao limpar cache.

### Changed
- Lógica do modal de confirmação de tradução: só aparece no modo IA, nunca no modo mock.
- Troca de idioma no modo mock aplica tradução mock direto, sem modal.
- Reset global de traduções e idioma ao limpar cache, prevenindo bloqueio de traduções IA por sobrescrita do mock.
- Melhor UX para alternância entre modos e idiomas.

### Fixed
- Previne que traduções mock sobrescrevam permanentemente a possibilidade de tradução IA para o mesmo idioma.
- Correção de exibição do botão de limpar cache e reset de estado global/localStorage.

## [1.4.0] - 2025-07-03
### Changed
- Refatoração e padronização completa da estrutura de componentes, pastas e estilos do projeto.
- Componentização e organização dos subcomponentes (Navbar, Header, Footer, SectionCard, StatusBar, ThemeToggle, LanguageSelector).
- Padronização visual e responsiva do header/navbar, modais e selects.
- Centralização e internacionalização de todos os textos fixos da interface via `labels.ts`, com tradução dinâmica para navbar, status bar, modais e aviso de cookies.
- Ajuste do fluxo de seleção de idioma: valores do select e estado global padronizados, mas conversão automática para o formato esperado pela API de tradução IA.
- Garantia de que a tradução IA funcione para todos os idiomas suportados, mantendo a seleção correta no select.
- Remoção de arquivos de documentação `.md` redundantes após padronização dos componentes.

### Fixed
- Correção do fluxo de tradução IA para funcionar com os códigos de idioma esperados pela API, sem quebrar a seleção do idioma no select.
- Correção da tradução dinâmica dos textos fixos da interface (navbar, status bar, modais, aviso de cookies, etc.) conforme o idioma selecionado.
- Ajustes de tipagem e indexação para garantir compatibilidade com TypeScript.

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
- Modal de confirmação de tradução agora só abre por ação do usuário (select), sem loops ou reabertura indesejada.
- Feedback visual claro para token inválido no modal de autenticação.
- Modal de política de privacidade agora segue o tema (fundo, cor, borda, sombra).
- Isolamento total do fluxo dos modais: botão "Não" só fecha, botão "Sim" só executa ação após validação.
- Removido qualquer efeito colateral de abertura automática de modal.

### Changed
- Refino de UX e acessibilidade dos modais.
- Padronização do controle de estado dos modais e feedbacks.

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
- Internacionalização completa de todos os textos fixos da interface (Navbar, rodapé, botões, labels, select de idiomas, modais e política de privacidade) com labels centralizadas em `labels.ts`.
- Persistência do idioma selecionado via localStorage, restaurando corretamente após recarregar a página.
- Exibição dos nomes dos idiomas por extenso, no próprio idioma e no idioma da interface.
- Correção do fluxo de cache/localStorage: traduções sempre salvas e buscadas usando o currículo original em português como chave base.
- Modal de confirmação de tradução/token só aparece quando realmente necessário, evitando exibição desnecessária ao recarregar.
- Refino do modal de política de privacidade para consumir labels traduzidas, incluindo todos os itens da lista.
- Ajustes de tipagem e normalização dos códigos de idioma em todo o app.
- Reset do idioma padrão para 'pt-br' ao limpar cache.
- Testes e revisões do fluxo de troca de idioma, persistência, cache e exibição de modais.

## [1.2.0] - 2025-07-02
### Adicionado
- Cache local de traduções por idioma/texto (evita custo extra e requisições desnecessárias).
- Botão "Limpar cache de traduções" na Navbar, com feedback visual.
- Estrutura de README atualizada, com instruções modernas, estrutura real de pastas e integração Google Sheets.
- Documentação detalhada de integração, configuração e uso no `DOCUMENTATION.md`.

### Alterado
- StatusBar agora sempre visível e com drag & drop preservando posição.
- Layout e espaçamento refinados em todas as seções para visual mais elegante e responsivo.
- Modal de confirmação de tradução só aparece quando necessário (não exibe para idiomas já traduzidos).
- Código limpo: remoção de comentários, variáveis e anotações desnecessárias.

### Corrigido
- Problemas de proporção e alinhamento entre cards/seções.
- Problemas de sumiço da StatusBar ao trocar de idioma ou durante tradução.
- Pequenos bugs de UX e warnings/lint.

## [1.1.1] - 2025-07-02
### Alterado
- Modal de confirmação de tradução agora segue o tema global (tokens CSS), respeitando claro/escuro.
- StatusBar com drag & drop suave e preciso (atualização direta no DOM, sem lag).
- Correção de hooks e return condicional para evitar warnings do React.
- Ajuste visual e uso consistente de tokens nos botões, overlays e modais.
- Refino de responsividade, acessibilidade e experiência de loading.
- Pequenas correções de lint e remoção de código morto.

## [1.1.0] - 2025-07-01
### Adicionado
- Documentação detalhada para todos os componentes, hooks, utilitários, dados e tipos, em arquivos Markdown individuais.
- Índice interativo `DOCUMENTATION.md` na raiz do projeto, com links para toda a documentação técnica.
- Links de navegação "Voltar ao Índice" em todos os arquivos de documentação detalhada.
- Estrutura de documentação compatível com Obsidian, VS Code e leitores Markdown.
- Padronização de navegação e organização para facilitar onboarding e manutenção.

### Alterado
- README principal atualizado para destacar a documentação técnica e navegação facilitada.

## [1.0.0] - 2025-07-01
### Adicionado
- Estrutura inicial do projeto Next.js com TypeScript
- Suporte a múltiplos idiomas (pt-br, en, es, fr, de)
- Navbar interativa e responsiva
- Componente de tradução com fallback para mock
- Componentes: Summary, Skills, Experience, Education, Languages, Footer, BackToTop, StatusBar, FallbackModal
- Hooks customizados para internacionalização, tema e tradução
- Estilização modular com CSS customizado e tokens
- Exportação para PDF e impressão
- Teste de tradução via rota /translate-test
- Tipagem forte para dados do currículo
- Estrutura de dados separada por idioma
- Integração com API de tradução
