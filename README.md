# CV do Stalin Souza Nunes

Bem-vindo ao repositório do currículo interativo e multilíngue do Stalin Souza Nunes!

Welcome to this curriculum vitae project, feel free to translate from Portuguese to English as you wish :)

## 🚀 Visão Geral
Este projeto é um currículo digital moderno, responsivo e multilíngue, desenvolvido com **Next.js** e **TypeScript**. Ele permite alternar entre diferentes idiomas, exportar para PDF, imprimir, alternar temas (claro/escuro), e testar traduções automáticas via IA.

## 📚 Documentação Técnica
- Toda a documentação técnica do projeto está disponível em arquivos Markdown organizados por módulos.
- Use o arquivo [DOCUMENTATION.md](DOCUMENTATION.md) como índice interativo para navegar entre componentes, hooks, utilitários, dados e tipos.
- Todos os arquivos de documentação possuem links de retorno ao índice, facilitando a navegação em Obsidian, VS Code ou qualquer leitor Markdown.

## 🧩 Funcionalidades
- **Internacionalização (i18n):** Suporte a português, inglês, espanhol, francês e alemão.
- **Tradução com IA:** Integração com API de tradução, fallback para tradução mock.
- **Navbar Dinâmica:** Navegação responsiva e troca de idioma/tema.
- **Componentes Modulares:**
  - `Summary`, `Skills`, `Experience`, `Education`, `Languages`, `Footer`, `BackToTop`, `StatusBar`, `FallbackModal`.
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

## 🗂️ Estrutura do Projeto
```
cv-stalin-nunes/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── translate-test/
│   ├── components/
│   ├── data/
│   ├── hooks/
│   ├── lib/
│   ├── styles/
│   ├── types/
│   └── utils/
├── public/
├── .gitignore
├── package.json
├── tsconfig.json
├── CHANGELOG.md
├── DOCUMENTATION.md
└── README.md
```

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

## 📄 Licença
Este projeto é open-source, licenciado sob GPL v3. Qualquer modificação ou redistribuição deve manter o código aberto e sob a mesma licença.

---

> Feito com dedicação por Stalin Souza Nunes. Sinta-se à vontade para contribuir, sugerir melhorias ou usar como base para seu próprio currículo!
