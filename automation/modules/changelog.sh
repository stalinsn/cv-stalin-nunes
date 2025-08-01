#!/bin/bash

# =============================================================================
# 📖 MÓDULO DE GERAÇÃO DE CHANGELOG
# =============================================================================
# Gera e atualiza changelog automaticamente
# =============================================================================

# Gerar changelog automaticamente
changelog_generate() {
    log_step "Gerando changelog..."
    
    local version=$(version_get_new)
    local commit_type=$(commit_get_type)
    local commit_description=$(commit_get_description)
    local commit_body=$(commit_get_body)
    local is_breaking=$(commit_is_breaking)
    
    _changelog_create_entry "$version" "$commit_type" "$commit_description" "$commit_body" "$is_breaking"
    
    log_success "Changelog atualizado para versão $version!"
}

# Criar entrada no changelog
_changelog_create_entry() {
    local version=$1
    local commit_type=$2
    local commit_description=$3
    local commit_body=$4
    local is_breaking=$5
    
    local date=$(date '+%Y-%m-%d')
    local type_emoji=$(_changelog_get_type_emoji "$commit_type")
    
    # Construir entrada do changelog
    local changelog_entry="## [$version] - $date

### $type_emoji $(echo "$commit_type" | tr '[:lower:]' '[:upper:]')
- $commit_description"

    # Adicionar corpo se existir
    if [[ -n "$commit_body" ]]; then
        changelog_entry="$changelog_entry

  $commit_body"
    fi
    
    # Adicionar breaking change se existir
    if [[ "$is_breaking" == true ]]; then
        changelog_entry="$changelog_entry

### 💥 BREAKING CHANGES
- $(echo "$commit_description" | sed 's/^/  /')"
    fi

    # Atualizar ou criar arquivo
    if [[ -f "CHANGELOG.md" ]]; then
        _changelog_update_existing "$changelog_entry"
    else
        _changelog_create_new "$changelog_entry"
    fi
}

# Atualizar changelog existente
_changelog_update_existing() {
    local changelog_entry=$1
    
    # Criar backup
    cp CHANGELOG.md CHANGELOG.md.bak
    
    # Inserir nova entrada no topo (após o título)
    if grep -q "^# Changelog" CHANGELOG.md; then
        # Se tem título, inserir após
        awk -v entry="$changelog_entry" '
        /^# Changelog/ { print; print ""; print entry; print ""; next }
        { print }
        ' CHANGELOG.md.bak > CHANGELOG.md
    else
        # Se não tem título, inserir no topo
        echo "$changelog_entry

$(cat CHANGELOG.md.bak)" > CHANGELOG.md
    fi
    
    rm CHANGELOG.md.bak
}

# Criar novo changelog
_changelog_create_new() {
    local changelog_entry=$1
    
    cat > CHANGELOG.md << EOF
# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

$changelog_entry
EOF
}

# Obter emoji para tipo de commit
_changelog_get_type_emoji() {
    local commit_type=$1
    
    case $commit_type in
        "feat") echo "🚀" ;;
        "fix") echo "🐛" ;;
        "docs") echo "📚" ;;
        "style") echo "💄" ;;
        "refactor") echo "♻️" ;;
        "perf") echo "⚡" ;;
        "test") echo "🧪" ;;
        "chore") echo "🔧" ;;
        "security") echo "🔒" ;;
        "i18n") echo "🌐" ;;
        *) echo "📝" ;;
    esac
}

# Gerar changelog completo desde o início
changelog_generate_full() {
    log_step "Gerando changelog completo..."
    
    # Obter todos os commits com tags
    local commits=$(git log --oneline --decorate --tags --no-merges --reverse)
    
    # Processar commits e gerar entradas
    # TODO: Implementar parsing completo do histórico
    
    log_info "Funcionalidade de changelog completo em desenvolvimento"
}

# Validar formato do changelog
changelog_validate() {
    if [[ ! -f "CHANGELOG.md" ]]; then
        log_warning "CHANGELOG.md não encontrado"
        return 1
    fi
    
    # Verificar se tem formato básico
    if ! grep -q "^# Changelog" CHANGELOG.md; then
        log_warning "CHANGELOG.md não possui formato padrão"
        return 1
    fi
    
    log_success "CHANGELOG.md é válido"
    return 0
}

# Obter última versão do changelog
changelog_get_last_version() {
    if [[ -f "CHANGELOG.md" ]]; then
        grep -m 1 "^## \[" CHANGELOG.md | sed 's/^## \[\([^]]*\)\].*/\1/' || echo ""
    else
        echo ""
    fi
}
