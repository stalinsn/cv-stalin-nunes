#!/bin/bash

# =============================================================================
# 📋 GERADOR AUTOMÁTICO DE CHANGELOG
# =============================================================================
# Gera/atualiza o CHANGELOG.md baseado nos commits e versionamento
# =============================================================================

set -e

# Parâmetros
NEW_VERSION=$1
COMMIT_TYPE=$2
COMMIT_DESCRIPTION=$3
BREAKING_CHANGE=$4

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Data atual
CURRENT_DATE=$(date +"%Y-%m-%d")

# Arquivo de changelog
CHANGELOG_FILE="CHANGELOG.md"

# Criar arquivo se não existir
if [[ ! -f "$CHANGELOG_FILE" ]]; then
    cat > "$CHANGELOG_FILE" << EOF
# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [Unreleased]

EOF
fi

# Função para mapear tipo de commit para categoria
get_category() {
    case $1 in
        "feat") echo "### ✨ Adicionado" ;;
        "fix") echo "### 🐛 Corrigido" ;;
        "docs") echo "### 📝 Documentação" ;;
        "style") echo "### 💄 Estilo" ;;
        "refactor") echo "### ♻️ Refatorado" ;;
        "perf") echo "### ⚡ Performance" ;;
        "test") echo "### 🧪 Testes" ;;
        "chore") echo "### 🔧 Manutenção" ;;
        "security") echo "### 🔒 Segurança" ;;
        "i18n") echo "### 🌐 Internacionalização" ;;
        *) echo "### 🔄 Mudanças" ;;
    esac
}

# Função para gerar emoji baseado no tipo
get_emoji() {
    case $1 in
        "feat") echo "✨" ;;
        "fix") echo "🐛" ;;
        "docs") echo "📝" ;;
        "style") echo "💄" ;;
        "refactor") echo "♻️" ;;
        "perf") echo "⚡" ;;
        "test") echo "🧪" ;;
        "chore") echo "🔧" ;;
        "security") echo "🔒" ;;
        "i18n") echo "🌐" ;;
        *) echo "🔄" ;;
    esac
}

# Preparar nova entrada
NEW_ENTRY=""
CATEGORY=$(get_category "$COMMIT_TYPE")
EMOJI=$(get_emoji "$COMMIT_TYPE")

# Seção da versão
NEW_ENTRY="## [$NEW_VERSION] - $CURRENT_DATE

$CATEGORY

- $EMOJI $COMMIT_DESCRIPTION"

# Adicionar breaking changes se houver
if [[ "$BREAKING_CHANGE" == "true" ]]; then
    NEW_ENTRY="$NEW_ENTRY

### 💥 BREAKING CHANGES

- Esta versão contém mudanças que quebram compatibilidade"
fi

NEW_ENTRY="$NEW_ENTRY

"

# Inserir nova entrada após o cabeçalho
temp_file=$(mktemp)

# Encontrar linha onde inserir (após "## [Unreleased]")
awk -v new_entry="$NEW_ENTRY" '
    /^## \[Unreleased\]/ {
        print $0
        print ""
        print new_entry
        next
    }
    { print }
' "$CHANGELOG_FILE" > "$temp_file"

mv "$temp_file" "$CHANGELOG_FILE"

echo -e "${GREEN}✅ CHANGELOG atualizado para versão $NEW_VERSION${NC}"

# Gerar resumo das últimas 5 versões para usar no PR
echo -e "${BLUE}📋 Gerando resumo para PR...${NC}"

# Extrair últimas mudanças para arquivo temporário (usado pelo script de PR)
awk '
    /^## \['"$NEW_VERSION"'\]/ { in_current=1; print; next }
    /^## \[/ && in_current { exit }
    in_current { print }
' "$CHANGELOG_FILE" > .pr-changelog-snippet.tmp

echo -e "${YELLOW}📝 Snippet do changelog salvo em .pr-changelog-snippet.tmp${NC}"
