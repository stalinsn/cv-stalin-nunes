# Changelog

Todas as mudanças notáveis deste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/), e este projeto adota a [Semantic Versioning](https://semver.org/lang/pt-BR/).

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
