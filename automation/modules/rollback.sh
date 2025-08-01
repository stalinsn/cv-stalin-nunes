#!/bin/bash

# =============================================================================
# 🔄 MÓDULO DE REVERSÃO/ROLLBACK
# =============================================================================
# Sistema para desfazer operações do git flow se cancelado
# =============================================================================

# Variáveis globais para tracking
ROLLBACK_ENABLED=false
ORIGINAL_BRANCH=""
ORIGINAL_VERSION=""
BACKUP_FILES=()
COMMITS_MADE=()
TAGS_CREATED=()
TEMP_FILES=()  # Para arquivos temporários criados

# Inicializar sistema de rollback
rollback_init() {
    ROLLBACK_ENABLED=true
    ORIGINAL_BRANCH=$(git branch --show-current)
    # Versão será capturada depois quando o módulo de versionamento estiver carregado
    
    log_info "🔄 Sistema de reversão ativado"
    log_info "   Branch original: $ORIGINAL_BRANCH"
}

# Registrar arquivo para backup
rollback_backup_file() {
    local file_path=$1
    
    if [[ ! "$ROLLBACK_ENABLED" == true ]]; then
        return 0
    fi
    
    if [[ -f "$file_path" ]]; then
        local backup_name="${file_path}.backup-$(date +%s)"
        cp "$file_path" "$backup_name"
        BACKUP_FILES+=("$file_path:$backup_name")
        log_info "📋 Backup criado: $backup_name"
    fi
}

# Registrar commit feito
rollback_register_commit() {
    local commit_hash=$1
    
    if [[ ! "$ROLLBACK_ENABLED" == true ]]; then
        return 0
    fi
    
    COMMITS_MADE+=("$commit_hash")
    log_info "📝 Commit registrado para rollback: $commit_hash"
}

# Registrar tag criada
rollback_register_tag() {
    local tag_name=$1
    
    if [[ ! "$ROLLBACK_ENABLED" == true ]]; then
        return 0
    fi
    
    TAGS_CREATED+=("$tag_name")
    log_info "🏷️  Tag registrada para rollback: $tag_name"
}

# Registrar arquivo temporário para limpeza
rollback_track_temp_file() {
    local temp_file=$1
    
    if [[ ! "$ROLLBACK_ENABLED" == true ]]; then
        return 0
    fi
    
    TEMP_FILES+=("$temp_file")
    log_info "📄 Arquivo temporário registrado: $(basename "$temp_file")"
}

# Executar rollback completo
rollback_execute() {
    if [[ ! "$ROLLBACK_ENABLED" == true ]]; then
        log_warning "Sistema de rollback não foi inicializado"
        return 1
    fi
    
    log_step "🔄 Executando rollback completo..."
    
    # 1. Voltar para branch original
    if [[ -n "$ORIGINAL_BRANCH" && "$ORIGINAL_BRANCH" != "$(git branch --show-current)" ]]; then
        log_info "🌿 Voltando para branch: $ORIGINAL_BRANCH"
        git checkout "$ORIGINAL_BRANCH" 2>/dev/null || true
    fi
    
    # 2. Remover tags criadas
    for tag in "${TAGS_CREATED[@]}"; do
        if git tag -l | grep -q "^$tag$"; then
            log_info "🗑️  Removendo tag: $tag"
            git tag -d "$tag" 2>/dev/null || true
        fi
    done
    
    # 3. Remover commits (reset hard para posição anterior)
    if [[ ${#COMMITS_MADE[@]} -gt 0 ]]; then
        log_info "⏪ Desfazendo commits..."
        git reset --hard HEAD~${#COMMITS_MADE[@]} 2>/dev/null || true
    fi
    
    # 4. Restaurar arquivos de backup
    for backup_info in "${BACKUP_FILES[@]}"; do
        IFS=':' read -ra BACKUP_PARTS <<< "$backup_info"
        local original_file="${BACKUP_PARTS[0]}"
        local backup_file="${BACKUP_PARTS[1]}"
        
        if [[ -f "$backup_file" ]]; then
            log_info "📁 Restaurando: $original_file"
            cp "$backup_file" "$original_file"
            rm -f "$backup_file"
        fi
    done
    
    # 5. Limpar arquivos temporários
    for temp_file in "${TEMP_FILES[@]}"; do
        if [[ -f "$temp_file" ]]; then
            log_info "🗑️  Removendo arquivo temporário: $(basename "$temp_file")"
            rm -f "$temp_file"
        fi
    done
    
    log_success "✅ Rollback concluído! Estado restaurado."
    log_info "   Branch: $ORIGINAL_BRANCH"
    log_info "   Versão: $ORIGINAL_VERSION"
}

# Rollback parcial (só até a criação da branch)
rollback_to_branch_creation() {
    if [[ ! "$ROLLBACK_ENABLED" == true ]]; then
        log_warning "Sistema de rollback não foi inicializado"
        return 1
    fi
    
    log_step "🔄 Rollback até criação da branch..."
    
    # Só restaurar arquivos e remover commits
    # Manter branch atual se foi criada nova
    
    # 1. Remover tags criadas
    for tag in "${TAGS_CREATED[@]}"; do
        if git tag -l | grep -q "^$tag$"; then
            log_info "🗑️  Removendo tag: $tag"
            git tag -d "$tag" 2>/dev/null || true
        fi
    done
    
    # 2. Remover commits
    if [[ ${#COMMITS_MADE[@]} -gt 0 ]]; then
        log_info "⏪ Desfazendo commits..."
        git reset --hard HEAD~${#COMMITS_MADE[@]} 2>/dev/null || true
    fi
    
    # 3. Restaurar arquivos
    for backup_info in "${BACKUP_FILES[@]}"; do
        IFS=':' read -ra BACKUP_PARTS <<< "$backup_info"
        local original_file="${BACKUP_PARTS[0]}"
        local backup_file="${BACKUP_PARTS[1]}"
        
        if [[ -f "$backup_file" ]]; then
            log_info "📁 Restaurando: $original_file"
            cp "$backup_file" "$original_file"
            rm -f "$backup_file"
        fi
    done
    
    # 4. Limpar arquivos temporários
    for temp_file in "${TEMP_FILES[@]}"; do
        if [[ -f "$temp_file" ]]; then
            log_info "🗑️  Removendo arquivo temporário: $(basename "$temp_file")"
            rm -f "$temp_file"
        fi
    done
    
    log_success "✅ Rollback parcial concluído!"
    log_info "   Branch mantida: $(git branch --show-current)"
    log_info "   Arquivos restaurados para versão: $ORIGINAL_VERSION"
}

# Limpar arquivos de backup
rollback_cleanup() {
    if [[ ! "$ROLLBACK_ENABLED" == true ]]; then
        return 0
    fi
    
    log_info "🧹 Limpando backups temporários..."
    
    for backup_info in "${BACKUP_FILES[@]}"; do
        IFS=':' read -ra BACKUP_PARTS <<< "$backup_info"
        local backup_file="${BACKUP_PARTS[1]}"
        
        if [[ -f "$backup_file" ]]; then
            rm -f "$backup_file"
        fi
    done
    
    # Limpar arquivos temporários também
    for temp_file in "${TEMP_FILES[@]}"; do
        if [[ -f "$temp_file" ]]; then
            rm -f "$temp_file"
        fi
    done
    
    log_info "✅ Backups e arquivos temporários removidos"
}

# Verificar se há mudanças para fazer rollback
rollback_has_changes() {
    if [[ ! "$ROLLBACK_ENABLED" == true ]]; then
        return 1
    fi
    
    [[ ${#COMMITS_MADE[@]} -gt 0 || ${#TAGS_CREATED[@]} -gt 0 || ${#BACKUP_FILES[@]} -gt 0 ]]
}

# Mostrar resumo do que será desfeito
rollback_show_summary() {
    if [[ ! "$ROLLBACK_ENABLED" == true ]]; then
        return 0
    fi
    
    echo -e "${YELLOW}🔄 O que a opção 'n' irá desfazer:${NC}"
    echo ""
    
    if [[ ${#COMMITS_MADE[@]} -gt 0 ]]; then
        echo "📝 Commits de automação: ${#COMMITS_MADE[@]} (versionamento/changelog)"
    fi
    
    if [[ ${#TAGS_CREATED[@]} -gt 0 ]]; then
        echo "🏷️  Tags criadas: ${TAGS_CREATED[*]}"
    fi
    
    if [[ ${#BACKUP_FILES[@]} -gt 0 ]]; then
        echo "📁 Arquivos de configuração: package.json, CHANGELOG.md"
    fi
    
    echo "🌿 Branch atual: $(git branch --show-current)"
    echo "⬅️  Vai voltar para: $ORIGINAL_BRANCH"
    echo ""
    echo -e "${GREEN}✅ Preservados: TODOS os seus arquivos de código!${NC}"
    echo ""
}
