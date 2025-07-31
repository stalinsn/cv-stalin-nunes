# 🤝 Guia de Contribuição

Obrigado pelo seu interesse em contribuir com o projeto **CV Stalin Nunes**! 🎉

## 📋 Índice
- [Como Contribuir](#como-contribuir)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Padrões de Código](#padrões-de-código)
- [Processo de Pull Request](#processo-de-pull-request)
- [Reportando Bugs](#reportando-bugs)
- [Sugerindo Funcionalidades](#sugerindo-funcionalidades)

## 🚀 Como Contribuir

### 1. Fork o Repositório
```bash
# Clone seu fork
git clone https://github.com/SEU-USUARIO/cv-stalin-nunes.git
cd cv-stalin-nunes
```

### 2. Configure o Ambiente
```bash
# Instale as dependências
npm install

# Copie o arquivo de ambiente
cp .env.example .env.local

# Configure suas variáveis de ambiente
# Veja DOCUMENTATION.md para detalhes
```

### 3. Crie uma Branch
```bash
# Para nova funcionalidade
git checkout -b feature/nome-da-funcionalidade

# Para correção de bug
git checkout -b fix/descricao-do-bug

# Para documentação
git checkout -b docs/atualizacao-docs
```

## ⚙️ Configuração do Ambiente

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Conta OpenAI (para testes de tradução IA)
- Conta Google Cloud (para testes de Google Sheets)

### Variáveis de Ambiente Necessárias
Consulte o arquivo `DOCUMENTATION.md` para configuração completa das variáveis de ambiente.

### Rodando Localmente
```bash
# Modo desenvolvimento
npm run dev

# Build
npm run build

# Lint
npm run lint
```

## 📝 Padrões de Código

### Commits
Utilizamos [Conventional Commits](https://www.conventionalcommits.org/):

**🚀 RECOMENDADO: Use nosso script de automação!**
```bash
# Linux/Mac
npm run git:flow

# Windows
npm run git:flow:win
```

O script automatiza todo o fluxo: conventional commits, versionamento, changelog, tags e template de PR!

**Ou manualmente:**
```bash
# Exemplos:
feat: adicionar nova funcionalidade de tradução
fix: corrigir bug no sistema de tokens
docs: atualizar documentação da API
style: melhorar responsividade mobile
refactor: otimizar componente de tradução
test: adicionar testes para MOTD
chore: atualizar dependências
```

### Código
- **TypeScript**: Sempre tipar adequadamente
- **React**: Usar hooks funcionais
- **Tailwind CSS**: Para estilização
- **Prettier**: Formatação automática
- **ESLint**: Linting de código

### Estrutura de Arquivos
```
src/
├── app/          # App Router do Next.js
├── components/   # Componentes React
├── data/         # Dados estáticos
├── hooks/        # Custom hooks
├── lib/          # Funções utilitárias
└── types/        # Definições TypeScript
```

## 🔄 Processo de Pull Request

### 🚀 Fluxo Automatizado (Recomendado)
```bash
# 1. Faça suas mudanças
# 2. Execute o script de automação
npm run git:flow          # Linux/Mac
npm run git:flow:win      # Windows

# 3. O script fará automaticamente:
#    ✅ Commit conventional
#    ✅ Versionamento semântico
#    ✅ Atualização do CHANGELOG
#    ✅ Criação de tag
#    ✅ Push para repositório
#    ✅ Template de PR preenchido

# 4. Acesse GitHub e crie o PR
#    (template será carregado automaticamente)
```

### 📋 Fluxo Manual (Alternativo) Antes de Submeter
- [ ] ✅ Código testado localmente
- [ ] 🧪 Testes passando (se aplicável)
- [ ] 📝 Documentação atualizada
- [ ] 🎯 Commit messages seguem padrão
- [ ] 🔍 Code review próprio realizado

### Template de PR
Use o template automático que será carregado, incluindo:
- Descrição clara das mudanças
- Tipo de mudança
- Componentes afetados
- Instruções de teste
- Screenshots (se aplicável)

### Revisão
- PRs serão revisados por mantenedores
- Feedback será dado via comentários
- Mudanças podem ser solicitadas
- Aprovação necessária antes do merge

## 🐛 Reportando Bugs

### Use o Template de Bug Report
Ao abrir uma issue de bug, use o template que incluirá:
- Descrição do problema
- Passos para reproduzir
- Comportamento esperado vs atual
- Ambiente (navegador, OS, etc.)
- Screenshots

### Informações Importantes
- Versão do navegador
- Sistema operacional
- Console errors (F12)
- Configuração de tradução usada

## ✨ Sugerindo Funcionalidades

### Use o Template de Feature Request
- Descrição clara da funcionalidade
- Problema que resolve
- Componentes afetados
- Prioridade
- Mockups (se aplicável)

## 🎯 Áreas de Contribuição

### 🌍 Tradução e Internacionalização
- Melhorar sistema de tradução
- Adicionar novos idiomas
- Otimizar performance de tradução

### 🎭 MOTD (Message of the Day)
- Adicionar novas frases motivacionais
- Melhorar algoritmo de seleção
- Implementar categorias temáticas

### 🔐 Sistema de Autenticação
- Melhorar segurança
- Adicionar novos métodos de auth
- Otimizar integração Google Sheets

### 🎨 Interface e UX
- Melhorar responsividade
- Adicionar animações
- Otimizar acessibilidade

### 📊 Analytics e Monitoramento
- Implementar métricas
- Melhorar logging
- Adicionar dashboards

## 🔒 Segurança

### Reportando Vulnerabilidades
- **NÃO** abra issues públicas para vulnerabilidades
- Use GitHub Security Advisories
- Forneça detalhes da vulnerabilidade
- Aguarde resposta antes de divulgação pública

### Boas Práticas
- Nunca commite credenciais
- Use variáveis de ambiente
- Valide inputs do usuário
- Implemente rate limiting

## 🆘 Precisa de Ajuda?

- 📖 Consulte a documentação em `docs/`
- 💬 Abra uma Discussion no GitHub
- 🐛 Reporte bugs via Issues
- ✨ Sugira funcionalidades via Issues

## 📄 Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a mesma licença do projeto.

---

**Obrigado por contribuir! 🚀**
