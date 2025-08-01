#!/bin/bash

# =============================================================================
# 📈 MÓDULO DE VERSIONAMENTO SEMÂNTICO
# =============================================================================
# Gerencia versionamento automático baseado em conventional commits
# =============================================================================

# Variáveis globais
CURRENT_VERSION=""
NEW_VERSION=""
VERSION_BUMP=""

# Configuração interativa do versionamento
version_interactive_setup() {
    log_step "Determinando versionamento semântico..."
    
    _version_get_current
    _version_suggest_bump
    _version_interactive_select
    _version_calculate_new
    _version_confirm
}

# Obter versão atual
_version_get_current() {
    if [[ -f "package.json" ]]; then
        if command -v node >/dev/null 2>&1; then
            CURRENT_VERSION=$(node -p "require('./package.json').version" 2>/dev/null || echo "0.0.0")
        else
            CURRENT_VERSION=$(grep '"version"' package.json 2>/dev/null | sed 's/.*"version": *"\([^"]*\)".*/\1/' || echo "0.0.0")
        fi
    else
        CURRENT_VERSION="0.0.0"
        log_warning "package.json não encontrado, usando versão inicial"
    fi
    
    log_info "Versão atual: $CURRENT_VERSION"
}

# Sugerir tipo de versionamento
_version_suggest_bump() {
    local commit_type=$(commit_get_type)
    local is_breaking=$(commit_is_breaking)
    
    case $commit_type in
        "feat")
            if [[ "$is_breaking" == true ]]; then
                SUGGESTED_BUMP="major"
            else
                SUGGESTED_BUMP="minor"
            fi
            ;;
        "fix"|"security"|"perf")
            if [[ "$is_breaking" == true ]]; then
                SUGGESTED_BUMP="major"
            else
                SUGGESTED_BUMP="patch"
            fi
            ;;
        *)
            if [[ "$is_breaking" == true ]]; then
                SUGGESTED_BUMP="major"
            else
                SUGGESTED_BUMP="patch"
            fi
            ;;
    esac
    
    echo -e "${CYAN}Tipo de versionamento sugerido: ${YELLOW}$SUGGESTED_BUMP${NC}"
    if [[ "$(commit_is_breaking)" == true ]]; then
        echo -e "${RED}⚠️  BREAKING CHANGE detectado!${NC}"
    fi
}

# Seleção interativa do versionamento
_version_interactive_select() {
    echo -e "${CYAN}Selecione o tipo de versionamento:${NC}"
    echo "1) 🚀 major - Mudanças incompatíveis (1.0.0 → 2.0.0)"
    echo "2) ✨ minor - Nova funcionalidade (1.0.0 → 1.1.0)"
    echo "3) 🐛 patch - Correção (1.0.0 → 1.0.1)"
    echo "4) 💡 usar sugestão ($SUGGESTED_BUMP)"

    read -p "Digite o número (1-4): " version_choice

    case $version_choice in
        1) VERSION_BUMP="major" ;;
        2) VERSION_BUMP="minor" ;;
        3) VERSION_BUMP="patch" ;;
        4|"") VERSION_BUMP="$SUGGESTED_BUMP" ;;
        *) log_error "Opção inválida!"; exit 1 ;;
    esac
    
    log_info "Versionamento selecionado: $VERSION_BUMP"
}

# Calcular nova versão
_version_calculate_new() {
    IFS='.' read -ra VERSION_PARTS <<< "$CURRENT_VERSION"
    local major=${VERSION_PARTS[0]}
    local minor=${VERSION_PARTS[1]}
    local patch=${VERSION_PARTS[2]}

    case $VERSION_BUMP in
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

    NEW_VERSION="$major.$minor.$patch"
    log_info "Nova versão: $CURRENT_VERSION → $NEW_VERSION"
}

# Confirmar versionamento
_version_confirm() {
    echo -e "${CYAN}Resumo do versionamento:${NC}"
    echo "• Tipo: $VERSION_BUMP"
    echo "• Atual: $CURRENT_VERSION"
    echo "• Nova: $NEW_VERSION"
    echo "• Breaking: $(if [[ "$(commit_is_breaking)" == true ]]; then echo "SIM"; else echo "NÃO"; fi)"
    echo ""
    
    read -p "Confirmar versionamento? (Y/n): " -r confirm_version
    if [[ $confirm_version =~ ^[Nn]$ ]]; then
        log_info "Reconfigurando versionamento..."
        _version_interactive_select
        _version_calculate_new
        _version_confirm
    fi
}

# Atualizar arquivos com nova versão
version_update_files() {
    log_step "Atualizando arquivos com nova versão..."
    
    # Atualizar package.json
    if [[ -f "package.json" ]]; then
        _version_update_package_json
        log_success "package.json atualizado para $NEW_VERSION"
    fi
    
    # Criar tag
    git_create_tag "$NEW_VERSION"
}

# Atualizar package.json
_version_update_package_json() {
    if command -v node >/dev/null 2>&1; then
        node -e "
            const fs = require('fs');
            const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
            pkg.version = '$NEW_VERSION';
            fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
        "
    else
        sed -i.bak "s/\"version\": *\"[^\"]*\"/\"version\": \"$NEW_VERSION\"/" package.json
        rm -f package.json.bak
    fi
}

# Obter versão atual
version_get_current() {
    echo "$CURRENT_VERSION"
}

# Obter nova versão
version_get_new() {
    echo "$NEW_VERSION"
}

# Obter tipo de bump
version_get_bump() {
    echo "$VERSION_BUMP"
}
