#!/bin/bash

# =============================================================================
# 🚀 AUTOMAÇÃO DE GIT FLOW - VERSÃO MODULAR v3.0
# =============================================================================
# Automatiza criação de commits, versionamento e releases
# Suporta: conventional commits, semantic versioning, PR templates
# Compatível: Windows (Git Bash), Linux, macOS
# =============================================================================
# 
# ESTRUTURA MODULAR EXPORTÁVEL:
# - Pode ser copiado para qualquer projeto
# - Módulos independentes e reutilizáveis
# - Configuração centralizada
# =============================================================================

set -e

# Detectar diretório do script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MODULES_DIR="$SCRIPT_DIR/modules"

# Carregar módulos
source "$MODULES_DIR/platform.sh"
source "$MODULES_DIR/logger.sh"
source "$MODULES_DIR/rollback.sh"
source "$MODULES_DIR/git-utils.sh"
source "$MODULES_DIR/commit-builder.sh"
source "$MODULES_DIR/versioning.sh"
source "$MODULES_DIR/branch-manager.sh"
source "$MODULES_DIR/changelog.sh"
source "$MODULES_DIR/template-manager.sh"
source "$MODULES_DIR/pr-generator.sh"

# =============================================================================
# FLUXO PRINCIPAL
# =============================================================================
main() {
    # 1. Inicialização
    platform_detect
    logger_init
    log_step "🚀 Iniciando Git Flow Automation v3.0"
    log_info "📱 Plataforma: $PLATFORM"
    
    # 2. Verificações
    git_verify_repository
    git_check_status
    
    # 3. Ativar sistema de reversão após verificações
    rollback_init
    
    # 4. Configuração do commit
    commit_interactive_setup
    
    # 5. Gerenciamento de branch
    branch_interactive_management
    
    # 6. Seleção de template de PR
    template_interactive_select
    
    # 7. Versionamento
    version_interactive_setup
    
    # 8. Capturar versão original para rollback
    ORIGINAL_VERSION=$(version_get_current)
    
    # 9. Fazer backup dos arquivos que serão modificados
    rollback_backup_file "package.json"
    rollback_backup_file "CHANGELOG.md"
    
    # 10. Atualizar arquivos de versionamento
    version_update_files
    changelog_generate
    
    # 11. Execução do commit
    local commit_hash=$(git_execute_commit)
    rollback_register_commit "$commit_hash"
    
    # 12. Criar tag da versão
    git_create_tag "$NEW_VERSION"
    
    # 13. Push e finalização
    git_interactive_push
    pr_generate_summary
    
    log_success "🎉 Automação concluída com sucesso!"
}

# Executar se chamado diretamente
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
