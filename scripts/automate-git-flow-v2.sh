#!/bin/bash

# =============================================================================
# 🚀 SCRIPT DE AUTOMAÇÃO MULTIPLATAFORMA - Git Flow v2.0
# =============================================================================
# Automatiza criação de commits, versionamento e releases
# Suporta: conventional commits, semantic versioning, PR templates
# Compatível: Windows (Git Bash), Linux, macOS
# =============================================================================

set -e

# =============================================================================
# DETECTAR PLATAFORMA
# =============================================================================
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    PLATFORM="Windows (Git Bash)"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    PLATFORM="Linux"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    PLATFORM="macOS"
else
    PLATFORM="Unknown"
fi

# =============================================================================
# CORES E FUNÇÕES DE LOG
# =============================================================================
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Funções de log
log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }
log_step() { echo -e "${MAGENTA}��� $1${NC}"; }

# =============================================================================
# 1. VERIFICAÇÕES INICIAIS
# =============================================================================
echo -e "${CYAN}���️  Plataforma detectada: $PLATFORM${NC}"
log_step "Iniciando fluxo de automação Git Flow v2.0..."

# Verificar se estamos em um repositório Git
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    log_error "Este diretório não é um repositório Git!"
    exit 1
fi

# Verificar estado do repositório
log_info "Verificando estado do repositório..."
current_branch=$(git branch --show-current)
log_info "Branch atual: $current_branch"

if [[ -n $(git status --porcelain) ]]; then
    log_info "Arquivos modificados encontrados:"
    git status --short
else
    log_warning "Nenhum arquivo modificado encontrado!"
    read -p "Deseja continuar mesmo assim? (y/N): " -r continue_anyway
    if [[ ! $continue_anyway =~ ^[Yy]$ ]]; then
        log_info "Operação cancelada."
        exit 0
    fi
fi

# =============================================================================
# 2. SELEÇÃO DO TIPO DE COMMIT
# =============================================================================
log_step "Selecionando tipo de commit..."

echo -e "${CYAN}Selecione o tipo de commit:${NC}"
echo "1) ��� feat      - Nova funcionalidade"
echo "2) ��� fix       - Correção de bug"
echo "3) ��� docs      - Documentação"
echo "4) ��� style     - Formatação/estilo"
echo "5) ♻️  refactor - Refatoração"
echo "6) ⚡ perf      - Performance"
echo "7) ��� test      - Testes"
echo "8) ��� chore     - Tarefas de build/ferramentas"
echo "9) ��� security  - Segurança"
echo "10) ��� i18n     - Internacionalização"

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

read -p "��� Descrição curta do commit: " commit_description
read -p "��� Escopo (opcional, ex: auth, ui, api): " commit_scope
read -p "��� Breaking change? (y/N): " -n 1 -r breaking_change_reply
echo

if [[ $breaking_change_reply =~ ^[Yy]$ ]]; then
    breaking_change=true
    read -p "��� Descrição do breaking change: " breaking_description
else
    breaking_change=false
fi

read -p "��� Descrição detalhada (opcional): " commit_body
read -p "��� Issue relacionada (opcional, ex: #123): " related_issue

# =============================================================================
# 4. GERENCIAMENTO DE BRANCH
# =============================================================================
log_step "Gerenciando branch de desenvolvimento..."

# Função para gerar nome da branch
generate_branch_name() {
    local type=$1
    local scope=$2
    local description=$3
    
    # Pegar apenas as primeiras 3 palavras da descrição
    local short_description=$(echo "$description" | cut -d' ' -f1-3 | tr ' ' '-' | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9-]//g')
    
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

# Gerar nome sugerido
suggested_branch=$(generate_branch_name "$commit_type" "$commit_scope" "$commit_description")

# Sempre oferecer opções de branch
log_info "Branch atual: $current_branch"

echo -e "${CYAN}Opções de branch:${NC}"
echo "1) ��� Criar nova branch: $suggested_branch"
echo "2) ��� Especificar nome customizado"
echo "3) ��� Continuar na branch atual ($current_branch)"

read -p "Escolha uma opção (1-3): " branch_option

case $branch_option in
    1)
        log_info "Criando nova branch: $suggested_branch"
        git checkout -b "$suggested_branch"
        current_branch="$suggested_branch"
        ;;
    2)
        read -p "��� Nome da nova branch: " custom_branch
        log_info "Criando nova branch: $custom_branch"
        git checkout -b "$custom_branch"
        current_branch="$custom_branch"
        ;;
    3)
        if [[ "$current_branch" == "main" || "$current_branch" == "master" ]]; then
            log_warning "⚠️  Continuando na branch principal!"
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
    commit_message="$commit_message

$commit_body"
fi

if [[ "$breaking_change" == true && -n "$breaking_description" ]]; then
    commit_message="$commit_message

BREAKING CHANGE: $breaking_description"
fi

if [[ -n "$related_issue" ]]; then
    commit_message="$commit_message

Closes $related_issue"
fi

log_info "Mensagem de commit construída:"
echo -e "${CYAN}${commit_message}${NC}"

# =============================================================================
# 6. VERSIONAMENTO
# =============================================================================
log_step "Determinando versionamento..."

# Função para pegar versão do package.json
get_package_version() {
    if command -v node >/dev/null 2>&1; then
        node -p "require('./package.json').version" 2>/dev/null || echo "0.0.0"
    else
        grep '"version"' package.json 2>/dev/null | sed 's/.*"version": *"\([^"]*\)".*/\1/' || echo "0.0.0"
    fi
}

current_version=$(get_package_version)
log_info "Versão atual: $current_version"

# Determinar sugestão
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

echo -e "${CYAN}Tipo de versionamento sugerido: ${YELLOW}$suggested_bump${NC}"
if [[ "$breaking_change" == true ]]; then
    echo -e "${RED}⚠️  BREAKING CHANGE detectado!${NC}"
fi

echo -e "${CYAN}Selecione o tipo de versionamento:${NC}"
echo "1) ��� major - Mudanças incompatíveis (1.0.0 → 2.0.0)"
echo "2) ��� minor - Nova funcionalidade (1.0.0 → 1.1.0)"
echo "3) ��� patch - Correção (1.0.0 → 1.0.1)"
echo "4) ��� usar sugestão ($suggested_bump)"

read -p "Digite o número (1-4): " version_choice

case $version_choice in
    1) version_bump="major" ;;
    2) version_bump="minor" ;;
    3) version_bump="patch" ;;
    4|"") version_bump="$suggested_bump" ;;
    *) log_error "Opção inválida!"; exit 1 ;;
esac

log_info "Versionamento selecionado: $version_bump"

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

new_version="$major.$minor.$patch"
log_info "Nova versão: $new_version"

# =============================================================================
# 7. ATUALIZAR PACKAGE.JSON
# =============================================================================
update_package_version() {
    if command -v node >/dev/null 2>&1; then
        node -e "
            const fs = require('fs');
            const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
            pkg.version = '$new_version';
            fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
        "
    else
        sed -i.bak "s/\"version\": *\"[^\"]*\"/\"version\": \"$new_version\"/" package.json
        rm -f package.json.bak
    fi
}

if [[ -f "package.json" ]]; then
    update_package_version
    log_success "package.json atualizado para $new_version"
fi

# =============================================================================
# 8. FAZER COMMIT E TAG
# =============================================================================
log_step "Fazendo commit..."

git add .
git commit -m "$commit_message"
log_success "Commit realizado!"

# Criar tag
git tag -a "v$new_version" -m "Release version $new_version"
log_success "Tag v$new_version criada!"

# =============================================================================
# 9. GERAR CHANGELOG
# =============================================================================
log_step "Gerando changelog..."

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

    if [[ -f "CHANGELOG.md" ]]; then
        cp CHANGELOG.md CHANGELOG.md.bak
        echo "$changelog_entry

$(cat CHANGELOG.md.bak)" > CHANGELOG.md
        rm CHANGELOG.md.bak
    else
        echo "# Changelog

$changelog_entry" > CHANGELOG.md
    fi

    log_success "Changelog atualizado!"
}

generate_changelog "$new_version"

# =============================================================================
# 10. ALERTA E PUSH
# =============================================================================
log_step "Preparando para push..."

echo -e "${RED}�� ATENÇÃO! ${NC}"
echo -e "${YELLOW}A partir daqui você irá:${NC}"
echo "• ��� Push da branch: $current_branch"
echo "• ���️  Criar tag: v$new_version"
echo "• ��� Enviar para repositório remoto"
echo ""
echo -e "${RED}⚠️  Isso não pode ser desfeito facilmente!${NC}"
echo ""
read -p "Continuar? (y/N): " -n 1 -r confirm_push
echo

if [[ ! $confirm_push =~ ^[Yy]$ ]]; then
    log_warning "Operação cancelada."
    log_info "Commit local realizado, mas não enviado."
    exit 0
fi

log_step "Fazendo push..."

git push origin "$current_branch"
git push origin "v$new_version"

log_success "Push realizado!"

# =============================================================================
# 11. RESUMO E LINKS
# =============================================================================
log_step "Resumo da Operação"

# Detectar repositório
remote_url=$(git config --get remote.origin.url 2>/dev/null || echo "")
repo_owner=""
repo_name=""

if [[ -n "$remote_url" ]]; then
    if [[ $remote_url =~ github\.com[:/]([^/]+)/([^/\.]+) ]]; then
        repo_owner="${BASH_REMATCH[1]}"
        repo_name="${BASH_REMATCH[2]}"
        base_url="https://github.com/$repo_owner/$repo_name"
        branch_url="$base_url/tree/$current_branch"
        releases_url="$base_url/releases"
        
        # URL do PR pré-preenchida (encoding completo - sem emojis)
        pr_title=$(echo "$commit_title" | sed 's/ /%20/g' | sed 's/&/%26/g' | sed 's/(/\%28/g' | sed 's/)/\%29/g' | sed 's/:/%3A/g' | sed 's/ç/%C3%A7/g' | sed 's/ã/%C3%A3/g' | sed 's/õ/%C3%B5/g')
        pr_description_escaped=$(echo "$commit_description" | sed 's/ /%20/g' | sed 's/&/%26/g' | sed 's/(/\%28/g' | sed 's/)/\%29/g' | sed 's/:/%3A/g' | sed 's/ç/%C3%A7/g' | sed 's/ã/%C3%A3/g' | sed 's/õ/%C3%B5/g')
        pr_body="**Descricao**%0A$pr_description_escaped%0A%0A"
        
        if [[ -n "$commit_body" ]]; then
            pr_body_escaped=$(echo "$commit_body" | sed 's/ /%20/g' | sed 's/&/%26/g' | sed 's/(/\%28/g' | sed 's/)/\%29/g' | sed 's/:/%3A/g' | sed 's/ç/%C3%A7/g' | sed 's/ã/%C3%A3/g' | sed 's/õ/%C3%B5/g')
            pr_body="$pr_body$pr_body_escaped%0A%0A"
        fi
        
        pr_body="${pr_body}**Tipo**%0A-%20[x]%20$commit_type%0A%0A"
        pr_body="${pr_body}**Impacto**%0A-%20Versao:%20$current_version%20para%20$new_version%0A"
        pr_body="${pr_body}-%20Breaking:%20$(if [[ "$breaking_change" == true ]]; then echo "SIM"; else echo "NAO"; fi)%0A%0A"
        pr_body="${pr_body}**Checklist**%0A-%20[x]%20Testado%20localmente%0A-%20[x]%20Changelog%20atualizado%0A-%20[x]%20Versao%20incrementada"
        
        if [[ -n "$related_issue" ]]; then
            pr_body="${pr_body}%0A%0ACloses%20$related_issue"
        fi
        
        pr_url="$base_url/compare/$current_branch?expand=1&title=$pr_title&body=$pr_body"
    fi
fi

echo -e "${GREEN}✅ Automação concluída!${NC}"
echo
echo -e "${CYAN}��� Resumo:${NC}"
echo "• Plataforma: $PLATFORM"
echo "• Branch: $current_branch"
echo "• Commit: $commit_title"
echo "• Versão: $current_version → $new_version"
echo "• Breaking: $(if [[ "$breaking_change" == true ]]; then echo "SIM"; else echo "NÃO"; fi)"
echo

if [[ -n "$repo_owner" && -n "$repo_name" ]]; then
    echo -e "${CYAN}��� Links:${NC}"
    echo "• ��� Branch: $branch_url"
    echo "• ���️  Releases: $releases_url"
    echo
fi

echo -e "${CYAN}��� Recursos:${NC}"
echo "• ���️  Tag: v$new_version"
echo "• ��� Changelog atualizado"
echo "• ��� Package.json versionado"

if [[ -n "$pr_url" ]]; then
    echo
    echo -e "${YELLOW}��� CRIAR PR PRÉ-PREENCHIDO:${NC}"
    echo "$pr_url"
    echo
    echo -e "${GREEN}��� Link já preenche título, descrição e checklist!${NC}"
fi

echo
echo -e "${GREEN}��� Happy coding!${NC}"
