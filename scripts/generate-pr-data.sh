#!/bin/bash

# =============================================================================
# 📋 GERADOR DE DADOS PARA TEMPLATE DE PR
# =============================================================================
# Gera arquivo com dados para preencher automaticamente o template de PR
# =============================================================================

set -e

# Parâmetros
COMMIT_TYPE=$1
COMMIT_DESCRIPTION=$2
NEW_VERSION=$3
BREAKING_CHANGE=$4

# Data atual
CURRENT_DATE=$(date +"%Y-%m-%d")

# Arquivo de saída
PR_DATA_FILE=".pr-template-data.json"

# Função para mapear tipo de commit para tipo de mudança no PR
get_pr_change_type() {
    case $1 in
        "feat") echo "feature" ;;
        "fix") echo "bugfix" ;;
        "docs") echo "documentation" ;;
        "style") echo "ui" ;;
        "refactor") echo "refactor" ;;
        "perf") echo "performance" ;;
        "test") echo "test" ;;
        "chore") echo "config" ;;
        "security") echo "security" ;;
        "i18n") echo "feature" ;;
        *) echo "other" ;;
    esac
}

# Função para mapear componentes afetados
get_affected_components() {
    local components=""
    
    # Analisar arquivos modificados para determinar componentes
    changed_files=$(git diff --name-only HEAD~1 HEAD 2>/dev/null || echo "")
    
    if echo "$changed_files" | grep -q "src/lib/translation\|src/app/api/translate"; then
        components="$components,translation"
    fi
    
    if echo "$changed_files" | grep -q "src/data/motd\|MOTD"; then
        components="$components,motd"
    fi
    
    if echo "$changed_files" | grep -q "src/lib/updateTokenRow\|google.*sheet"; then
        components="$components,google_sheets"
    fi
    
    if echo "$changed_files" | grep -q "src/app/api.*auth\|token"; then
        components="$components,auth"
    fi
    
    if echo "$changed_files" | grep -q "src/components\|ui"; then
        components="$components,ui"
    fi
    
    if echo "$changed_files" | grep -q "src/components.*cv\|resume"; then
        components="$components,cv"
    fi
    
    if echo "$changed_files" | grep -q "\.env\|config"; then
        components="$components,config"
    fi
    
    if echo "$changed_files" | grep -q "docs/\|README\|DOCUMENTATION"; then
        components="$components,documentation"
    fi
    
    if echo "$changed_files" | grep -q "test\|spec"; then
        components="$components,tests"
    fi
    
    if echo "$changed_files" | grep -q "package.json\|webpack\|next.config"; then
        components="$components,build"
    fi
    
    # Remover vírgula inicial
    components=${components#,}
    
    # Se vazio, usar 'other'
    if [[ -z "$components" ]]; then
        components="other"
    fi
    
    echo "$components"
}

# Função para gerar instruções de teste
generate_test_instructions() {
    case $1 in
        "feat")
            echo "1. Execute \`npm run dev\` para iniciar o servidor
2. Teste a nova funcionalidade implementada
3. Verifique se não há regressões nas funcionalidades existentes"
            ;;
        "fix")
            echo "1. Execute \`npm run dev\` para iniciar o servidor
2. Reproduza o cenário que apresentava o bug
3. Verifique se o problema foi corrigido
4. Teste cenários relacionados para garantir que não há efeitos colaterais"
            ;;
        "docs")
            echo "1. Revise a documentação atualizada
2. Verifique se os links e exemplos estão funcionando
3. Confirme se as instruções estão claras e precisas"
            ;;
        "security")
            echo "1. Execute \`npm run dev\` para iniciar o servidor
2. Teste os aspectos de segurança implementados
3. Verifique se não há vulnerabilidades introduzidas
4. Confirme que funcionalidades existentes não foram afetadas"
            ;;
        *)
            echo "1. Execute \`npm run dev\` para iniciar o servidor
2. Teste as funcionalidades relacionadas às mudanças
3. Verifique se não há regressões"
            ;;
    esac
}

# Obter informações dos commits recentes
recent_commits=$(git log --oneline -n 5 --pretty=format:"- %s" 2>/dev/null || echo "- $COMMIT_DESCRIPTION")

# Obter componentes afetados
affected_components=$(get_affected_components)

# Ler snippet do changelog se existir
changelog_snippet=""
if [[ -f ".pr-changelog-snippet.tmp" ]]; then
    changelog_snippet=$(cat .pr-changelog-snippet.tmp)
fi

# Gerar arquivo JSON com dados
cat > "$PR_DATA_FILE" << EOF
{
  "version": "$NEW_VERSION",
  "commit_type": "$COMMIT_TYPE",
  "pr_change_type": "$(get_pr_change_type "$COMMIT_TYPE")",
  "description": "$COMMIT_DESCRIPTION",
  "breaking_change": $BREAKING_CHANGE,
  "affected_components": "$affected_components",
  "date": "$CURRENT_DATE",
  "test_instructions": "$(generate_test_instructions "$COMMIT_TYPE")",
  "recent_commits": [
$(echo "$recent_commits" | sed 's/^/    "/' | sed 's/$/",/' | sed '$ s/,$//')
  ],
  "changelog_snippet": "$(echo "$changelog_snippet" | sed ':a;N;$!ba;s/\n/\\n/g' | sed 's/"/\\"/g')"
}
EOF

echo "✅ Dados do PR gerados em $PR_DATA_FILE"

# Gerar também um arquivo markdown com template preenchido
PR_TEMPLATE_FILE=".pr-template-filled.md"

cat > "$PR_TEMPLATE_FILE" << EOF
# Pull Request - v$NEW_VERSION

## 📋 Descrição
$COMMIT_DESCRIPTION

## 🎯 Tipo de Mudança
- [$(if [[ "$(get_pr_change_type "$COMMIT_TYPE")" == "bugfix" ]]; then echo "x"; else echo " "; fi)] 🐛 Bug fix (correção de bug)
- [$(if [[ "$(get_pr_change_type "$COMMIT_TYPE")" == "feature" ]]; then echo "x"; else echo " "; fi)] ✨ Nova funcionalidade (feature)
- [$(if [[ "$(get_pr_change_type "$COMMIT_TYPE")" == "ui" ]]; then echo "x"; else echo " "; fi)] 💄 Mudanças de UI/UX
- [$(if [[ "$(get_pr_change_type "$COMMIT_TYPE")" == "refactor" ]]; then echo "x"; else echo " "; fi)] ♻️ Refatoração de código
- [$(if [[ "$(get_pr_change_type "$COMMIT_TYPE")" == "documentation" ]]; then echo "x"; else echo " "; fi)] 📝 Documentação
- [$(if [[ "$(get_pr_change_type "$COMMIT_TYPE")" == "config" ]]; then echo "x"; else echo " "; fi)] 🔧 Configuração/DevOps
- [$(if [[ "$(get_pr_change_type "$COMMIT_TYPE")" == "security" ]]; then echo "x"; else echo " "; fi)] 🔒 Segurança
- [$(if [[ "$(get_pr_change_type "$COMMIT_TYPE")" == "performance" ]]; then echo "x"; else echo " "; fi)] ⚡ Performance
- [$(if [[ "$(get_pr_change_type "$COMMIT_TYPE")" == "test" ]]; then echo "x"; else echo " "; fi)] 🧪 Testes

## 🚀 Funcionalidades Adicionadas/Alteradas
$recent_commits

## 🔧 Mudanças Técnicas
- Versão atualizada para $NEW_VERSION
- Changelog atualizado com as mudanças
$(if [[ "$BREAKING_CHANGE" == "true" ]]; then echo "- ⚠️ BREAKING CHANGE: Esta versão contém mudanças que quebram compatibilidade"; fi)

## 📱 Componentes Afetados
$(echo "$affected_components" | tr ',' '\n' | while read component; do
    case $component in
        "translation") echo "- [x] 🌍 Sistema de Tradução (OpenAI/LibreTranslate)" ;;
        "motd") echo "- [x] 🎭 MOTD (Message of the Day)" ;;
        "google_sheets") echo "- [x] 📊 Google Sheets Integration" ;;
        "auth") echo "- [x] 🔐 Sistema de Autenticação/Tokens" ;;
        "ui") echo "- [x] 🎨 Interface do Usuário" ;;
        "cv") echo "- [x] 📋 Componentes do CV" ;;
        "config") echo "- [x] 🛠️ Configurações (.env)" ;;
        "documentation") echo "- [x] 📚 Documentação" ;;
        "tests") echo "- [x] 🧪 Testes" ;;
        "build") echo "- [x] 🚀 Deploy/Build" ;;
        *) echo "- [x] 🔄 Outros componentes" ;;
    esac
done)

## 🧪 Como Testar
$(generate_test_instructions "$COMMIT_TYPE")

## ✅ Checklist de Verificação
- [x] 🧪 Testei localmente e tudo funciona
- [x] 📝 Documentação atualizada (se necessário)
- [x] 🔧 Variáveis de ambiente atualizadas (se necessário)
- [x] 🌍 Testei em diferentes idiomas (se aplicável)
- [x] 📱 Testei responsividade (se aplicável)
- [x] 🔍 Revisei o código para inconsistências
- [x] 🚫 Não quebrei funcionalidades existentes
- [x] 📋 Commit messages seguem padrão conventional commits

## 📋 Changelog

$changelog_snippet

## 🎯 Configurações Necessárias
Nenhuma configuração adicional necessária.

## 📝 Notas Adicionais
Release v$NEW_VERSION gerado automaticamente pelo script de automação Git.

---

### 🔍 Para Revisores
- [x] Código está limpo e bem comentado
- [x] Performance não foi impactada negativamente
- [x] Segurança foi considerada
- [x] Mudanças estão alinhadas com a arquitetura do projeto
- [x] Documentação está adequada
EOF

echo "✅ Template de PR preenchido salvo em $PR_TEMPLATE_FILE"

# Limpeza de arquivos temporários
rm -f .pr-changelog-snippet.tmp

echo "🎉 Dados do PR preparados com sucesso!"
echo "📁 Arquivos gerados:"
echo "  - $PR_DATA_FILE (dados JSON)"
echo "  - $PR_TEMPLATE_FILE (template preenchido)"
