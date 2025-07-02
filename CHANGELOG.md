# Changelog

Todas as mudanças notáveis deste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/), e este projeto adota a [Semantic Versioning](https://semver.org/lang/pt-BR/).

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
