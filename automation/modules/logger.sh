#!/bin/bash

# =============================================================================
# 📝 MÓDULO DE LOGGING
# =============================================================================
# Sistema de logging colorido e estruturado
# =============================================================================

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
GRAY='\033[0;37m'
NC='\033[0m'

# Inicializar logger
logger_init() {
    # Verificar se o terminal suporta cores
    if [[ ! -t 1 ]]; then
        # Se não for um terminal, desabilitar cores
        RED=""
        GREEN=""
        YELLOW=""
        BLUE=""
        MAGENTA=""
        CYAN=""
        NC=""
    fi
}

# Funções de log
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

log_debug() {
    if [[ "${DEBUG:-false}" == "true" ]]; then
        echo -e "${GRAY}🔍 DEBUG: $1${NC}"
    fi
}

log_step() {
    echo -e "${MAGENTA}🔄 $1${NC}"
}

log_highlight() {
    echo -e "${CYAN}🎯 $1${NC}"
}

# Log com timestamp
log_with_time() {
    local level=$1
    local message=$2
    local timestamp=$(date '+%H:%M:%S')
    
    case $level in
        "INFO") log_info "[$timestamp] $message" ;;
        "SUCCESS") log_success "[$timestamp] $message" ;;
        "WARNING") log_warning "[$timestamp] $message" ;;
        "ERROR") log_error "[$timestamp] $message" ;;
        "STEP") log_step "[$timestamp] $message" ;;
        *) echo "[$timestamp] $message" ;;
    esac
}

# Separador visual
log_separator() {
    echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
}
