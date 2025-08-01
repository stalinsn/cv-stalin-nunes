#!/bin/bash

# =============================================================================
# 📋 MÓDULO DE TEMPLATES DE PR
# =============================================================================
# Gerencia diferentes templates de Pull Request
# =============================================================================

# Variáveis globais
SELECTED_TEMPLATE=""
TEMPLATE_FIELDS=()
JIRA_TASK=""
JIRA_URL=""
DOC_URL=""
WORKSPACE_DEV_NAME=""
WORKSPACE_STORE_NAME=""
WORKSPACE_DOMAIN=""
WORKSPACE_URL=""

# Variáveis de configuração de templates (globais)
declare -a TEMPLATES=()
DEFAULT_TEMPLATE=""
CUSTOM_TEMPLATE_FILE=""  # Para rastrear templates customizados criados

# Carregar configuração de templates
template_load_config() {
    local config_file="$SCRIPT_DIR/config/pr-templates.conf"
    
    # Inicializar variáveis globais
    TEMPLATES=()
    DEFAULT_TEMPLATE="default"
    
    if [[ -f "$config_file" ]]; then
        source "$config_file"
        log_info "Configuração de templates carregada"
        
        # Verificar se TEMPLATES foi carregado corretamente
        if [[ ${#TEMPLATES[@]} -eq 0 ]]; then
            log_warning "Array TEMPLATES vazio, usando configuração padrão"
            DEFAULT_TEMPLATE="default"
            TEMPLATES=("default:default.md:🎯 Padrão GitHub:github")
        fi
    else
        log_warning "Arquivo de configuração de templates não encontrado"
        # Usar configuração padrão
        DEFAULT_TEMPLATE="default"
        TEMPLATES=("default:default.md:🎯 Padrão GitHub:github")
    fi
    
    log_info "Templates carregados: ${#TEMPLATES[@]} templates"
}

# Seleção interativa de template
template_interactive_select() {
    log_step "Selecionando template de PR..."
    
    template_load_config
    
    echo -e "${CYAN}🎯 Templates de PR disponíveis:${NC}"
    echo ""
    local i=1
    local template_options=()
    
    for template_info in "${TEMPLATES[@]}"; do
        IFS=':' read -ra TEMPLATE_PARTS <<< "$template_info"
        local name="${TEMPLATE_PARTS[0]}"
        local description="${TEMPLATE_PARTS[2]}"
        local example="${TEMPLATE_PARTS[3]}"
        local type="${TEMPLATE_PARTS[4]}"
        
        echo -e "${GREEN}$i) $description${NC}"
        echo "   💡 Exemplo: $example"
        
        # Mostrar informações específicas do tipo
        case "$type" in
            "github"|"minimal")
                echo -e "   📝 ${CYAN}Simples - sem campos extras${NC}"
                ;;
            "enterprise")
                echo -e "   🏢 ${YELLOW}Corporativo - apenas JIRA${NC}"
                ;;
            "ecommerce")
                echo -e "   🛒 ${MAGENTA}E-commerce - JIRA + Workspace${NC}"
                ;;
        esac
        echo ""
        template_options+=("$name")
        ((i++))
    done
    
    echo -e "${GRAY}$i) ⚙️ Usar configuração padrão ($DEFAULT_TEMPLATE)${NC}"
    echo -e "${GRAY}$((i+1))) 🔧 Personalizar template existente${NC}"
    echo ""
    
    read -p "Escolha uma opção (1-$((i+1))): " template_choice
    
    if [[ $template_choice -eq $i ]]; then
        SELECTED_TEMPLATE="$DEFAULT_TEMPLATE"
        log_info "Usando template padrão: $DEFAULT_TEMPLATE"
    elif [[ $template_choice -eq $((i+1)) ]]; then
        template_interactive_customize
    elif [[ $template_choice -ge 1 && $template_choice -lt $i ]]; then
        SELECTED_TEMPLATE="${template_options[$((template_choice-1))]}"
        log_info "Template selecionado: $SELECTED_TEMPLATE"
        
        # Verificar se precisa de campos extras
        template_check_extra_fields "$SELECTED_TEMPLATE"
    else
        log_error "Opção inválida!"
        template_interactive_select
    fi
}

# Verificar se template precisa de campos extras
template_check_extra_fields() {
    local template_name=$1
    
    # Encontrar o tipo do template
    local template_type=""
    for template_info in "${TEMPLATES[@]}"; do
        IFS=':' read -ra TEMPLATE_PARTS <<< "$template_info"
        if [[ "${TEMPLATE_PARTS[0]}" == "$template_name" ]]; then
            template_type="${TEMPLATE_PARTS[4]}"
            break
        fi
    done
    
    # Coletar campos baseado no tipo do template
    case "$template_type" in
        "github"|"minimal")
            log_info "📝 Template $template_type selecionado - sem campos extras necessários"
            ;;
        "enterprise")
            log_info "🏢 Template Enterprise - coletando informações corporativas..."
            template_collect_enterprise_fields
            ;;
        "ecommerce")
            log_info "🛒 Template E-commerce - coletando informações de workspace..."
            template_collect_ecommerce_fields
            ;;
        *)
            log_warning "Tipo de template desconhecido: $template_type"
            ;;
    esac
}

# Coletar campos para template Enterprise (foco em JIRA + docs)
template_collect_enterprise_fields() {
    echo -e "${CYAN}🏢 Informações Corporativas (opcionais):${NC}"
    
    # Sugerir código da tarefa baseado na branch
    local suggested_task=$(git_suggest_task_code)
    if [[ -n "$suggested_task" ]]; then
        echo -e "${GREEN}💡 Detectado da branch: $suggested_task${NC}"
        read -p "📋 Código da tarefa (detectado: $suggested_task, Enter para usar ou digite outro): " JIRA_TASK
        JIRA_TASK="${JIRA_TASK:-$suggested_task}"
    else
        read -p "📋 Código da tarefa (ex: PROJ-123, opcional): " JIRA_TASK
    fi
    
    # JIRA URL com sugestão inteligente
    if [[ -n "$JIRA_TASK" ]]; then
        local suggested_url=$(git_suggest_jira_url)
        if [[ -n "$suggested_url" ]]; then
            echo -e "${GREEN}💡 URL sugerida: $suggested_url${NC}"
            read -p "🔗 Usar esta URL? (y/N) ou digite a URL correta: " jira_response
            if [[ $jira_response =~ ^[Yy]$ ]]; then
                JIRA_URL="$suggested_url"
            elif [[ -n "$jira_response" && ! $jira_response =~ ^[Nn]$ ]]; then
                JIRA_URL="$jira_response"
            fi
        else
            echo -e "${YELLOW}💡 Sugestão: https://suaempresa.atlassian.net/browse/$JIRA_TASK${NC}"
            read -p "🔗 Usar esta URL? (y/N) ou digite a URL correta: " jira_response
            if [[ $jira_response =~ ^[Yy]$ ]]; then
                JIRA_URL="https://suaempresa.atlassian.net/browse/$JIRA_TASK"
            elif [[ -n "$jira_response" && ! $jira_response =~ ^[Nn]$ ]]; then
                JIRA_URL="$jira_response"
            fi
        fi
    else
        read -p "🔗 URL completa da tarefa (opcional): " JIRA_URL
    fi
    
    # Documentação
    read -p "📚 URL da documentação (opcional): " DOC_URL
}

# Coletar campos para template E-commerce (JIRA + workspace)
template_collect_ecommerce_fields() {
    echo -e "${CYAN}🛒 Informações E-commerce (opcionais):${NC}"
    
    # Sugerir código da tarefa baseado na branch
    local suggested_task=$(git_suggest_task_code)
    if [[ -n "$suggested_task" ]]; then
        echo -e "${GREEN}💡 Detectado da branch: $suggested_task${NC}"
        read -p "📋 Código da tarefa (detectado: $suggested_task, Enter para usar ou digite outro): " JIRA_TASK
        JIRA_TASK="${JIRA_TASK:-$suggested_task}"
    else
        read -p "📋 Código da tarefa (ex: PROJ-123, opcional): " JIRA_TASK
    fi
    
    # JIRA URL com sugestão inteligente
    if [[ -n "$JIRA_TASK" ]]; then
        local suggested_url=$(git_suggest_jira_url)
        if [[ -n "$suggested_url" ]]; then
            echo -e "${GREEN}💡 URL sugerida: $suggested_url${NC}"
            read -p "🔗 Usar esta URL? (y/N) ou digite a URL correta: " jira_response
            if [[ $jira_response =~ ^[Yy]$ ]]; then
                JIRA_URL="$suggested_url"
            elif [[ -n "$jira_response" && ! $jira_response =~ ^[Nn]$ ]]; then
                JIRA_URL="$jira_response"
            fi
        else
            echo -e "${YELLOW}💡 Sugestão: https://suaempresa.atlassian.net/browse/$JIRA_TASK${NC}"
            read -p "🔗 Usar esta URL? (y/N) ou digite a URL correta: " jira_response
            if [[ $jira_response =~ ^[Yy]$ ]]; then
                JIRA_URL="https://suaempresa.atlassian.net/browse/$JIRA_TASK"
            elif [[ -n "$jira_response" && ! $jira_response =~ ^[Nn]$ ]]; then
                JIRA_URL="$jira_response"
            fi
        fi
    else
        read -p "🔗 URL completa da tarefa (opcional): " JIRA_URL
    fi
    
    # Documentação
    read -p "📚 URL da documentação (opcional): " DOC_URL
    
    # Workspace (específico para e-commerce) com sugestão inteligente
    local suggested_workspace=$(git_suggest_workspace_name)
    if [[ -n "$suggested_workspace" ]]; then
        echo -e "${GREEN}💡 Sugestão baseada na branch: $suggested_workspace${NC}"
        read -p "🏷️  Nome do workspace DEV (sugerido: $suggested_workspace, Enter para usar ou digite outro): " WORKSPACE_DEV_NAME
        WORKSPACE_DEV_NAME="${WORKSPACE_DEV_NAME:-$suggested_workspace}"
    else
        read -p "🏷️  Nome do workspace DEV (ex: feature-auth, opcional): " WORKSPACE_DEV_NAME
    fi
    
    if [[ -n "$WORKSPACE_DEV_NAME" ]]; then
        read -p "🏪 Nome da loja/projeto (ex: minhaloja, opcional): " WORKSPACE_STORE_NAME
        
        # Usar domínio automático do config
        local workspace_domain="${AUTO_WORKSPACE_DOMAIN:-myvtex.com}"
        
        # Construir URL do workspace automaticamente
        if [[ -n "$WORKSPACE_STORE_NAME" ]]; then
            WORKSPACE_URL="https://$WORKSPACE_DEV_NAME--$WORKSPACE_STORE_NAME.$workspace_domain"
            echo -e "${GREEN}✅ Workspace URL construída: $WORKSPACE_URL${NC}"
        else
            # Se só tem o nome do workspace, pedir URL completa
            read -p "🌐 URL completa do workspace: " WORKSPACE_URL
        fi
    fi
}

# Customizar template existente
template_interactive_customize() {
    log_step "Customizando template..."
    
    # Se o array está vazio, recarregar configuração
    if [[ ${#TEMPLATES[@]} -eq 0 ]]; then
        log_warning "Array TEMPLATES vazio, recarregando configuração..."
        template_load_config
    fi
    
    echo -e "${CYAN}Selecione template base para customizar:${NC}"
    
    local i=1
    local template_options=()
    
    for template_info in "${TEMPLATES[@]}"; do
        IFS=':' read -ra TEMPLATE_PARTS <<< "$template_info"
        local name="${TEMPLATE_PARTS[0]}"
        local description="${TEMPLATE_PARTS[2]}"
        local example="${TEMPLATE_PARTS[3]}"
        
        echo "$i) $description"
        echo "   💡 $example"
        template_options+=("$name")
        ((i++))
    done
    
    if [[ ${#template_options[@]} -eq 0 ]]; then
        log_error "Nenhuma opção de template disponível!"
        return 1
    fi
    
    read -p "Escolha template base (1-$((i-1))): " base_choice
    
    if [[ $base_choice -ge 1 && $base_choice -lt $i ]]; then
        local base_template="${template_options[$((base_choice-1))]}"
        template_create_custom "$base_template"
    else
        log_error "Opção inválida!"
        template_interactive_customize
    fi
}

# Criar template customizado
template_create_custom() {
    local base_template=$1
    local custom_name="custom-$(date +%s)"
    local base_file="$SCRIPT_DIR/templates/${base_template}.md"
    local custom_file="$SCRIPT_DIR/templates/${custom_name}.md"
    
    if [[ -f "$base_file" ]]; then
        cp "$base_file" "$custom_file"
        
        # Registrar o arquivo customizado para limpeza posterior
        CUSTOM_TEMPLATE_FILE="$custom_file"
        
        # Registrar no sistema de rollback
        if declare -f rollback_backup_file > /dev/null; then
            rollback_track_temp_file "$custom_file"
        fi
        
        log_info "Template customizado criado: $custom_name"
        
        echo -e "${YELLOW}Edite o arquivo: $custom_file${NC}"
        echo "Pressione Enter para continuar após editar..."
        read -r
        
        SELECTED_TEMPLATE="$custom_name"
    else
        log_error "Template base não encontrado: $base_file"
        template_interactive_select
    fi
}

# Processar template com variáveis
template_process() {
    local template_name=$1
    local template_file="$SCRIPT_DIR/templates/${template_name}.md"
    
    if [[ ! -f "$template_file" ]]; then
        log_error "Template não encontrado: $template_file"
        return 1
    fi
    
    # Ler template
    local template_content=$(<"$template_file")
    
    # Substituir variáveis básicas
    template_content=$(echo "$template_content" | sed "s/{{TITLE}}/$(template_escape "$(commit_get_description)")/g")
    template_content=$(echo "$template_content" | sed "s/{{DESCRIPTION}}/$(template_escape "$(commit_get_description)")/g")
    template_content=$(echo "$template_content" | sed "s/{{TYPE}}/$(commit_get_type)/g")
    template_content=$(echo "$template_content" | sed "s/{{AUTHOR}}/$(git config user.name 2>/dev/null || echo 'unknown')/g")
    template_content=$(echo "$template_content" | sed "s/{{CURRENT_VERSION}}/$(version_get_current)/g")
    template_content=$(echo "$template_content" | sed "s/{{NEW_VERSION}}/$(version_get_new)/g")
    template_content=$(echo "$template_content" | sed "s/{{BREAKING}}/$(if [[ "$(commit_is_breaking)" == true ]]; then echo "SIM"; else echo "NÃO"; fi)/g")
    template_content=$(echo "$template_content" | sed "s/{{VERSION_BUMP}}/$(version_get_bump)/g")
    template_content=$(echo "$template_content" | sed "s/{{RELATED_ISSUES}}/Relacionado a este hotfix de automacao/g")
    
    # Substituir variáveis condicionais
    local commit_body=$(commit_get_body)
    if [[ -n "$commit_body" ]]; then
        template_content=$(echo "$template_content" | sed "s/{{#if BODY}}//g")
        template_content=$(echo "$template_content" | sed "s/{{\/if}}//g")
        template_content=$(echo "$template_content" | sed "s/{{BODY}}/$(template_escape "$commit_body")/g")
    else
        # Remover seções condicionais vazias
        template_content=$(echo "$template_content" | sed '/{{#if BODY}}/,/{{\/if}}/d')
    fi
    
    local related_issue=$(commit_get_related_issue)
    if [[ -n "$related_issue" ]]; then
        template_content=$(echo "$template_content" | sed "s/{{#if RELATED_ISSUE}}//g")
        template_content=$(echo "$template_content" | sed "s/{{\/if}}//g")
        template_content=$(echo "$template_content" | sed "s/{{RELATED_ISSUE}}/$(template_escape "$related_issue")/g")
    else
        template_content=$(echo "$template_content" | sed '/{{#if RELATED_ISSUE}}/,/{{\/if}}/d')
    fi
    
    # Substituir campos extras
    if [[ -n "$JIRA_TASK" ]]; then
        template_content=$(echo "$template_content" | sed "s/{{JIRA_TASK}}/$(template_escape "$JIRA_TASK")/g")
    fi
    
    if [[ -n "$JIRA_URL" ]]; then
        template_content=$(echo "$template_content" | sed "s/{{JIRA_URL}}/$(template_escape "$JIRA_URL")/g")
    fi
    
    if [[ -n "$DOC_URL" ]]; then
        template_content=$(echo "$template_content" | sed "s/{{DOC_URL}}/$(template_escape "$DOC_URL")/g")
    fi
    
    if [[ -n "$WORKSPACE_URL" ]]; then
        template_content=$(echo "$template_content" | sed "s/{{WORKSPACE_URL}}/$(template_escape "$WORKSPACE_URL")/g")
    fi
    
    # Processar condicionais de tipo
    template_content=$(template_process_conditionals "$template_content")
    
    echo "$template_content"
}

# Processar condicionais do template
template_process_conditionals() {
    local content=$1
    local commit_type=$(commit_get_type)
    
    # Processar {{#ifEqual TYPE "valor"}}
    while [[ $content =~ \{\{#ifEqual[[:space:]]+TYPE[[:space:]]+\"([^\"]+)\"\}\}(.*?)\{\{else[[:space:]]+ifEqual[[:space:]]+TYPE[[:space:]]+\"([^\"]+)\"\}\}(.*?)\{\{else\}\}(.*?)\{\{/ifEqual\}\} ]]; do
        local check_type="${BASH_REMATCH[1]}"
        local if_content="${BASH_REMATCH[2]}"
        local elif_type="${BASH_REMATCH[3]}"
        local elif_content="${BASH_REMATCH[4]}"
        local else_content="${BASH_REMATCH[5]}"
        
        if [[ "$commit_type" == "$check_type" ]]; then
            content="${content//${BASH_REMATCH[0]}/$if_content}"
        elif [[ "$commit_type" == "$elif_type" ]]; then
            content="${content//${BASH_REMATCH[0]}/$elif_content}"
        else
            content="${content//${BASH_REMATCH[0]}/$else_content}"
        fi
    done
    
    # Processar {{#ifEqual TYPE "valor"}} simples
    while [[ $content =~ \{\{#ifEqual[[:space:]]+TYPE[[:space:]]+\"([^\"]+)\"\}\}(.*?)\{\{/ifEqual\}\} ]]; do
        local check_type="${BASH_REMATCH[1]}"
        local if_content="${BASH_REMATCH[2]}"
        
        if [[ "$commit_type" == "$check_type" ]]; then
            content="${content//${BASH_REMATCH[0]}/$if_content}"
        else
            content="${content//${BASH_REMATCH[0]}/}"
        fi
    done
    
    echo "$content"
}

# Escapar texto para template
template_escape() {
    local text=$1
    # Escapar caracteres especiais para sed
    echo "$text" | sed 's/[[\.*^$()+?{|]/\\&/g'
}

# Listar templates disponíveis
template_list() {
    log_info "Templates disponíveis:"
    
    for template_info in "${TEMPLATES[@]}"; do
        IFS=':' read -ra TEMPLATE_PARTS <<< "$template_info"
        local name="${TEMPLATE_PARTS[0]}"
        local description="${TEMPLATE_PARTS[2]}"
        local example="${TEMPLATE_PARTS[3]}"
        local file="${TEMPLATE_PARTS[1]}"
        
        echo "• $name ($description) - $file"
        echo "  💡 $example"
    done
}

# Obter template selecionado
template_get_selected() {
    echo "$SELECTED_TEMPLATE"
}

# Verificar se template existe
template_exists() {
    local template_name=$1
    local template_file="$SCRIPT_DIR/templates/${template_name}.md"
    [[ -f "$template_file" ]]
}

# Limpar templates customizados temporários
template_cleanup_custom() {
    if [[ -n "$CUSTOM_TEMPLATE_FILE" && -f "$CUSTOM_TEMPLATE_FILE" ]]; then
        log_info "Removendo template customizado temporário: $(basename "$CUSTOM_TEMPLATE_FILE")"
        rm -f "$CUSTOM_TEMPLATE_FILE"
        CUSTOM_TEMPLATE_FILE=""
    fi
}

# Limpar todos os templates customizados antigos (mais de 1 dia)
template_cleanup_old_custom() {
    local templates_dir="$SCRIPT_DIR/templates"
    if [[ -d "$templates_dir" ]]; then
        # Remover templates customizados com mais de 1 dia
        find "$templates_dir" -name "custom-*.md" -type f -mtime +1 -delete 2>/dev/null || true
        log_info "Templates customizados antigos removidos"
    fi
}
