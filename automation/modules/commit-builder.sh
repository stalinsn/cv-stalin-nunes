#!/bin/bash

# =============================================================================
# 📝 MÓDULO DE CONSTRUÇÃO DE COMMITS
# =============================================================================
# Interface interativa para criação de commits conventional
# =============================================================================

# Variáveis globais do commit
COMMIT_TYPE=""
COMMIT_SCOPE=""
COMMIT_DESCRIPTION=""
COMMIT_BODY=""
COMMIT_TITLE=""
COMMIT_MESSAGE=""
BREAKING_CHANGE=false
BREAKING_DESCRIPTION=""
RELATED_ISSUE=""

# Configuração interativa do commit
commit_interactive_setup() {
    log_step "Configurando commit conventional..."
    
    _commit_select_type
    _commit_get_description
    _commit_get_scope
    _commit_check_breaking_change
    _commit_get_details
    _commit_build_message
    _commit_preview
}

# Seleção do tipo de commit
_commit_select_type() {
    echo -e "${CYAN}Selecione o tipo de commit:${NC}"
    echo "1) 🚀 feat      - Nova funcionalidade"
    echo "2) 🐛 fix       - Correção de bug"
    echo "3) 📚 docs      - Documentação"
    echo "4) 💄 style     - Formatação/estilo"
    echo "5) ♻️  refactor - Refatoração"
    echo "6) ⚡ perf      - Performance"
    echo "7) 🧪 test      - Testes"
    echo "8) 🔧 chore     - Tarefas de build/ferramentas"
    echo "9) 🔒 security  - Segurança"
    echo "10) 🌐 i18n     - Internacionalização"

    read -p "Digite o número (1-10): " commit_type_num

    case $commit_type_num in
        1) COMMIT_TYPE="feat" ;;
        2) COMMIT_TYPE="fix" ;;
        3) COMMIT_TYPE="docs" ;;
        4) COMMIT_TYPE="style" ;;
        5) COMMIT_TYPE="refactor" ;;
        6) COMMIT_TYPE="perf" ;;
        7) COMMIT_TYPE="test" ;;
        8) COMMIT_TYPE="chore" ;;
        9) COMMIT_TYPE="security" ;;
        10) COMMIT_TYPE="i18n" ;;
        *) log_error "Opção inválida!"; exit 1 ;;
    esac
}

# Obter descrição do commit
_commit_get_description() {
    read -p "📝 Descrição curta do commit: " COMMIT_DESCRIPTION
    
    if [[ -z "$COMMIT_DESCRIPTION" ]]; then
        log_error "Descrição é obrigatória!"
        _commit_get_description
    fi
}

# Obter escopo (opcional)
_commit_get_scope() {
    read -p "🎯 Escopo (opcional, ex: auth, ui, api): " COMMIT_SCOPE
}

# Verificar breaking change
_commit_check_breaking_change() {
    read -p "💥 Breaking change? (y/N): " -n 1 -r breaking_change_reply
    echo

    if [[ $breaking_change_reply =~ ^[Yy]$ ]]; then
        BREAKING_CHANGE=true
        read -p "📋 Descrição do breaking change: " BREAKING_DESCRIPTION
    else
        BREAKING_CHANGE=false
    fi
}

# Obter detalhes adicionais
_commit_get_details() {
    read -p "📄 Descrição detalhada (opcional): " COMMIT_BODY
    read -p "🔗 Issue relacionada (opcional, ex: #123): " RELATED_ISSUE
}

# Construir mensagem de commit
_commit_build_message() {
    # Título do commit
    if [[ -n "$COMMIT_SCOPE" ]]; then
        COMMIT_TITLE="${COMMIT_TYPE}(${COMMIT_SCOPE}): ${COMMIT_DESCRIPTION}"
    else
        COMMIT_TITLE="${COMMIT_TYPE}: ${COMMIT_DESCRIPTION}"
    fi

    # Breaking change no título
    if [[ "$BREAKING_CHANGE" == true ]]; then
        COMMIT_TITLE="${COMMIT_TITLE}!"
    fi

    # Corpo do commit
    COMMIT_MESSAGE="$COMMIT_TITLE"

    if [[ -n "$COMMIT_BODY" ]]; then
        COMMIT_MESSAGE="$COMMIT_MESSAGE

$COMMIT_BODY"
    fi

    if [[ "$BREAKING_CHANGE" == true && -n "$BREAKING_DESCRIPTION" ]]; then
        COMMIT_MESSAGE="$COMMIT_MESSAGE

BREAKING CHANGE: $BREAKING_DESCRIPTION"
    fi

    if [[ -n "$RELATED_ISSUE" ]]; then
        COMMIT_MESSAGE="$COMMIT_MESSAGE

Closes $RELATED_ISSUE"
    fi
}

# Preview da mensagem
_commit_preview() {
    log_step "Preview da mensagem de commit:"
    echo -e "${CYAN}${COMMIT_MESSAGE}${NC}"
    echo ""
    
    read -p "Confirmar commit? (Y/n): " -r confirm_commit
    if [[ $confirm_commit =~ ^[Nn]$ ]]; then
        log_info "Reconfigurando commit..."
        commit_interactive_setup
    fi
}

# Obter tipo de commit (para versionamento)
commit_get_type() {
    echo "$COMMIT_TYPE"
}

# Verificar se é breaking change
commit_is_breaking() {
    [[ "$BREAKING_CHANGE" == true ]]
}

# Obter título do commit
commit_get_title() {
    echo "$COMMIT_TITLE"
}

# Obter descrição do commit
commit_get_description() {
    echo "$COMMIT_DESCRIPTION"
}

# Obter escopo do commit
commit_get_scope() {
    echo "$COMMIT_SCOPE"
}

# Obter corpo do commit
commit_get_body() {
    echo "$COMMIT_BODY"
}

# Obter issue relacionada
commit_get_related_issue() {
    echo "$RELATED_ISSUE"
}
