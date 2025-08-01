#!/bin/bash

# =============================================================================
# 🔗 MÓDULO DE GERAÇÃO DE PULL REQUESTS
# =============================================================================
# Gera URLs de PR pré-preenchidos e resumos finais
# =============================================================================

# Gerar resumo final e links
pr_generate_summary() {
    log_step "Gerando resumo da operação..."
    
    _pr_show_summary
    _pr_generate_links
    _pr_show_resources
}

# Mostrar resumo da operação
_pr_show_summary() {
    local current_version=$(version_get_current)
    local new_version=$(version_get_new)
    local commit_title=$(commit_get_title)
    local is_breaking=$(commit_is_breaking)
    local platform=$(platform_get)
    local current_branch=$(branch_get_current)
    
    echo -e "${GREEN}✅ Automação concluída!${NC}"
    echo ""
    echo -e "${CYAN}📋 Resumo:${NC}"
    echo "• Plataforma: $platform"
    echo "• Branch: $current_branch"
    echo "• Commit: $commit_title"
    echo "• Versão: $current_version → $new_version"
    echo "• Breaking: $(if [[ "$is_breaking" == true ]]; then echo "SIM"; else echo "NÃO"; fi)"
    echo ""
}

# Gerar links úteis
_pr_generate_links() {
    local base_url=$(git_get_base_url)
    
    if [[ -n "$base_url" ]]; then
        local current_branch=$(branch_get_current)
        local new_version=$(version_get_new)
        
        local branch_url="$base_url/tree/$current_branch"
        local releases_url="$base_url/releases"
        
        echo -e "${CYAN}🔗 Links:${NC}"
        echo "• 🌿 Branch: $branch_url"
        echo "• 🏷️  Releases: $releases_url"
        echo ""
        
        # Gerar URL do PR pré-preenchido com template
        _pr_generate_url_with_template "$base_url"
    fi
}

# Gerar URL do PR com template selecionado
_pr_generate_url_with_template() {
    local base_url=$1
    local current_branch=$(branch_get_current)
    
    # Verificar se template foi selecionado
    local selected_template=$(template_get_selected)
    if [[ -z "$selected_template" ]]; then
        selected_template="default"
    fi
    
    # Processar template
    log_info "Processando template: $selected_template"
    local pr_body_raw=$(template_process "$selected_template")
    
    if [[ $? -ne 0 ]]; then
        log_warning "Erro ao processar template, usando padrão"
        pr_body_raw=$(pr_generate_template)
    fi
    
    # Escapar para URL
    local pr_title=$(_pr_url_encode "$(commit_get_title)")
    local pr_body=$(_pr_url_encode "$pr_body_raw")
    
    # Gerar URL sem espaços ou quebras
    local pr_url="${base_url}/compare/${current_branch}?expand=1&title=${pr_title}&body=${pr_body}"
    
    echo -e "${YELLOW}🔗 CRIAR PR PRÉ-PREENCHIDO (Template: $selected_template):${NC}"
    echo "$pr_url"
    echo ""
    echo -e "${GREEN}✨ Link já preenche título, descrição e checklist customizados!${NC}"
}

# Codificar string para URL
_pr_url_encode() {
    local string=$1
    
    # Primeiro converter quebras de linha para %0A
    string=$(echo "$string" | tr '\n' '\001')
    
    # Encoding completo para caracteres comuns
    echo "$string" | sed \
        -e 's/\001/%0A/g' \
        -e 's/ /%20/g' \
        -e 's/&/%26/g' \
        -e 's/(/\%28/g' \
        -e 's/)/\%29/g' \
        -e 's/:/%3A/g' \
        -e 's/#/%23/g' \
        -e 's/\?/%3F/g' \
        -e 's/=/%3D/g' \
        -e 's/\[/%5B/g' \
        -e 's/\]/%5D/g' \
        -e 's/{/%7B/g' \
        -e 's/}/%7D/g' \
        -e 's/|/%7C/g' \
        -e 's/\\/%5C/g' \
        -e 's/"/%22/g' \
        -e "s/'/%27/g" \
        -e 's/`/%60/g' \
        -e 's/</%3C/g' \
        -e 's/>/%3E/g' \
        -e 's/\+/%2B/g' \
        -e 's/ç/%C3%A7/g' \
        -e 's/ã/%C3%A3/g' \
        -e 's/õ/%C3%B5/g' \
        -e 's/á/%C3%A1/g' \
        -e 's/é/%C3%A9/g' \
        -e 's/í/%C3%AD/g' \
        -e 's/ó/%C3%B3/g' \
        -e 's/ú/%C3%BA/g' \
        -e 's/â/%C3%A2/g' \
        -e 's/ê/%C3%AA/g' \
        -e 's/î/%C3%AE/g' \
        -e 's/ô/%C3%B4/g' \
        -e 's/û/%C3%BB/g' \
        -e 's/à/%C3%A0/g' \
        -e 's/è/%C3%A8/g' \
        -e 's/ì/%C3%AC/g' \
        -e 's/ò/%C3%B2/g' \
        -e 's/ù/%C3%B9/g'
}

# Mostrar recursos criados
_pr_show_resources() {
    local new_version=$(version_get_new)
    
    echo -e "${CYAN}📦 Recursos:${NC}"
    echo "• 🏷️  Tag: v$new_version"
    echo "• 📖 Changelog atualizado"
    echo "• 📦 Package.json versionado"
    echo ""
    echo -e "${GREEN}🎉 Happy coding!${NC}"
}

# Gerar template de PR
pr_generate_template() {
    local commit_description=$(commit_get_description)
    local commit_body=$(commit_get_body)
    local commit_type=$(commit_get_type)
    local current_version=$(version_get_current)
    local new_version=$(version_get_new)
    local is_breaking=$(commit_is_breaking)
    local related_issue=$(commit_get_related_issue)
    
    cat << EOF
## Descrição
$commit_description

$(if [[ -n "$commit_body" ]]; then echo "$commit_body"; echo ""; fi)

## Tipo
- [x] $commit_type

## Impacto
- Versão: $current_version para $new_version
- Breaking: $(if [[ "$is_breaking" == true ]]; then echo "SIM"; else echo "NÃO"; fi)

## Checklist
- [x] Testado localmente
- [x] Changelog atualizado
- [x] Versão incrementada

$(if [[ -n "$related_issue" ]]; then echo "Closes $related_issue"; fi)
EOF
}

# Validar dados para PR
pr_validate_data() {
    local base_url=$(git_get_base_url)
    
    if [[ -z "$base_url" ]]; then
        log_warning "Repositório não é do GitHub - PR não será gerado"
        return 1
    fi
    
    if [[ -z "$(commit_get_title)" ]]; then
        log_error "Título do commit não encontrado"
        return 1
    fi
    
    return 0
}
