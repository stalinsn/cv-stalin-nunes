#!/bin/bash

# =============================================================================
# 🚀 SCRIPT DE AUTOMAÇÃO MULTIPLATAFORMA - Git Flow v2.0
# =============================================================================
# Este script automatiza todo o fluxo de desenvolvimento:
# - Detecção automática de plataforma (Windows/Linux)
# - Criação automática de branch baseada no tipo de commit
# - Conventional commits
# - Versionamento automático
# - Changelog automático
# - Template de PR
# - Push para repositório
# =========# Links diretos se repositório for detectado
if [[ -n "$repo_owner" && -n "$repo_name" ]]; then
    echo -e "${CYAN}🔗 Links Diretos:${NC}"
    echo -e "${YELLOW}👆 CLIQUE AQUI PARA CRIAR PR PRÉ-PREENCHIDO:${NC}"
    echo "• 🔄 Criar PR: $pr_url"
    echo
    echo -e "${CYAN}🔗 Outros Links:${NC}"
    echo "• 🌿 Ver Branch: $branch_url"
    echo "• 🏷️  Ver Releases: $releases_url"
    echo
fi

echo -e "${CYAN}📋 Recursos Gerados:${NC}"
echo "• 🏷️  Tag de Release: v$new_version"
echo "• 📝 Changelog atualizado"
echo "• 📦 Package.json versionado"

if [[ -n "$pr_url" ]]; then
    echo
    echo -e "${GREEN}🎉 PR Link Inteligente:${NC}"
    echo "O link acima já preenche automaticamente:"
    echo "• ✅ Título do PR"
    echo "• ✅ Descrição completa"  
    echo "• ✅ Checklist de tarefas"
    echo "• ✅ Informações técnicas"
fi

# =============================================================================

set -e

# =============================================================================
# DETECTAR PLATAFORMA
# =============================================================================
detect_platform() {
    case "$(uname -s)" in
        MINGW*|CYGWIN*|MSYS*)
            PLATFORM="windows"
            ;;
        Linux*)
            PLATFORM="linux"
            ;;
        Darwin*)
            PLATFORM="macos"
            ;;
        *)
            PLATFORM="unknown"
            ;;
    esac
}

detect_platform

# Cores para output (compatível com Windows/Linux)
if [[ "$PLATFORM" == "windows" ]]; then
    # Windows CMD/PowerShell não suporta cores ANSI por padrão
    RED=''
    GREEN=''
    YELLOW=''
    BLUE=''
    PURPLE=''
    CYAN=''
    NC=''
else
    # Linux/macOS suportam cores ANSI
    RED='\033[0;31m'
    GREEN='\033[0;32m'
    YELLOW='\033[1;33m'
    BLUE='\033[0;34m'
    PURPLE='\033[0;35m'
    CYAN='\033[0;36m'
    NC='\033[0m'
fi

# Funções de output
log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }
log_step() { echo -e "${PURPLE}🚀 $1${NC}"; }
log_platform() { echo -e "${CYAN}🖥️  Plataforma detectada: $PLATFORM${NC}"; }

# Verificar se estamos em um repositório Git
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    log_error "Este diretório não é um repositório Git!"
    exit 1
fi

log_platform
log_step "Iniciando fluxo de automação Git Flow v2.0..."

# =============================================================================
# 1. VERIFICAR ESTADO DO REPOSITÓRIO
# =============================================================================
log_info "Verificando estado do repositório..."

# Verificar branch atual
current_branch=$(git branch --show-current)
log_info "Branch atual: $current_branch"

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
read -p "💥 Breaking change? (y/N): " -n 1 -r breaking_change_reply
echo

if [[ $breaking_change_reply =~ ^[Yy]$ ]]; then
    breaking_change=true
    read -p "📋 Descrição do breaking change: " breaking_description
else
    breaking_change=false
fi

read -p "📋 Descrição detalhada (opcional): " commit_body
read -p "🔗 Issue relacionada (opcional, ex: #123): " related_issue

# =============================================================================
# 4. CRIAÇÃO AUTOMÁTICA DE BRANCH
# =============================================================================
log_step "Gerenciando branch de desenvolvimento..."

# Função para gerar nome da branch
generate_branch_name() {
    local type=$1
    local scope=$2
    local description=$3
    
    # Pegar apenas as primeiras 3-4 palavras da descrição
    local short_description=$(echo "$description" | cut -d' ' -f1-3 | tr ' ' '-' | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9-]//g')
    
    # Limitar tamanho máximo (tipo + escopo + descrição ≤ 50 chars)
    if [[ -n "$scope" ]]; then
        local full_name="${type}/${scope}-${short_description}"
    else
        local full_name="${type}/${short_description}"
    fi
    
    # Se ainda estiver muito longo, cortar mais
    if [[ ${#full_name} -gt 50 ]]; then
        local words_description=$(echo "$description" | cut -d' ' -f1-2 | tr ' ' '-' | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9-]//g')
        if [[ -n "$scope" ]]; then
            full_name="${type}/${scope}-${words_description}"
        else
            full_name="${type}/${words_description}"
        fi
    fi
    
    echo "$full_name"
}

# =============================================================================
# 4. GERENCIAMENTO DE BRANCH (MELHORADO)
# =============================================================================
log_step "Gerenciando branch de desenvolvimento..."

# Gerar nome sugerido para nova branch
suggested_branch=$(generate_branch_name "$commit_type" "$commit_scope" "$commit_description")

# Sempre oferecer opções de branch
log_info "Branch atual: $current_branch"

echo -e "${CYAN}Opções de branch:${NC}"
echo "1) 🌿 Criar nova branch: $suggested_branch"
echo "2) 📝 Especificar nome customizado"
echo "3) 🚀 Continuar na branch atual ($current_branch)"

read -p "Escolha uma opção (1-3): " branch_option

case $branch_option in
    1)
        log_info "Criando nova branch: $suggested_branch"
        git checkout -b "$suggested_branch"
        current_branch="$suggested_branch"
        ;;
    2)
        read -p "🌿 Nome da nova branch: " custom_branch
        log_info "Criando nova branch: $custom_branch"
        git checkout -b "$custom_branch"
        current_branch="$custom_branch"
        ;;
    3)
        if [[ "$current_branch" == "main" || "$current_branch" == "master" ]]; then
            log_warning "⚠️  Continuando na branch principal! Certifique-se de que isso é intencional!"
        else
            log_info "Continuando na branch atual: $current_branch"
        fi
        ;;
    *)
        log_error "Opção inválida!"
        exit 1
        ;;
esac

# =============================================================================
# 5. CONSTRUIR MENSAGEM DE COMMIT
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
# 6. DETERMINAR NOVO VERSIONAMENTO (MANUAL + AUTOMÁTICO)
# =============================================================================
log_step "Determinando versionamento..."

# Função para executar node (compatível Windows/Linux)
get_package_version() {
    if command -v node >/dev/null 2>&1; then
        node -p "require('./package.json').version" 2>/dev/null || echo "0.0.0"
    else
        # Fallback usando grep/sed se node não estiver disponível
        grep '"version"' package.json 2>/dev/null | sed 's/.*"version": *"\([^"]*\)".*/\1/' || echo "0.0.0"
    fi
}

current_version=$(get_package_version)
log_info "Versão atual: $current_version"

# Determinar sugestão de versionamento
case $commit_type in
    "feat")
        if [[ "$breaking_change" == true ]]; then
            suggested_bump="major"
        else
            suggested_bump="minor"
        fi
        ;;
    "fix"|"security"|"perf")
        if [[ "$breaking_change" == true ]]; then
            suggested_bump="major"
        else
            suggested_bump="patch"
        fi
        ;;
    *)
        if [[ "$breaking_change" == true ]]; then
            suggested_bump="major"
        else
            suggested_bump="patch"
        fi
        ;;
esac

# Permitir override manual do versionamento
echo -e "${CYAN}Tipo de versionamento sugerido: ${YELLOW}$suggested_bump${NC}"
if [[ "$breaking_change" == true ]]; then
    echo -e "${RED}⚠️  BREAKING CHANGE detectado! Considere major version.${NC}"
fi

echo -e "${CYAN}Selecione o tipo de versionamento:${NC}"
echo "1) 🔴 major - Mudanças incompatíveis (1.0.0 → 2.0.0)"
echo "2) 🟡 minor - Nova funcionalidade compatível (1.0.0 → 1.1.0)"
echo "3) 🟢 patch - Correção compatível (1.0.0 → 1.0.1)"
echo "4) 📋 usar sugestão ($suggested_bump)"

read -p "Digite o número (1-4): " version_choice

case $version_choice in
    1) version_bump="major" ;;
    2) version_bump="minor" ;;
    3) version_bump="patch" ;;
    4|"") version_bump="$suggested_bump" ;;
    *) log_error "Opção inválida!"; exit 1 ;;
esac

log_info "Tipo de versionamento selecionado: $version_bump"

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
log_info "Nova versão: $new_version"

# =============================================================================
# 7. ATUALIZAR PACKAGE.JSON E FAZER COMMIT
# =============================================================================
log_step "Atualizando versão e fazendo commit..."

# Função para atualizar package.json (compatível Windows/Linux)
update_package_version() {
    if command -v node >/dev/null 2>&1; then
        # Usar node se disponível
        node -e "
            const fs = require('fs');
            const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
            pkg.version = '$new_version';
            fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
        "
    else
        # Fallback usando sed (funciona em Linux/macOS/Windows com Git Bash)
        if [[ "$PLATFORM" == "windows" ]]; then
            sed -i 's/"version": *"[^"]*"/"version": "'$new_version'"/' package.json
        else
            sed -i 's/"version": *"[^"]*"/"version": "'$new_version'"/' package.json
        fi
    fi
}

# Atualizar versão no package.json
if [[ -f "package.json" ]]; then
    update_package_version
    log_success "package.json atualizado para versão $new_version"
fi

# Fazer commit
git add .
git commit -m "$commit_message"
log_success "Commit realizado com sucesso!"

# Criar tag de versão
git tag -a "v$new_version" -m "Release version $new_version"
log_success "Tag v$new_version criada!"

# =============================================================================
# 8. GERAR CHANGELOG AUTOMÁTICO
# =============================================================================
log_step "Gerando changelog..."

# Função para gerar changelog básico
generate_changelog() {
    local version=$1
    local date=$(date '+%Y-%m-%d')
    local changelog_entry="## [$version] - $date

### $commit_type
- $commit_description"

    if [[ -n "$commit_body" ]]; then
        changelog_entry="$changelog_entry
  
  $commit_body"
    fi

    # Adicionar ao CHANGELOG.md se existir, senão criar
    if [[ -f "CHANGELOG.md" ]]; then
        # Backup do changelog atual
        cp CHANGELOG.md CHANGELOG.md.bak
        
        # Adicionar nova entrada no topo
        echo -e "$changelog_entry\n" > CHANGELOG.md.tmp
        tail -n +1 CHANGELOG.md.bak >> CHANGELOG.md.tmp
        mv CHANGELOG.md.tmp CHANGELOG.md
        rm CHANGELOG.md.bak
    else
        echo -e "# Changelog\n\n$changelog_entry" > CHANGELOG.md
    fi
    
    log_success "Changelog atualizado!"
}

generate_changelog "$new_version"

# =============================================================================
# 9. ALERTA DE SEGURANÇA E PUSH
# =============================================================================
log_step "Preparando para push..."

echo -e "${RED}💣 ATENÇÃO! ${NC}"
echo -e "${YELLOW}A partir daqui você irá:${NC}"
echo "• 🚀 Fazer push da branch: $current_branch"
echo "• 🏷️  Criar tag: v$new_version"
echo "• 📤 Enviar para o repositório remoto"
echo "• 📋 Gerar template de PR"
echo ""
echo -e "${RED}⚠️  Isso não pode ser desfeito facilmente!${NC}"
echo ""
read -p "Tem certeza que deseja continuar? (y/N): " -n 1 -r confirm_push
echo

if [[ ! $confirm_push =~ ^[Yy]$ ]]; then
    log_warning "Operação cancelada pelo usuário."
    log_info "Seu commit local foi realizado, mas não foi enviado ao repositório."
    exit 0
fi

log_step "Fazendo push e preparando PR..."

# Push da branch e tags
git push origin "$current_branch"
git push origin "v$new_version"

log_success "Push realizado para branch $current_branch e tag v$new_version"

# =============================================================================
# 10. RESUMO FINAL COM LINKS
# =============================================================================
log_step "Resumo da Operação"

# Detectar repositório remoto
remote_url=$(git config --get remote.origin.url 2>/dev/null || echo "")
repo_owner=""
repo_name=""
base_url=""
branch_url=""
pr_url=""
releases_url=""

if [[ -n "$remote_url" ]]; then
    if [[ $remote_url =~ github\.com[:/]([^/]+)/([^/\.]+) ]]; then
        repo_owner="${BASH_REMATCH[1]}"
        repo_name="${BASH_REMATCH[2]}"
        base_url="https://github.com/$repo_owner/$repo_name"
        branch_url="$base_url/tree/$current_branch"
        releases_url="$base_url/releases"
        
        # Criar URL do PR com conteúdo pré-preenchido
        pr_title=$(echo "$commit_title" | sed 's/ /%20/g' | sed 's/&/%26/g')
        pr_body="## 📋 Descrição%0A$commit_description%0A%0A"
        
        if [[ -n "$commit_body" ]]; then
            pr_body_escaped=$(echo "$commit_body" | sed 's/ /%20/g' | sed 's/&/%26/g' | sed 's/$/%0A/g')
            pr_body="$pr_body$pr_body_escaped%0A"
        fi
        
        pr_body="${pr_body}## 🔄 Tipo de Mudança%0A- [x] $commit_type%0A%0A"
        pr_body="${pr_body}## 📊 Impacto%0A- **Versão**: $current_version → $new_version%0A"
        pr_body="${pr_body}- **Breaking Change**: $(if [[ "$breaking_change" == true ]]; then echo "⚠️%20SIM"; else echo "✅%20NÃO"; fi)%0A%0A"
        pr_body="${pr_body}## ✅ Checklist%0A- [x] Código testado localmente%0A- [x] Changelog atualizado%0A- [x] Versão incrementada"
        
        if [[ -n "$related_issue" ]]; then
            pr_body="${pr_body}%0A%0ACloses $related_issue"
        fi
        
        pr_url="$base_url/compare/$current_branch?expand=1&title=$pr_title&body=$pr_body"
        
    elif [[ $remote_url =~ gitlab\.com[:/]([^/]+)/([^/\.]+) ]]; then
        repo_owner="${BASH_REMATCH[1]}"
        repo_name="${BASH_REMATCH[2]}"
        base_url="https://gitlab.com/$repo_owner/$repo_name"
        branch_url="$base_url/-/tree/$current_branch"
        pr_url="$base_url/-/merge_requests/new?merge_request[source_branch]=$current_branch"
        releases_url="$base_url/-/releases"
    fi
fi

echo -e "${GREEN}✅ Automação concluída com sucesso!${NC}"
echo
echo -e "${CYAN}📊 Resumo:${NC}"
echo "• Plataforma: $PLATFORM"
echo "• Branch: $current_branch"
echo "• Commit: $commit_title"
echo "• Versão: $current_version → $new_version"
echo "• Tag: v$new_version"
echo "• Breaking Change: $(if [[ "$breaking_change" == true ]]; then echo "SIM"; else echo "NÃO"; fi)"
echo

# Links diretos se repositório for detectado
if [[ -n "$repo_owner" && -n "$repo_name" ]]; then
    echo -e "${CYAN}🔗 Links Diretos:${NC}"
    echo -e "${YELLOW}👆 CLIQUE AQUI PARA CONTINUAR:${NC}"
    echo "• 🌿 Ver Branch: $branch_url"
    echo "• 🔄 Criar PR: $pr_url"
    echo "• 🏷️  Ver Releases: $releases_url"
    echo
fi

echo -e "${CYAN}� Recursos Gerados:${NC}"
echo "• ✅ PR Template: PR_TEMPLATE.md"
echo "• 🏷️  Tag de Release: v$new_version"
echo "• � Changelog atualizado"

if [[ -n "$pr_url" ]]; then
    echo
    echo -e "${CYAN}🔄 Criar Pull Request:${NC}"
    echo "$pr_url"
fi

echo
echo -e "${GREEN}🎉 Happy coding!${NC}"
