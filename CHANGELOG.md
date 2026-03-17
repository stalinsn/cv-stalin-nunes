# Changelog

Todas as mudanças notáveis deste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), e este projeto adota [Semantic Versioning](https://semver.org/).

## [3.0.0] - 2026-03-17

### Added
- Novo site interno de documentação em `/docs`, com navegação própria, home dedicada, sumário lateral, aliases a partir de `/e-commerce/docs` e renderização estática de notas Markdown.
- Nova base canônica de conteúdo em `docs/content`, organizada em `Base do projeto`, `Guias` e `Slides`, substituindo o acoplamento anterior com a pasta auxiliar de Obsidian.
- Nova camada visual para a documentação com recortes por seção, ícones SVG inline, destaques contextuais e estrutura pensada para leitura técnica longa em desktop.
- Nova trilha de guias cobrindo storefront, painel administrativo, APIs, builder, runtime, segurança e fluxos end-to-end.

### Changed
- EcommPanel consolidado como centro de operação do storefront, com edição granular de `Template`, `Tema`, `Mega Menu`, builder de rotas/páginas e publicação por runtime desacoplado.
- Storefront do e-commerce ampliado para consumir template, tema, mega menu e páginas dinâmicas publicadas via JSON, sem depender de geração de arquivos de rota no `src/app`.
- Persistência administrativa reorganizada em documentos menores por domínio (`theme`, `header`, `home`, `footer`, `site-routes`, `site-pages/*`), mantendo espelhos legados apenas por compatibilidade.
- Builder evoluído para namespaces operacionais (`landing`, `campanhas`, `institucional`, `conteúdo`, `custom`), com proteção contra colisão de rotas nativas e melhor contexto de criação no editor.
- UI do painel administrativo refinada para uso real em desktop, com seções colapsáveis persistentes, ações sticky, densidade visual melhor distribuída e módulos/toggles por contexto.
- Catálogo de presets visuais do storefront revisado com identidades distintas para cenários como `Dia das Mães` e `Black Friday`.

### Removed
- Pasta `docs/obsidian` removida do repositório; a documentação do projeto passa a ser servida e mantida pela árvore `docs/content`.

### Technical
- Fonte do site `/docs` migrada para `docs/content`, com compatibilidade mantida para URLs antigas em `/docs/aulas` via redirect para `/docs/guias`.
- Texto e taxonomia da documentação padronizados em português com acentuação corrigida e nomenclatura alinhada a `Guias`.
- Estrutura de runtime e publicação validada para seguir servindo conteúdo sem rebuild em modo servidor, preservando o desacoplamento entre painel e loja.


## [2.8.0] - 2026-03-03

### Added
- Novo app administrativo `EcommPanel` em `src/app/ecommpanel` com login, recuperação/reset de senha, área admin e módulos de usuários/site.
- Nova API administrativa em `src/app/api/ecommpanel/*` com endpoints de autenticação, gestão de usuários e gestão de páginas/rotas dinâmicas.
- Runtime de conteúdo publicado para integração painel -> storefront em `src/features/site-runtime` e resolução de rotas dinâmicas no e-commerce (`[...cmsPath]`).
- Novas documentações operacionais e de arquitetura: `docs/SYSTEM_MAP.md`, `docs/RUNBOOK.md`, `docs/IMPLEMENTATION_ROADMAP.md`, `docs/P0_EXECUTION_BACKLOG.md` e `docs/apps/ecommpanel.md`.

### Changed
- README principal atualizado para refletir os 4 apps (`CV`, `MOTD`, `E-commerce`, `EcommPanel`), fluxo de export desacoplado e bridge de conteúdo por `ECOM_CONTENT_PATH`.
- Feature flags do e-commerce ampliadas para granularidade por área (layout, header, home, PLP, PDP, cart, drawer e checkout) em `src/features/ecommerce/config/featureFlags.ts`.
- Componentes de ecommerce adaptados para flags finas (ex.: `Header`, `Banners`, `CheckoutView`, `DrawerCart`, `CartView`, `Showcase`) e suporte a renderização condicional por contexto.
- Exportação standalone estendida com `export:ecommpanel` e atualização do `export:all`.

### Technical
- Ajustes estruturais de rotas/layout do e-commerce para conviver com páginas nativas e CMS dinâmico.
- Inclusão de variável opcional `ECOM_CONTENT_PATH` em `.env.example` para diretório compartilhado de publicação/leitura entre painel e loja.


## [2.7.0] - 2026-03-02

### Added
- Catálogo mock robusto para o e-commerce em `src/features/ecommerce/data/mock-catalog` (manifesto, taxonomy, índice e base extensa de produtos)
- Novas camadas de domínio para catálogo, precificação e regionalização: `catalog.ts`, `pricing.ts` e `regionalization.ts`
- Esqueleto de carregamento da PLP (`PLPSkeleton.tsx`) para feedback visual durante carregamento
- Novo styleguide de e-commerce com arquivo de estilo dedicado (`src/styles/ecommerce/styleguide.css`) e configuração (`src/features/ecommerce/config/styleguide.ts`)

### Changed
- Refatoração ampla da experiência e-commerce em layout, PLP, carrinho, checkout, header, dropdowns e PDP para melhorar consistência visual e fluxo de navegação
- Ajustes na integração de dados da PLP (`plp.ts`, `plpDataSource.ts`, `vtexPlpBridge.ts`, `useProducts.ts`) e evolução das regras de gatekeeper
- Tema CSS renomeado de `theme-prezunic.css` para `theme-classic.css`, com atualização da base de estilos e documentação associada
- Script de lint atualizado para `eslint src` em `package.json`

### Technical
- Grande atualização de estilos do e-commerce (botões, drawer, checkout, cart, header, dropdown, PLP/PDP, variáveis e seções)
- Atualização de lockfile e configuração de ambiente Yarn para suportar o novo conjunto de dependências/execução


## [2.6.0] - 2025-08-17

### Added
- Nova galeria de apps na home com cards estáticos e imagem de preview no topo
- Paleta pastel e chips suaves para melhor legibilidade
- Documentação por app: `docs/apps/{cv,motd,ecommerce}.md` e índice `docs/apps/README.md`

### Changed
- Design dos cards: bordas finas, sombra sutil, tipografia mais leve e espaçamento maior
- Card inteiro clicável (removido botão CTA) e textos sem sublinhado
- Hover refinado (sem deslocamento de padding, sombra mais próxima e sem “bordinha” no hover)
- README principal simplificado com foco em quick start e links

### Technical
- Script de geração de previews em ESM com flags cross‑platform (`scripts/generate-previews.mjs`)
- Ajustes de CSS em `src/styles/gallery.css` e markup em `src/app/page.tsx`


## [2.6.1] - 2025-08-18

### Added
- Script de exportação standalone por app com geração de ZIP: `scripts/export-app-graph.mjs`
- Comando simplificado `export.mjs` para exportar todos ou apps específicos rapidamente

### Changed
- Export agora limpa versões anteriores automaticamente antes de gerar nova exportação
- Layout de exportação: garante cópia de `tsconfig.json`, `globals.css` e diretórios de estilos essenciais

### Fixed
- Corrigido problema de resolução de alias `@/` em projetos exportados (fallback para caminhos relativos quando necessário)
- Garantido que arquivos CSS referenciados por `@import` sejam incluídos na exportação

### Notes
- Gerados arquivos ZIP na pasta `exports/` e adicionadas entradas no `.gitignore` para evitar commitar exports
- Novos scripts/aliases e README e utilitários criados: `export.mjs` para comando único



## [2.5.0] - 2025-08-17

### Added
- Documentação funcional do E-commerce em `src/features/ecommerce/docs` (overview, operação, implementação, referências, receitas, troubleshooting, roadmap, checklists)
- Script `docs:ecom` para concatenar documentação em um único arquivo (`scripts/concat-ecom-docs.mjs`)

### Changed
- ProductCard: CTA estável e sem utilitários Tailwind para evitar hydration mismatch
- PriceBlock: padronização de moeda com `formatBRL`
- Flags: endurecidas com parser de booleano e desativação de demos por padrão em produção

### Technical
- Build validado (Next 15 App Router) e lint limpo
- Arquivo consolidado de docs gerado em `src/features/ecommerce/docs/Ecom-Consolidado.md`

## [2.4.0] - 2025-08-13

### Added
- **Nova rota e-commerce completa** `/e-commerce` com arquitetura atômica
- **Sistema de carrinho funcional** com add/remove/increment/decrement e cálculo de totais
- **Modal de regionalização** com seleção de entrega/retirada e verificação de CEP
- **Dropdowns navegacionais** para Departamentos e Serviços com estrutura real
- **Feature flags** centralizadas para controle granular de funcionalidades
- **Tipagem robusta de produtos** baseada em estrutura VTEX-like
- **Design system tokenizado** com tema claro e mobile-first
- **Componentes atômicos reutilizáveis** (atoms, molecules, organisms)

### Technical
- Implementação completa com Next.js 15 App Router
- Estado global com Context API (CartContext + UIContext)
- Mapeamento de produtos com normalização para UI
- Drawer lateral para carrinho com overlay
- Sistema de imagens otimizado com next/image
- CSS modular com tokens de design consistentes
- Validação completa de build e TypeScript

## [2.3.5] - 2025-08-01

### Fixed
- fix de emissao de url

## [2.3.4] - 2025-08-01

### Fixed
- Corrigido encoding de URL para preservar quebras de linha em templates de PR
- Templates agora mantêm formatação markdown correta nas URLs do GitHub
- Melhorada função de processamento de templates para evitar perda de quebras de linha

## [2.3.3] - 2025-08-01

### Fixed
- fix 4 do link de pr
- arrumando o link de criação de pr

## [2.3.2] - 2025-08-01

### Fixed
- hotfix de fluxo
- correcao de fluxo de automacao 3

## [2.3.1] - 2025-08-01

### Fixed
- hotfix de fluxo

## [2.3.0] - 2025-07-31

### Added
- Sistema completo de automação Git Flow modular
- Updated changelog notations

## [2.2.0] - 2025-07-31

### Added
- Sistema completo de automação Git Flow modular
- Template engine inteligente com 5 templates de PR
- Sistema de rollback automático com cleanup de arquivos temporários
- Integração multiplataforma (Windows/Linux/macOS)
- Detecção automática de contexto e branch naming
- Limpeza automática de arquivos customizados ao cancelar operação

### Fixed
- Correção de duplicação de tags no processo de versionamento
- Melhoria no sistema de push com verificação de tags remotas
- Correção de escopo de variáveis no sistema de templates

## [2.1.0] - 2025-07-31

### Added
- Criação automática de templates de GitHub PR

## [2.0.5] - 2025-07-31

### Changed
- Atualizada documentação do script de automação
- Corrigida formatação dos emojis no script de automação git flow v2

## [2.0.4] - 2025-07-31

### Changed
- Melhorada automação git flow com links inteligentes de PR
- Criação de PR com URLs pré-preenchidas
- Removidos arquivos de template locais para melhor experiência

## [2.0.3] - 2025-07-31

### Changed
- Melhorada automação git flow com links inteligentes de PR
- Criação de PR com URLs pré-preenchidas e remoção de arquivos locais

## [2.0.2] - 2025-07-31

### Added
- Documentação completa do sistema de automação git
- Algoritmo inteligente de nomenclatura de branches

## [2.0.1] - 2025-07-31

### Added
- Documentação completa do sistema de automação git
- Algoritmo inteligente de nomenclatura de branches

## [2.0.0] - 2025-07-31

### Changed
- Refatoração do sistema de tradução com arquitetura aprimorada
- Configuração centralizada, hooks modulares e tratamento de erros
- Documentação abrangente do sistema

## [1.6.2] - 2025-07-31

### Changed
- Refatoração do sistema de tradução para eliminar duplicação
- Remoção de 6 arquivos duplicados
- Criação de 4 módulos otimizados com configuração centralizada

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

### Fixed
- Corrigido consumo duplo de token na tradução IA
- Removidos todos os `console.log` de debug do projeto
- Build validado e fluxo de tradução revisado

## [1.5.2] - 2025-07-08

### Fixed
- Corrigido bug que fazia duas requisições de tradução IA ao trocar de idioma rapidamente
- Tradução só é requisitada uma vez por troca de idioma

## [1.5.1] - 2025-07-03

### Changed
- Favicon personalizado com as iniciais "SN" e cores do tema
- Inclusão de favicon em SVG e fallback para .ico

## [1.5.0] - 2025-07-03

### Added
- SEO avançado: título, descrição, palavras-chave, Open Graph, Twitter Card
- Schema.org JSON-LD para dados estruturados
- `robots.txt` e sitemap.xml para indexação por motores de busca
- Sitemap dinâmico com rotas estáticas e dinâmicas
- Palavras-chave otimizadas para "Web Solutions Architect", VTEX, VTEX IO

### Changed
- Atualização dos links sociais (LinkedIn, GitHub) e domínio real
- Melhoria na descrição dos serviços e diferenciais no SEO

## [1.4.1] - 2025-07-03

### Added
- Botão "Limpar Cache" sempre visível quando houver traduções
- Feedback visual temporário ao limpar cache

### Changed
- Lógica do modal de confirmação: só aparece no modo IA
- Reset global de traduções ao limpar cache
- Melhor UX para alternância entre modos e idiomas

### Fixed
- Previne traduções mock sobrescrevam permanentemente tradução IA
- Correção de exibição do botão de limpar cache

## [1.4.0] - 2025-07-03

### Changed
- Refatoração completa da estrutura de componentes
- Componentização dos subcomponentes (Navbar, Header, Footer, etc.)
- Padronização visual e responsiva do header/navbar
- Centralização e internacionalização via `labels.ts`
- Garantia de tradução IA para todos os idiomas suportados

### Fixed
- Correção do fluxo de tradução IA para códigos esperados pela API
- Tradução dinâmica dos textos fixos da interface
- Ajustes de tipagem para compatibilidade com TypeScript

## [1.3.2] - 2025-07-03

### Fixed
- Modal de confirmação só abre por ação do usuário
- Feedback visual claro para token inválido
- Modal de política de privacidade segue o tema
- Isolamento total do fluxo dos modais
- Removidos efeitos colaterais de abertura automática

### Changed
- Refinamentos de UX e acessibilidade dos modais
- Padronização do controle de estado dos modais

## [1.3.1] - 2025-07-03

### Added
- Togglers para todas as seções principais com botões animados
- Botão "toggle all" no header para expandir/recolher todas as seções
- Módulos CSS para cada componente
- Toggles responsivos e acessíveis com navegação por teclado
- Ícones SVG customizados para togglers

### Changed
- Aumentado o tamanho das setas dos togglers em 2px
- Animação de expansão/recolhimento mais lenta e suave (1.25s)
- Consistência visual: todas as setas usam o mesmo estilo minimalista

## [1.3.0] - 2025-07-03

### Changed
- Internacionalização completa de todos os textos fixos
- Persistência do idioma selecionado via localStorage
- Exibição dos nomes dos idiomas por extenso
- Correção do fluxo de cache/localStorage
- Modal de confirmação só aparece quando necessário
- Ajustes de tipagem e normalização dos códigos de idioma

## [1.2.0] - 2025-07-02

### Added
- Cache local de traduções por idioma/texto
- Botão "Limpar cache de traduções" na Navbar
- Estrutura de README atualizada
- Documentação detalhada no `DOCUMENTATION.md`

### Changed
- StatusBar sempre visível com drag & drop
- Layout e espaçamento refinados
- Modal de confirmação só aparece quando necessário
- Código limpo: remoção de comentários desnecessários

### Fixed
- Problemas de proporção e alinhamento entre cards/seções
- Problemas de StatusBar ao trocar de idioma
- Pequenos bugs de UX e warnings/lint

## [1.1.1] - 2025-07-02

### Changed
- Modal de confirmação segue o tema global (tokens CSS)
- StatusBar com drag & drop suave e preciso
- Correção de hooks e return condicional
- Uso consistente de tokens nos botões, overlays e modais
- Refinamentos de responsividade e acessibilidade

## [1.1.0] - 2025-07-01

### Added
- Documentação detalhada para todos os componentes
- Índice interativo `DOCUMENTATION.md`
- Links de navegação "Voltar ao Índice"
- Estrutura compatível com Obsidian, VS Code e leitores Markdown
- Padronização de navegação e organização

### Changed
- README principal atualizado para destacar documentação técnica

## [1.0.0] - 2025-07-01

### Added
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
