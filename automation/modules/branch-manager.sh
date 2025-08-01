#!/bin/bash

# =============================================================================
# 🌿 MÓDULO DE GERENCIAMENTO DE BRANCHES
# =============================================================================
# Gerencia criação e navegação entre branches
# =============================================================================

# Variáveis globais
TARGET_BRANCH=""

# Gerenciamento interativo de branches
branch_interactive_management() {
    log_step "Gerenciando branch de desenvolvimento..."
    
    _branch_show_current
    _branch_generate_suggestion
    _branch_interactive_select
}

# Mostrar branch atual
_branch_show_current() {
    log_info "Branch atual: $CURRENT_BRANCH"
    
    if [[ "$CURRENT_BRANCH" == "main" || "$CURRENT_BRANCH" == "master" ]]; then
        log_warning "⚠️  Você está na branch principal!"
    fi
}

# Gerar sugestão de nome da branch
_branch_generate_suggestion() {
    local commit_type=$(commit_get_type)
    local commit_scope=$(commit_get_scope | tr '[:upper:]' '[:lower:]')
    local commit_description=$(commit_get_description)
    
    # Pegar apenas as primeiras 3 palavras da descrição
    local short_description=$(echo "$commit_description" | cut -d' ' -f1-3 | tr ' ' '-' | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9-]//g')
    
    if [[ -n "$commit_scope" ]]; then
        SUGGESTED_BRANCH="${commit_type}/${commit_scope}-${short_description}"
    else
        SUGGESTED_BRANCH="${commit_type}/${short_description}"
    fi
    
    # Se ainda estiver muito longo, cortar mais
    if [[ ${#SUGGESTED_BRANCH} -gt 50 ]]; then
        local words_description=$(echo "$commit_description" | cut -d' ' -f1-2 | tr ' ' '-' | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9-]//g')
        if [[ -n "$commit_scope" ]]; then
            SUGGESTED_BRANCH="${commit_type}/${commit_scope}-${words_description}"
        else
            SUGGESTED_BRANCH="${commit_type}/${words_description}"
        fi
    fi
}

# Seleção interativa de branch
_branch_interactive_select() {
    echo -e "${CYAN}Opções de branch:${NC}"
    echo "1) 🌿 Criar nova branch: $SUGGESTED_BRANCH"
    echo "2) ✏️  Especificar nome customizado"
    echo "3) 📍 Continuar na branch atual ($CURRENT_BRANCH)"

    read -p "Escolha uma opção (1-3): " branch_option

    case $branch_option in
        1)
            _branch_create "$SUGGESTED_BRANCH"
            ;;
        2)
            read -p "📝 Nome da nova branch: " custom_branch
            if [[ -z "$custom_branch" ]]; then
                log_error "Nome da branch não pode estar vazio!"
                _branch_interactive_select
                return
            fi
            _branch_create "$custom_branch"
            ;;
        3)
            TARGET_BRANCH="$CURRENT_BRANCH"
            if [[ "$CURRENT_BRANCH" == "main" || "$CURRENT_BRANCH" == "master" ]]; then
                log_warning "⚠️  Continuando na branch principal!"
            else
                log_info "Continuando na branch atual: $CURRENT_BRANCH"
            fi
            ;;
        *)
            log_error "Opção inválida!"
            _branch_interactive_select
            ;;
    esac
}

# Criar nova branch
_branch_create() {
    local branch_name=$1
    
    # Verificar se a branch já existe
    if git rev-parse --verify "$branch_name" > /dev/null 2>&1; then
        log_error "Branch '$branch_name' já existe!"
        read -p "📝 Digite um novo nome: " new_branch_name
        _branch_create "$new_branch_name"
        return
    fi
    
    log_info "Criando nova branch: $branch_name"
    git checkout -b "$branch_name"
    
    TARGET_BRANCH="$branch_name"
    CURRENT_BRANCH="$branch_name"
    
    log_success "Branch '$branch_name' criada e ativada!"
}

# Verificar se branch existe
branch_exists() {
    local branch_name=$1
    git rev-parse --verify "$branch_name" > /dev/null 2>&1
}

# Listar branches locais
branch_list_local() {
    git branch --format='%(refname:short)'
}

# Listar branches remotas
branch_list_remote() {
    git branch -r --format='%(refname:short)' | sed 's/origin\///'
}

# Obter branch atual
branch_get_current() {
    echo "$CURRENT_BRANCH"
}

# Obter branch alvo
branch_get_target() {
    echo "$TARGET_BRANCH"
}

# Verificar se está na branch principal
branch_is_main() {
    [[ "$CURRENT_BRANCH" == "main" || "$CURRENT_BRANCH" == "master" ]]
}
