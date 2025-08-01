#!/bin/bash

# =============================================================================
# 🔧 MÓDULO DE UTILITÁRIOS GIT
# =============================================================================
# Funções para operações básicas com Git
# =============================================================================

# Variáveis globais
CURRENT_BRANCH=""
REPO_OWNER=""
REPO_NAME=""
REMOTE_URL=""

# Informações extraídas da branch
BRANCH_TYPE=""
BRANCH_TASK_CODE=""
BRANCH_DESCRIPTION=""

# Verificar se estamos em um repositório Git
git_verify_repository() {
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        log_error "Este diretório não é um repositório Git!"
        exit 1
    fi
    
    # Carregar informações básicas
    CURRENT_BRANCH=$(git branch --show-current)
    REMOTE_URL=$(git config --get remote.origin.url 2>/dev/null || echo "")
    
    # Extrair owner e repo do GitHub
    if [[ $REMOTE_URL =~ github\.com[:/]([^/]+)/([^/\.]+) ]]; then
        REPO_OWNER="${BASH_REMATCH[1]}"
        REPO_NAME="${BASH_REMATCH[2]}"
    fi
    
    log_success "Repositório Git verificado"
    log_info "Branch atual: $CURRENT_BRANCH"
    
    # Extrair informações inteligentes da branch
    git_extract_branch_info
}

# Extrair informações da branch atual para pré-preenchimento
git_extract_branch_info() {
    local branch="$CURRENT_BRANCH"
    
    # Variáveis globais para informações extraídas
    BRANCH_TYPE=""
    BRANCH_TASK_CODE=""
    BRANCH_DESCRIPTION=""
    
    # Padrões de branch comuns
    if [[ $branch =~ ^(feature|feat|bugfix|fix|hotfix|release|chore|docs|style|refactor|test)/(.+)$ ]]; then
        BRANCH_TYPE="${BASH_REMATCH[1]}"
        local branch_suffix="${BASH_REMATCH[2]}"
        
        # Tentar extrair código da tarefa (ex: ccl-2025, ecp-3022, proj-123)
        if [[ $branch_suffix =~ ^([a-zA-Z]{2,4}-[0-9]+)(.*)$ ]]; then
            BRANCH_TASK_CODE="${BASH_REMATCH[1]}"
            BRANCH_DESCRIPTION="${BASH_REMATCH[2]}"
            # Limpar descrição (remover traços iniciais)
            BRANCH_DESCRIPTION="${BRANCH_DESCRIPTION#-}"
            BRANCH_DESCRIPTION="${BRANCH_DESCRIPTION#_}"
        else
            # Se não tem código, toda a parte depois da / é descrição
            BRANCH_DESCRIPTION="$branch_suffix"
        fi
        
        log_info "🧠 Informações extraídas da branch:"
        log_info "   Tipo: $BRANCH_TYPE"
        [[ -n "$BRANCH_TASK_CODE" ]] && log_info "   Código da tarefa: $BRANCH_TASK_CODE"
        [[ -n "$BRANCH_DESCRIPTION" ]] && log_info "   Descrição: $BRANCH_DESCRIPTION"
    else
        log_info "⚠️  Branch não segue padrão conventional - usando valores padrão"
    fi
}

# Sugerir URL do JIRA baseada no código da tarefa da branch
git_suggest_jira_url() {
    local base_url="${JIRA_BASE_URL:-https://suaempresa.atlassian.net/browse}"
    
    if [[ -n "$BRANCH_TASK_CODE" ]]; then
        # Converter para uppercase (padrão JIRA)
        local task_code_upper=$(echo "$BRANCH_TASK_CODE" | tr '[:lower:]' '[:upper:]')
        echo "$base_url/$task_code_upper"
    else
        echo ""
    fi
}

# Sugerir nome do workspace baseado na branch
git_suggest_workspace_name() {
    if [[ -n "$BRANCH_TYPE" && -n "$BRANCH_TASK_CODE" ]]; then
        # Para E-commerce: usar tipo + código (ex: feature-ccl-2025)
        echo "$BRANCH_TYPE-$BRANCH_TASK_CODE"
    elif [[ -n "$CURRENT_BRANCH" ]]; then
        # Fallback: usar a branch atual (sanitizada)
        echo "$CURRENT_BRANCH" | sed 's/[^a-zA-Z0-9-]/-/g'
    else
        echo ""
    fi
}

# Sugerir código da tarefa para preenchimento
git_suggest_task_code() {
    if [[ -n "$BRANCH_TASK_CODE" ]]; then
        # Converter para uppercase (padrão JIRA)
        echo "$BRANCH_TASK_CODE" | tr '[:lower:]' '[:upper:]'
    else
        echo ""
    fi
}

# Verificar estado do repositório
git_check_status() {
    log_step "Verificando estado do repositório..."
    
    if [[ -n $(git status --porcelain) ]]; then
        log_info "Arquivos modificados encontrados:"
        git status --short
        return 0
    else
        log_warning "Nenhum arquivo modificado encontrado!"
        read -p "Deseja continuar mesmo assim? (y/N): " -r continue_anyway
        if [[ ! $continue_anyway =~ ^[Yy]$ ]]; then
            log_info "Operação cancelada."
            exit 0
        fi
        return 1
    fi
}

# Adicionar e fazer commit
git_execute_commit() {
    log_step "Executando commit..."
    
    git add .
    git commit -m "$COMMIT_MESSAGE"
    
    log_success "Commit realizado!"
    log_info "Mensagem: $COMMIT_TITLE"
}

# Criar tag
git_create_tag() {
    local version=$1
    local message=${2:-"Release version $version"}
    
    git tag -a "v$version" -m "$message"
    log_success "Tag v$version criada!"
}

# Push interativo
git_interactive_push() {
    log_step "Preparando para push..."
    
    echo -e "${RED}🚨 ATENÇÃO! ${NC}"
    echo -e "${YELLOW}A partir daqui você irá:${NC}"
    echo "• 📤 Push da branch: $CURRENT_BRANCH"
    echo "• 🏷️  Criar tag: v$NEW_VERSION"
    echo "• 🌐 Enviar para repositório remoto"
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
    
    git push origin "$CURRENT_BRANCH"
    git push origin "v$NEW_VERSION"
    
    log_success "Push realizado com sucesso!"
}

# Obter URL base do repositório
git_get_base_url() {
    if [[ -n "$REPO_OWNER" && -n "$REPO_NAME" ]]; then
        echo "https://github.com/$REPO_OWNER/$REPO_NAME"
    else
        echo ""
    fi
}

# Obter informações do repositório
git_get_repo_info() {
    echo "owner:$REPO_OWNER"
    echo "name:$REPO_NAME"
    echo "branch:$CURRENT_BRANCH"
    echo "url:$REMOTE_URL"
}
