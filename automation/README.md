# 🚀 Git Flow Automation - Versão Modular

Sistema de automação completo para Git Flow com arquitetura modular exportável.

## 📁 Estrutura

```
automation/
├── git-flow.sh              # Script principal
├── modules/                 # Módulos especializados
│   ├── platform.sh         # Detecção de plataforma
│   ├── logger.sh           # Sistema de logging
│   ├── git-utils.sh        # Utilitários Git
│   ├── commit-builder.sh   # Construção de commits
│   ├── versioning.sh       # Versionamento semântico
│   ├── branch-manager.sh   # Gerenciamento de branches
│   ├── changelog.sh        # Geração de changelog
│   └── pr-generator.sh     # Geração de PRs
├── config/                 # Configurações
│   ├── commit-types.conf   # Tipos de commit personalizados
│   └── settings.conf       # Configurações gerais
└── README.md              # Esta documentação
```

## 🚀 Uso Rápido

```bash
# Tornar executável
chmod +x automation/git-flow.sh

# Executar automação
./automation/git-flow.sh
```

## ✨ Funcionalidades

### 🎯 Core Features
- **Commits Convencionais**: Interface interativa para conventional commits
- **Versionamento Semântico**: Cálculo automático baseado no tipo de commit
- **Gerenciamento de Branches**: Criação automática com nomes padronizados
- **Changelog Automático**: Geração e atualização automática
- **PR Pré-preenchido**: URLs do GitHub com templates completos
- **Multiplataforma**: Windows (Git Bash), Linux, macOS

### 🔧 Módulos Especializados
- **Platform**: Detecção automática do sistema operacional
- **Logger**: Sistema de logging colorido e estruturado
- **Git Utils**: Operações básicas e verificações do Git
- **Commit Builder**: Interface interativa para criação de commits
- **Versioning**: Versionamento semântico automatizado
- **Branch Manager**: Criação e navegação entre branches
- **Changelog**: Geração automática de changelog
- **PR Generator**: URLs pré-preenchidos para GitHub

## 🎨 Tipos de Commit Suportados

| Tipo | Emoji | Descrição | Versionamento |
|------|-------|-----------|---------------|
| `feat` | 🚀 | Nova funcionalidade | minor |
| `fix` | 🐛 | Correção de bug | patch |
| `docs` | 📚 | Documentação | patch |
| `style` | 💄 | Formatação/estilo | patch |
| `refactor` | ♻️ | Refatoração | patch |
| `perf` | ⚡ | Performance | patch |
| `test` | 🧪 | Testes | patch |
| `chore` | 🔧 | Build/ferramentas | patch |
| `security` | 🔒 | Segurança | patch |
| `i18n` | 🌐 | Internacionalização | patch |

## 🔄 Fluxo de Trabalho

1. **Verificação**: Validação do repositório e estado dos arquivos
2. **Commit**: Interface interativa para conventional commits
3. **Branch**: Criação automática ou seleção de branch existente
4. **Versionamento**: Cálculo automático baseado no semantic versioning
5. **Atualização**: package.json, tags e changelog
6. **Push**: Envio seguro com confirmação
7. **PR**: Geração de URL pré-preenchida para GitHub

## 💾 Exportação para Outros Projetos

Para usar em outro projeto:

```bash
# 1. Copiar a pasta automation
cp -r automation/ /caminho/para/novo/projeto/

# 2. Navegar para o novo projeto
cd /caminho/para/novo/projeto/

# 3. Tornar executável
chmod +x automation/git-flow.sh

# 4. Executar
./automation/git-flow.sh
```

## 📋 Requisitos e Dependências Completos

### 🔴 **OBRIGATÓRIOS** (Sem estes não funciona)

#### 1. **Git** 
```bash
# Verificar se está instalado
git --version

# Deve retornar algo como: git version 2.x.x
```

#### 2. **Bash**
- **Windows**: Git Bash (vem com Git for Windows)
- **Linux**: Bash nativo
- **macOS**: Bash nativo ou Zsh com compatibilidade

```bash
# Verificar se está disponível
bash --version

# Deve retornar: GNU bash, version 4.x ou superior
```

#### 3. **Repositório Git Inicializado**
```bash
# Verificar se está em um repo Git
git status

# Se não estiver, inicializar:
git init
git remote add origin https://github.com/usuario/repo.git
```

### 🟡 **RECOMENDADOS** (Para funcionalidade completa)

#### 1. **package.json** (Para versionamento automático)
```json
{
  "name": "meu-projeto",
  "version": "1.0.0",
  "scripts": {
    "gitflow": "bash ./automation/git-flow.sh"
  }
}
```

#### 2. **Node.js** (Para parsing avançado do package.json)
```bash
# Verificar se está instalado
node --version

# Se não tiver, funciona com fallback usando sed
```

#### 3. **Repositório GitHub** (Para URLs de PR pré-preenchidos)
```bash
# Verificar se o remote é GitHub
git remote -v

# Deve mostrar algo como:
# origin  https://github.com/usuario/repo.git
```

### 🟢 **OPCIONAIS** (Melhorias de qualidade de vida)

#### 1. **Yarn ou NPM** (Para comandos simplificados)
```bash
# Com yarn
yarn gitflow

# Com npm
npm run gitflow

# Sem package manager
./automation/git-flow.sh
```

#### 2. **Editor de Texto** (Para customizar configurações)
- VS Code, Vim, Nano, etc.
- Para editar `automation/config/*.conf`

## 🔧 Configuração Inicial Completa

### 1. **Setup Básico** (Projeto novo)
```bash
# 1. Criar diretório do projeto
mkdir meu-novo-projeto
cd meu-novo-projeto

# 2. Inicializar Git
git init
git remote add origin https://github.com/usuario/meu-repo.git

# 3. Criar package.json básico
echo '{
  "name": "meu-projeto",
  "version": "0.1.0",
  "scripts": {
    "gitflow": "bash ./automation/git-flow.sh"
  }
}' > package.json

# 4. Copiar automação
cp -r /path/to/automation/ .

# 5. Tornar executável
chmod +x automation/git-flow.sh

# 6. Testar
./automation/git-flow.sh
```

### 2. **Setup em Projeto Existente**
```bash
# 1. Navegar para o projeto
cd /path/to/existing/project

# 2. Verificar se é repositório Git
git status

# 3. Copiar automação
cp -r /path/to/automation/ .

# 4. Tornar executável
chmod +x automation/git-flow.sh

# 5. Adicionar script ao package.json (se existir)
# Editar manualmente ou usar:
npm pkg set scripts.gitflow="bash ./automation/git-flow.sh"

# 6. Testar
yarn gitflow  # ou ./automation/git-flow.sh
```

## 🚨 Troubleshooting

### **Erro: "bash: automation/git-flow.sh: Permission denied"**
```bash
chmod +x automation/git-flow.sh
```

### **Erro: "not a git repository"**
```bash
git init
git remote add origin https://github.com/usuario/repo.git
```

### **Erro: "node: command not found"** (Funciona mesmo assim)
```bash
# A automação funciona sem Node.js
# Usará sed como fallback para package.json
./automation/git-flow.sh
```

### **Warning: "package.json not found"**
```bash
# Criar um package.json básico
echo '{"name": "projeto", "version": "0.1.0"}' > package.json
```

### **No Windows: "bash: command not found"**
```bash
# Instalar Git for Windows (inclui Git Bash)
# https://git-scm.com/download/win

# Usar Git Bash terminal, não CMD/PowerShell
```

## 🎯 Exemplos de Uso

### Novo Feature
```bash
./automation/git-flow.sh
# Selecionar: feat
# Descrição: adicionar autenticação OAuth
# Resultado: feat: adicionar autenticação OAuth (minor bump)
```

### Correção de Bug
```bash
./automation/git-flow.sh
# Selecionar: fix
# Descrição: corrigir vazamento de memória
# Resultado: fix: corrigir vazamento de memória (patch bump)
```

### Breaking Change
```bash
./automation/git-flow.sh
# Selecionar: feat
# Breaking: yes
# Resultado: feat!: nova API v2 (major bump)
```

## 🔒 Segurança

- ✅ Confirmação antes do push
- ✅ Verificação de repositório Git
- ✅ Backup automático de arquivos críticos
- ✅ Validação de dados de entrada
- ✅ Rollback em caso de erro

## 🏆 Vantagens da Arquitetura Modular

### ✨ Modularidade
- Cada módulo tem responsabilidade única
- Fácil manutenção e extensão
- Reutilização entre projetos

### 🔧 Extensibilidade
- Novos módulos podem ser adicionados facilmente
- Configurações personalizáveis
- Hooks para customizações

### 📦 Portabilidade
- Totalmente autocontido
- Sem dependências externas obrigatórias
- Funciona em qualquer projeto Git

### 🎯 Testabilidade
- Módulos podem ser testados independentemente
- Funções isoladas e puras
- Debugging facilitado

## 🚀 Roadmap

- [ ] Configurações personalizáveis por projeto
- [ ] Integração com outros sistemas de versionamento
- [ ] Templates de commit customizáveis
- [ ] Hooks pré e pós execução
- [ ] Interface de linha de comando avançada
- [ ] Integração com CI/CD

## 📝 Licença

Este projeto é open source e está disponível sob a licença MIT.

---

**Happy Coding!** 🎉
