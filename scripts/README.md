# 🚀 Scripts de Automação Git Flow

Este diretório contém scripts para automatizar completamente o fluxo de desenvolvimento Git, desde commits convencionais até geração de releases.

## 📋 Scripts Disponíveis

### 🎯 Script Principal - Automação Completa

#### Linux/Mac
```bash
npm run git:flow
# ou
bash ./scripts/automate-git-flow.sh
```

#### Windows
```bash
npm run git:flow:win
# ou
powershell -ExecutionPolicy Bypass -File ./scripts/automate-git-flow.ps1
```

**O que faz:**
1. ✅ Verifica estado do repositório
2. ✅ Guided selection de tipo de commit (conventional commits)
3. ✅ Coleta informações do commit (descrição, escopo, breaking changes)
4. ✅ Calcula versionamento automático (semver)
5. ✅ Realiza commit conventional
6. ✅ Atualiza versão no package.json
7. ✅ Gera/atualiza CHANGELOG.md
8. ✅ Cria tag de release
9. ✅ Faz push do código e tags
10. ✅ Gera template de PR preenchido

### 📋 Scripts Individuais

#### Gerador de Changelog
```bash
npm run changelog
# ou
bash ./scripts/generate-changelog.sh "1.0.0" "feat" "nova funcionalidade" "false"
```

#### Gerador de Dados de PR
```bash
npm run pr:data
# ou
bash ./scripts/generate-pr-data.sh "feat" "nova funcionalidade" "1.0.0" "false"
```

## 🎯 Conventional Commits Suportados

O script suporta todos os tipos padrão de conventional commits:

| Tipo | Emoji | Descrição | Versionamento |
|------|-------|-----------|---------------|
| `feat` | ✨ | Nova funcionalidade | minor/major* |
| `fix` | 🐛 | Correção de bug | patch/major* |
| `docs` | 📝 | Documentação | patch |
| `style` | 💄 | Formatação/estilo | patch |
| `refactor` | ♻️ | Refatoração | patch/major* |
| `perf` | ⚡ | Performance | patch/major* |
| `test` | 🧪 | Testes | patch |
| `chore` | 🔧 | Build/ferramentas | patch |
| `security` | 🔒 | Segurança | patch/major* |
| `i18n` | 🌐 | Internacionalização | minor/major* |

*\* major se for breaking change*

## 🔄 Versionamento Automático (SemVer)

O versionamento segue [Semantic Versioning](https://semver.org/):

- **MAJOR** (X.0.0): Breaking changes
- **MINOR** (X.Y.0): Novas funcionalidades (compatíveis)
- **PATCH** (X.Y.Z): Bug fixes e melhorias

### Regras de Versionamento
- `feat` → **minor** (ou major se breaking)
- `fix`, `security`, `perf` → **patch** (ou major se breaking)
- `docs`, `style`, `refactor`, `test`, `chore` → **patch** (ou major se breaking)
- Qualquer tipo com `!` ou `BREAKING CHANGE:` → **major**

## 📋 Estrutura do CHANGELOG

O CHANGELOG é gerado automaticamente seguindo [Keep a Changelog](https://keepachangelog.com/):

```markdown
# Changelog

## [Unreleased]

## [1.2.0] - 2025-01-31

### ✨ Adicionado
- ✨ Nova funcionalidade de tradução automática

### 🐛 Corrigido
- 🐛 Correção no sistema de tokens

### 💥 BREAKING CHANGES
- Esta versão contém mudanças que quebram compatibilidade
```

## 🎨 Template de PR Inteligente

O script gera automaticamente um template de PR preenchido com:

- ✅ Tipo de mudança detectado automaticamente
- ✅ Componentes afetados (baseado nos arquivos modificados)
- ✅ Instruções de teste específicas
- ✅ Changelog da versão
- ✅ Checklist de verificação
- ✅ Dados técnicos (versão, commits, etc.)

### Detecção Automática de Componentes

O script analisa os arquivos modificados e detecta automaticamente quais componentes foram afetados:

| Padrão de Arquivo | Componente Detectado |
|-------------------|---------------------|
| `src/lib/translation*`, `src/app/api/translate*` | 🌍 Sistema de Tradução |
| `src/data/motd*`, `*MOTD*` | 🎭 MOTD |
| `src/lib/updateTokenRow*`, `*google*sheet*` | 📊 Google Sheets |
| `src/app/api/*auth*`, `*token*` | 🔐 Autenticação |
| `src/components*` | 🎨 Interface |
| `src/components/*cv*` | 📋 Componentes CV |
| `.env*`, `*config*` | 🛠️ Configurações |
| `docs/*`, `README*`, `DOCUMENTATION*` | 📚 Documentação |
| `*test*`, `*spec*` | 🧪 Testes |
| `package.json`, `webpack*`, `next.config*` | 🚀 Build |

## 🎯 Exemplos de Uso

### Cenário 1: Nova Funcionalidade
```bash
npm run git:flow

# Script pergunta:
# 1) Tipo: feat
# 2) Descrição: "adicionar suporte a tradução em tempo real"
# 3) Escopo: "translation"
# 4) Breaking change: N
# 5) Descrição detalhada: "Implementa WebSocket para tradução instantânea"

# Resultado:
# - Commit: "feat(translation): adicionar suporte a tradução em tempo real"
# - Versão: 1.5.0 → 1.6.0 (minor bump)
# - Tag: v1.6.0
# - CHANGELOG atualizado
# - Template de PR gerado
```

### Cenário 2: Correção de Bug
```bash
npm run git:flow

# Script pergunta:
# 1) Tipo: fix
# 2) Descrição: "corrigir erro no sistema de tokens"
# 3) Escopo: "auth"
# 4) Breaking change: N

# Resultado:
# - Commit: "fix(auth): corrigir erro no sistema de tokens"
# - Versão: 1.6.0 → 1.6.1 (patch bump)
# - Tag: v1.6.1
```

### Cenário 3: Breaking Change
```bash
npm run git:flow

# Script pergunta:
# 1) Tipo: refactor
# 2) Descrição: "reestruturar API de autenticação"
# 3) Escopo: "api"
# 4) Breaking change: Y
# 5) Breaking description: "Mudança na estrutura de resposta da API"

# Resultado:
# - Commit: "refactor(api)!: reestruturar API de autenticação"
# - Versão: 1.6.1 → 2.0.0 (major bump)
# - Tag: v2.0.0
```

## 📂 Arquivos Gerados

O script gera os seguintes arquivos:

- `.pr-template-data.json` - Dados JSON para integração
- `.pr-template-filled.md` - Template de PR preenchido
- `CHANGELOG.md` - Changelog atualizado
- `package.json` - Versão atualizada

## 🔧 Configuração

### Permissões (Linux/Mac)
```bash
chmod +x ./scripts/*.sh
```

### PowerShell (Windows)
Se houver erro de política de execução:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## 🎯 Integração com CI/CD

Os scripts podem ser integrados em pipelines de CI/CD:

```yaml
# GitHub Actions exemplo
- name: Run automated git flow
  run: npm run git:flow
  
- name: Create Pull Request
  uses: peter-evans/create-pull-request@v4
  with:
    title: "Release v${{ env.NEW_VERSION }}"
    body-path: .pr-template-filled.md
```

## 🚨 Troubleshooting

### Problema: Script não executa
**Solução**: Verificar permissões e dependências
```bash
# Linux/Mac
chmod +x ./scripts/automate-git-flow.sh

# Windows
powershell -ExecutionPolicy Bypass -File ./scripts/automate-git-flow.ps1
```

### Problema: Erro de versionamento
**Solução**: Verificar se package.json tem versão válida
```bash
node -p "require('./package.json').version"
```

### Problema: Git não configurado
**Solução**: Configurar Git global
```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"
```

## 🤝 Contribuindo

Para melhorar os scripts:

1. Fork o repositório
2. Crie uma branch: `git checkout -b feature/melhorar-scripts`
3. Use o próprio script: `npm run git:flow`
4. Abra um PR usando o template gerado

## 📚 Referências

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [Keep a Changelog](https://keepachangelog.com/)
- [GitHub Pull Request Templates](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/creating-a-pull-request-template-for-your-repository)
