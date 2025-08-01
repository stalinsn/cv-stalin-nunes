#!/bin/bash

# =============================================================================
# 🔄 SCRIPT DE MIGRAÇÃO PARA VERSÃO MODULAR
# =============================================================================
# Facilita a transição do script monolítico para a versão modular
# =============================================================================

set -e

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔄 Migrando para Git Flow Automation v3.0 (Modular)${NC}"
echo

# Verificar se estamos no diretório correto
if [[ ! -f "package.json" ]]; then
    echo -e "${YELLOW}⚠️  Certifique-se de estar no diretório raiz do projeto${NC}"
    exit 1
fi

# Verificar se a pasta automation existe
if [[ ! -d "automation" ]]; then
    echo -e "${YELLOW}⚠️  Pasta 'automation' não encontrada!${NC}"
    echo "Execute este script no diretório onde a pasta automation foi criada."
    exit 1
fi

echo -e "${GREEN}✅ Estrutura modular detectada!${NC}"
echo

# Verificar comandos do package.json
if grep -q "gitflow.*automation/git-flow.sh" package.json; then
    echo -e "${GREEN}✅ package.json já atualizado${NC}"
else
    echo -e "${YELLOW}⚠️  Atualizando package.json...${NC}"
    # Backup do package.json
    cp package.json package.json.backup
    
    # Atualizar script gitflow
    if grep -q '"gitflow"' package.json; then
        sed -i.tmp 's|"gitflow": "bash ./scripts/automate-git-flow-v2.sh"|"gitflow": "bash ./automation/git-flow.sh"|' package.json
        rm -f package.json.tmp
        echo -e "${GREEN}✅ Script gitflow atualizado${NC}"
    fi
fi

echo

# Testar a nova estrutura
echo -e "${BLUE}🧪 Testando estrutura modular...${NC}"

# Verificar se todos os módulos existem
modules=(
    "automation/modules/platform.sh"
    "automation/modules/logger.sh"
    "automation/modules/git-utils.sh"
    "automation/modules/commit-builder.sh"
    "automation/modules/versioning.sh"
    "automation/modules/branch-manager.sh"
    "automation/modules/changelog.sh"
    "automation/modules/template-manager.sh"
    "automation/modules/pr-generator.sh"
)

all_modules_ok=true
for module in "${modules[@]}"; do
    if [[ -f "$module" ]]; then
        echo -e "${GREEN}✅ $module${NC}"
    else
        echo -e "${YELLOW}⚠️  $module - não encontrado${NC}"
        all_modules_ok=false
    fi
done

if [[ "$all_modules_ok" == true ]]; then
    echo -e "${GREEN}✅ Todos os módulos estão presentes!${NC}"
else
    echo -e "${YELLOW}⚠️  Alguns módulos estão faltando${NC}"
    exit 1
fi

echo

# Verificar permissões
if [[ -x "automation/git-flow.sh" ]]; then
    echo -e "${GREEN}✅ Script principal executável${NC}"
else
    echo -e "${YELLOW}⚠️  Tornando script executável...${NC}"
    chmod +x automation/git-flow.sh
    echo -e "${GREEN}✅ Permissões corrigidas${NC}"
fi

echo

# Resumo da migração
echo -e "${BLUE}📋 Resumo da Migração:${NC}"
echo
echo -e "${GREEN}✅ Estrutura Modular:${NC}"
echo "  • 📁 automation/ - Pasta principal"
echo "  • 🔧 9 módulos especializados"
echo "  • 📋 4 templates de PR personalizáveis"
echo "  • ⚙️  Configurações personalizáveis"
echo "  • 📚 Documentação completa"
echo
echo -e "${GREEN}✅ Comandos Disponíveis:${NC}"
echo "  • yarn gitflow     - Nova versão modular"
echo "  • npm run gitflow  - Nova versão modular (alternativa)"
echo "  • ./automation/git-flow.sh - Execução direta"
echo
echo -e "${GREEN}✅ Exportabilidade:${NC}"
echo "  • Copie apenas a pasta 'automation/'"
echo "  • Use em qualquer projeto Git"
echo "  • Sem dependências externas obrigatórias"
echo

# Teste rápido
echo -e "${BLUE}🚀 Teste Rápido:${NC}"
echo "Execute: yarn gitflow --help (em breve)"
echo "Ou:      ./automation/git-flow.sh"
echo

echo -e "${GREEN}🎉 Migração concluída com sucesso!${NC}"
echo -e "${BLUE}💡 A versão modular está pronta para uso!${NC}"
