#!/bin/bash

# =============================================================================
# 🚀 SCRIPT DE AUTOMAÇÃO COMPLETA - Git Flow
# =============================================================================
# Este script automatiza todo o fluxo de desenvolvimento:
# - Conventional commits
# - Versionamento automático
# - Changelog automático
# - Preenchimento de template de PR
# - Push para repositório
# =============================================================================

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Funções de output
log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }
log_step() { echo -e "${PURPLE}🚀 $1${NC}"; }

# Verificar se estamos em um repositório Git
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    log_error "Este diretório não é um repositório Git!"
    exit 1
fi

log_step "Iniciando fluxo de automação Git..."

# =============================================================================
# 1. VERIFICAR ESTADO DO REPOSITÓRIO
# =============================================================================
log_info "Verificando estado do repositório..."

if [[ -n $(git status --porcelain) ]]; then
    log_info "Arquivos modificados encontrados:"
    git status --short
else
    log_warning "Nenhum arquivo modificado encontrado!"
    read -p "Deseja continuar mesmo assim? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "Operação cancelada."
        exit 0
    fi
fi

# =============================================================================
# 2. SELEÇÃO DO TIPO DE COMMIT
# =============================================================================
log_step "Selecionando tipo de commit..."

echo -e "${CYAN}Selecione o tipo de commit:${NC}"
echo "1) 🆕 feat      - Nova funcionalidade"
echo "2) 🐛 fix       - Correção de bug"
echo "3) 📝 docs      - Documentação"
echo "4) 💄 style     - Formatação/estilo"
echo "5) ♻️  refactor - Refatoração"
echo "6) ⚡ perf      - Performance"
echo "7) 🧪 test      - Testes"
echo "8) 🔧 chore     - Tarefas de build/ferramentas"
echo "9) 🔒 security  - Segurança"
echo "10) 🌐 i18n     - Internacionalização"

read -p "Digite o número (1-10): " commit_type_num

case $commit_type_num in
    1) commit_type="feat" ;;
    2) commit_type="fix" ;;
    3) commit_type="docs" ;;
    4) commit_type="style" ;;
    5) commit_type="refactor" ;;
    6) commit_type="perf" ;;
    7) commit_type="test" ;;
    8) commit_type="chore" ;;
    9) commit_type="security" ;;
    10) commit_type="i18n" ;;
    *) log_error "Opção inválida!"; exit 1 ;;
esac

# =============================================================================
# 3. CAPTURAR INFORMAÇÕES DO COMMIT
# =============================================================================
log_step "Coletando informações do commit..."

read -p "📝 Descrição curta do commit: " commit_description
read -p "🎯 Escopo (opcional, ex: auth, ui, api): " commit_scope
read -p "💥 Breaking change? (y/N): " -n 1 -r breaking_change
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    breaking_change=true
    read -p "📋 Descrição do breaking change: " breaking_description
else
    breaking_change=false
fi

read -p "📋 Descrição detalhada (opcional): " commit_body
read -p "🔗 Issue relacionada (opcional, ex: #123): " related_issue

# =============================================================================
# 4. CONSTRUIR MENSAGEM DE COMMIT
# =============================================================================
log_step "Construindo mensagem de commit..."

# Título do commit
if [[ -n "$commit_scope" ]]; then
    commit_title="${commit_type}(${commit_scope}): ${commit_description}"
else
    commit_title="${commit_type}: ${commit_description}"
fi

# Breaking change no título
if [[ "$breaking_change" == true ]]; then
    commit_title="${commit_title}!"
fi

# Corpo do commit
commit_message="$commit_title"

if [[ -n "$commit_body" ]]; then
    commit_message="${commit_message}

${commit_body}"
fi

# Breaking change no corpo
if [[ "$breaking_change" == true && -n "$breaking_description" ]]; then
    commit_message="${commit_message}

BREAKING CHANGE: ${breaking_description}"
fi

# Issue relacionada
if [[ -n "$related_issue" ]]; then
    commit_message="${commit_message}

Closes ${related_issue}"
fi

log_info "Mensagem de commit construída:"
echo -e "${CYAN}${commit_message}${NC}"

# =============================================================================
# 5. DETERMINAR NOVO VERSIONAMENTO
# =============================================================================
log_step "Determinando versionamento..."

# Obter versão atual do package.json
current_version=$(node -p "require('./package.json').version" 2>/dev/null || echo "0.0.0")
log_info "Versão atual: $current_version"

# Determinar tipo de bump baseado no tipo de commit
case $commit_type in
    "feat")
        if [[ "$breaking_change" == true ]]; then
            version_bump="major"
        else
            version_bump="minor"
        fi
        ;;
    "fix"|"security"|"perf")
        if [[ "$breaking_change" == true ]]; then
            version_bump="major"
        else
            version_bump="patch"
        fi
        ;;
    *)
        if [[ "$breaking_change" == true ]]; then
            version_bump="major"
        else
            version_bump="patch"
        fi
        ;;
esac

log_info "Tipo de versionamento: $version_bump"

# Calcular nova versão
IFS='.' read -ra VERSION_PARTS <<< "$current_version"
major=${VERSION_PARTS[0]}
minor=${VERSION_PARTS[1]}
patch=${VERSION_PARTS[2]}

case $version_bump in
    "major")
        major=$((major + 1))
        minor=0
        patch=0
        ;;
    "minor")
        minor=$((minor + 1))
        patch=0
        ;;
    "patch")
        patch=$((patch + 1))
        ;;
esac

new_version="${major}.${minor}.${patch}"
log_success "Nova versão: $new_version"

# =============================================================================
# 6. CONFIRMAÇÃO ANTES DE PROSSEGUIR
# =============================================================================
echo -e "${YELLOW}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}📋 RESUMO DAS OPERAÇÕES${NC}"
echo -e "${YELLOW}═══════════════════════════════════════════════════════════════${NC}"
echo -e "🏷️  Versão: ${GREEN}${current_version} → ${new_version}${NC}"
echo -e "📝 Commit: ${CYAN}${commit_title}${NC}"
echo -e "🔄 Tipo: ${PURPLE}${version_bump}${NC}"
echo -e "💥 Breaking: ${RED}${breaking_change}${NC}"
echo -e "${YELLOW}═══════════════════════════════════════════════════════════════${NC}"

read -p "🚀 Continuar com estas operações? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    log_info "Operação cancelada."
    exit 0
fi

# =============================================================================
# 7. EXECUTAR OPERAÇÕES
# =============================================================================

# Adicionar arquivos
log_step "Adicionando arquivos..."
git add .
log_success "Arquivos adicionados"

# Commit
log_step "Realizando commit..."
git commit -m "$commit_message"
log_success "Commit realizado"

# Atualizar versão no package.json
log_step "Atualizando versão no package.json..."
npm version $new_version --no-git-tag-version
log_success "Versão atualizada para $new_version"

# Gerar/Atualizar CHANGELOG
log_step "Atualizando CHANGELOG..."
./scripts/generate-changelog.sh "$new_version" "$commit_type" "$commit_description" "$breaking_change"
log_success "CHANGELOG atualizado"

# Commit da versão e changelog
log_step "Commitando versão e changelog..."
git add package.json CHANGELOG.md
git commit -m "chore: bump version to $new_version and update changelog"
log_success "Versão e changelog commitados"

# Criar tag
log_step "Criando tag..."
git tag -a "v$new_version" -m "Release v$new_version"
log_success "Tag v$new_version criada"

# Push
log_step "Realizando push..."
current_branch=$(git branch --show-current)
git push origin $current_branch
git push origin "v$new_version"
log_success "Push realizado para branch $current_branch e tag v$new_version"

# Gerar dados para template de PR
log_step "Gerando dados para template de PR..."
./scripts/generate-pr-data.sh "$commit_type" "$commit_description" "$new_version" "$breaking_change"
log_success "Dados do PR gerados"

# =============================================================================
# 8. FINALIZAÇÃO
# =============================================================================
echo -e "${GREEN}🎉 FLUXO COMPLETO EXECUTADO COM SUCESSO! 🎉${NC}"
echo -e "${CYAN}📋 O que foi feito:${NC}"
echo -e "  ✅ Commit conventional realizado"
echo -e "  ✅ Versão atualizada para ${GREEN}$new_version${NC}"
echo -e "  ✅ CHANGELOG atualizado"
echo -e "  ✅ Tag criada e enviada"
echo -e "  ✅ Push realizado"
echo -e "  ✅ Dados para PR preparados"
echo ""
echo -e "${YELLOW}🚀 Próximos passos:${NC}"
echo -e "  1. Acesse GitHub e crie o Pull Request"
echo -e "  2. O template será preenchido automaticamente"
echo -e "  3. Revise e submeta o PR"
echo ""
echo -e "${BLUE}🔗 Links úteis:${NC}"
echo -e "  📊 Changelog: ./CHANGELOG.md"
echo -e "  📦 Package: ./package.json (v$new_version)"
echo -e "  🏷️  Tag: v$new_version"
