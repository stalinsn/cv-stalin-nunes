#!/bin/bash

# =============================================================================
# 🖥️ MÓDULO DE DETECÇÃO DE PLATAFORMA
# =============================================================================
# Detecta o sistema operacional e configura variáveis específicas
# =============================================================================

# Variáveis globais
PLATFORM=""
IS_WINDOWS=false
IS_LINUX=false
IS_MACOS=false

# Detectar plataforma atual
platform_detect() {
    if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
        PLATFORM="Windows (Git Bash)"
        IS_WINDOWS=true
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        PLATFORM="Linux"
        IS_LINUX=true
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        PLATFORM="macOS"
        IS_MACOS=true
    else
        PLATFORM="Unknown"
    fi
}

# Verificar se é Windows
platform_is_windows() {
    [[ "$IS_WINDOWS" == true ]]
}

# Verificar se é Linux
platform_is_linux() {
    [[ "$IS_LINUX" == true ]]
}

# Verificar se é macOS
platform_is_macos() {
    [[ "$IS_MACOS" == true ]]
}

# Obter plataforma atual
platform_get() {
    echo "$PLATFORM"
}
