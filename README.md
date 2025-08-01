# CV do Stalin Souza Nunes

Bem-vindo ao repositório do currículo interativo e multilíngue do Stalin Souza Nunes!

Welcome to this curriculum vitae project, feel free to translate from Portuguese to English as you wish :)

![image](https://github.com/user-attachments/assets/e7c34b5d-e57d-4940-8226-c52cec626c9c)


## 🚀 Visão Geral
Este projeto é um currículo digital moderno, responsivo e multilíngue, desenvolvido com **Next.js** e **TypeScript**. Ele permite alternar entre diferentes idiomas, exportar para PDF, imprimir, alternar temas (claro/escuro), e testar traduções automáticas via IA.

## 📚 Documentação Técnica
- Toda a documentação técnica detalhada está centralizada na pasta [`docs/`](docs/), organizada por domínio (componentes, hooks, dados, libs, estilos, tipos e utilitários).
- Use o índice principal [`docs/README_INDEX.md`](docs/README_INDEX.md) para navegar entre os módulos e arquivos de documentação.
- O arquivo [`DOCUMENTATION.md`](DOCUMENTATION.md) traz um resumo e instruções rápidas, mas a referência detalhada está em `docs/`.

## 🚀 Git Flow Automation
Este projeto inclui um **sistema completo de automação Git Flow** com detecção inteligente de branch e templates contextuais:

### ⚡ **Uso Rápido**
```bash
yarn gitflow
# ou
npm run gitflow
```

### 🧠 **Recursos Inteligentes**
- **Detecção automática** de códigos JIRA da branch (ex: `feature/ccl-3022`)
- **Templates contextuais** por tipo de projeto (GitHub, Enterprise, E-commerce, Minimal)  
- **Workspace automático** para e-commerce com URL construída automaticamente
- **Criação de branch** se estiver na main
- **Multiplataforma** (Windows, Linux, macOS)

### 📚 **Documentação da Automação**
- **[⚡ Guia Rápido](automation/QUICK-START.md)** - Start em 30 segundos
- **[📖 Documentação Completa](automation/INDEX.md)** - Todos os recursos
- **[🔧 Configuração](automation/config/pr-templates.conf)** - Personalização

---

## 🧩 Funcionalidades do CV
- **Internacionalização (i18n):** Suporte a português, inglês, espanhol, francês e alemão.
- **Tradução com IA:** Integração com API de tradução, fallback para tradução mock.
- **Navbar Dinâmica:** Navegação responsiva e troca de idioma/tema.
- **Componentes Modulares:**
  - `Summary`, `Skills`, `Experience`, `Education`, `Languages`, `Footer`, `BackToTop`, `StatusBar`, `FallbackModal`, `ConfirmTranslateModal`, `PrivacyModal`, `ThemeToggle`, `SectionCard` e subcomponentes organizados em pastas.
- **Hooks Customizados:**
  - `useI18n`, `useTheme`, `useLanguage`, `useTranslation`, `useAITranslation`.
- **Estilização:**
  - CSS modular, tokens de design (`src/styles/tokens`), responsividade e reset customizado.
- **Exportação:**
  - Exportação para PDF e impressão direta.
- **Testes de Tradução:**
  - Página `/translate-test` para testar traduções em tempo real.
- **Tipagem Forte:**
  - Tipos TypeScript para dados do currículo e tradução.
- **Estrutura de Dados Separada:**
  - Dados do CV organizados por idioma em `src/data`.

## 🆕 Novidades e Recursos Avançados
- **Cache local de traduções:** Traduções feitas por IA são salvas localmente, evitando custos extras e acelerando a navegação. O usuário pode limpar o cache manualmente pela Navbar.
- **Controle de tokens via Google Sheets:** Tradução IA só é liberada mediante token válido, com backend seguro e transparente usando Google Sheets. Tokens são validados, decrementados e bloqueios são aplicados conforme uso.
- **Transparência LGPD:** Barra fixa de aviso, modal de política de privacidade e respeito total à privacidade do usuário. Nenhum texto traduzido é armazenado, apenas hash/IP/user agent para controle de abuso.
- **StatusBar aprimorada:** Exibe curiosidades, feedback de uso, estatísticas de tradução e pode ser movida livremente na tela.
- **Botão “Limpar cache de traduções”** na Navbar, disponível sempre que houver traduções salvas localmente.

## 📦 Integração Google Sheets (Passo a Passo Resumido)
1. Crie um projeto no Google Cloud Platform e ative a API do Google Sheets.
2. Gere uma conta de serviço e baixe o JSON de credenciais.
3. Compartilhe sua planilha com o e-mail da conta de serviço.
4. Configure as variáveis `GOOGLE_SERVICE_ACCOUNT_JSON` e `GOOGLE_SHEET_ID` no `.env.local`.
5. Veja detalhes e exemplos em [`docs/`](docs/).

## 🗂️ Estrutura de Pastas (atualizada)
```
src/
  app/
    layout.tsx
    page.tsx
    api/
      translate/route.ts
      validate-token/route.ts
    translate-test/
  components/
    Navbar/
    StatusBar/
    ConfirmTranslateModal/
    PrivacyModal/
    FallbackModal/
    Footer/
    Header/
    LanguageSelector/
    SectionCard.tsx
    ...
  data/
    cv-ptbr.ts
    cv-en.ts
    cv-es.ts
    cv-fr.ts
    cv-de.ts
    labels.ts
    languages.ts
    ...
  hooks/
    useI18n.ts
    useTheme.ts
    useLanguage.ts
    useTranslation.ts
    useAITranslation.ts
  lib/
    exportPDF.ts
    exportPrint.ts
    translateAI.ts
    translateFree.ts
    translateMock.ts
    translateService.ts
    translation.ts
    ...
  styles/
    components/
    tokens/
    ...
  types/
    cv.ts
    translation.ts
  utils/
    PasswordModal.tsx
    translate.ts
    translationCache.ts
public/
  images/
docs/
  components/
  data/
  hooks/
  lib/
  styles/
  types/
  utils/
  README_INDEX.md
.env.local
```

## ℹ️ Mais detalhes
- Consulte o índice [`docs/README_INDEX.md`](docs/README_INDEX.md) para documentação técnica detalhada, exemplos de integração, troubleshooting e dicas de uso avançado.

## 🛠️ Tecnologias & Práticas
- **Next.js** (App Router)
- **TypeScript** (tipagem forte)
- **CSS Customizado** (modular, tokens, responsivo)
- **Hooks React** para lógica de UI e dados
- **API Routes** para tradução
- **Boas práticas de acessibilidade e UX**
- **Versionamento semântico** (veja o `CHANGELOG.md`)

## 📦 Instalação
```bash
git clone https://github.com/stalinsn/cv-stalin-nunes.git
cd cv-stalin-nunes
yarn install # ou npm install
```

## 🏃‍♂️ Rodando Localmente
```bash
yarn dev # ou npm run dev
```
Acesse: [http://localhost:3000](http://localhost:3000)

## 🔑 Variáveis de Ambiente
Crie um arquivo `.env.local` na raiz para chaves de API de tradução, se necessário:
```
TRANSLATE_API_KEY=sua-chave-aqui
```

## 💡 Extensões Recomendadas para VS Code
Para uma melhor experiência de desenvolvimento, utilize as seguintes extensões sugeridas (veja `.vscode/extensions.json`):

- [Catppuccin Perfect Icons](https://marketplace.visualstudio.com/items?itemName=thang-nm.catppuccin-perfect-icons) — Ícones coloridos e diferenciados para todos os tipos de arquivos
- [GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens) — Superpoderes para Git
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) — Formatação automática
- [Better Comments](https://marketplace.visualstudio.com/items?itemName=aaron-bond.better-comments) — Comentários coloridos
- [TODO Tree](https://marketplace.visualstudio.com/items?itemName=gruntfuggly.todo-tree) — Busca de TODOs
- [Auto Rename Tag](https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-rename-tag) — Renomeia tags em pares
- [Bracket Pair Colorizer 2](https://marketplace.visualstudio.com/items?itemName=coenraads.bracket-pair-colorizer-2) — Colore pares de parênteses
- [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker) — Corretor ortográfico
- [Import Cost](https://marketplace.visualstudio.com/items?itemName=wix.vscode-import-cost) — Mostra o tamanho dos imports
- [Indent Rainbow](https://marketplace.visualstudio.com/items?itemName=oderwat.indent-rainbow) — Indentações coloridas
- [Color Highlight](https://marketplace.visualstudio.com/items?itemName=naumovs.color-highlight) — Destaca cores no código
- [Intellicode](https://marketplace.visualstudio.com/items?itemName=VisualStudioExptTeam.vscodeintellicode) — Sugestões inteligentes
- [Error Lens](https://marketplace.visualstudio.com/items?itemName=usernamehw.errorlens) — Erros destacados em tempo real
- [Debugger for Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome) — Debug no navegador
- [Git Graph](https://marketplace.visualstudio.com/items?itemName=mhutchie.git-graph) — Visualização de histórico Git
- [Material Icon Theme](https://marketplace.visualstudio.com/items?itemName=PKief.material-icon-theme) — Alternativa de ícones

Para instalar todas de uma vez, basta abrir o VS Code e aceitar as recomendações ou instalar manualmente pelo Marketplace.

## 🤝 Contribuindo

Adoramos contribuições! Este projeto está aberto para melhorias e novas funcionalidades.

### 🚀 Como Contribuir
1. **Fork** este repositório
2. **Clone** seu fork localmente
3. **Configure** o ambiente (veja `CONTRIBUTING.md`)
4. **Crie** uma branch para sua feature/fix
5. **Faça** suas mudanças seguindo nossos padrões
6. **Teste** localmente
7. **Abra** um Pull Request

### 📋 Áreas para Contribuição
- 🌍 **Tradução**: Melhorar sistema de tradução ou adicionar idiomas
- 🎭 **MOTD**: Adicionar frases motivacionais ou melhorar algoritmo
- 🔐 **Segurança**: Otimizar autenticação e sistema de tokens
- 🎨 **UI/UX**: Melhorar interface e responsividade
- 📊 **Analytics**: Implementar métricas e monitoramento
- 📝 **Documentação**: Melhorar guias e documentação técnica

### 📚 Guias
- 📖 **[Guia de Contribuição](CONTRIBUTING.md)** - Instruções detalhadas
- 🐛 **[Report de Bugs](/.github/ISSUE_TEMPLATE/bug_report.md)** - Template para bugs
- ✨ **[Feature Request](/.github/ISSUE_TEMPLATE/feature_request.md)** - Template para funcionalidades
- 📝 **[Documentação](/.github/ISSUE_TEMPLATE/documentation.md)** - Template para docs

### 🎯 Commits e PRs
- Use [Conventional Commits](https://www.conventionalcommits.org/)
- Use nosso template de Pull Request
- Teste suas mudanças localmente
- Mantenha documentação atualizada

**Toda contribuição é bem-vinda! 🎉**

## 📄 Licença
Este projeto é open-source, licenciado sob GPL v3. Qualquer modificação ou redistribuição deve manter o código aberto e sob a mesma licença. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

> Feito com dedicação por Stalin Souza Nunes. Sinta-se à vontade para contribuir, sugerir melhorias ou usar como base para seu próprio currículo!
