# =============================================================================
# 🚀 SCRIPT DE AUTOMAÇÃO MULTIPLATAFORMA - Git Flow v2.0 (PowerShell)
# =============================================================================
# Versão PowerShell para Windows nativo
# =============================================================================

param(
    [switch]$Help
)

if ($Help) {
    Write-Host "🚀 Git Flow Automation v2.0 - PowerShell Edition" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Uso:" -ForegroundColor Yellow
    Write-Host "  .\automate-git-flow-v2.ps1"
    Write-Host ""
    Write-Host "Este script automatiza:"
    Write-Host "• Criação automática de branch"
    Write-Host "• Conventional commits"
    Write-Host "• Versionamento automático"
    Write-Host "• Changelog automático"
    Write-Host "• Template de PR"
    Write-Host "• Push para repositório"
    exit
}

# Função para log colorido
function Write-LogInfo { param($Message) Write-Host "ℹ️  $Message" -ForegroundColor Blue }
function Write-LogSuccess { param($Message) Write-Host "✅ $Message" -ForegroundColor Green }
function Write-LogWarning { param($Message) Write-Host "⚠️  $Message" -ForegroundColor Yellow }
function Write-LogError { param($Message) Write-Host "❌ $Message" -ForegroundColor Red }
function Write-LogStep { param($Message) Write-Host "🚀 $Message" -ForegroundColor Magenta }

# Verificar se estamos em um repositório Git
try {
    git rev-parse --git-dir | Out-Null
} catch {
    Write-LogError "Este diretório não é um repositório Git!"
    exit 1
}

Write-Host "🖥️  Plataforma detectada: Windows (PowerShell)" -ForegroundColor Cyan
Write-LogStep "Iniciando fluxo de automação Git Flow v2.0..."

# Verificar estado do repositório
Write-LogInfo "Verificando estado do repositório..."
$currentBranch = git branch --show-current
Write-LogInfo "Branch atual: $currentBranch"

$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-LogInfo "Arquivos modificados encontrados:"
    git status --short
} else {
    Write-LogWarning "Nenhum arquivo modificado encontrado!"
    $continue = Read-Host "Deseja continuar mesmo assim? (y/N)"
    if ($continue -ne "y" -and $continue -ne "Y") {
        Write-LogInfo "Operação cancelada."
        exit 0
    }
}

# Seleção do tipo de commit
Write-LogStep "Selecionando tipo de commit..."
Write-Host "Selecione o tipo de commit:" -ForegroundColor Cyan
Write-Host "1) 🆕 feat      - Nova funcionalidade"
Write-Host "2) 🐛 fix       - Correção de bug"
Write-Host "3) 📝 docs      - Documentação"
Write-Host "4) 💄 style     - Formatação/estilo"
Write-Host "5) ♻️  refactor - Refatoração"
Write-Host "6) ⚡ perf      - Performance"
Write-Host "7) 🧪 test      - Testes"
Write-Host "8) 🔧 chore     - Tarefas de build/ferramentas"
Write-Host "9) 🔒 security  - Segurança"
Write-Host "10) 🌐 i18n     - Internacionalização"

$commitTypeNum = Read-Host "Digite o número (1-10)"

$commitTypes = @{
    "1" = "feat"
    "2" = "fix"
    "3" = "docs"
    "4" = "style"
    "5" = "refactor"
    "6" = "perf"
    "7" = "test"
    "8" = "chore"
    "9" = "security"
    "10" = "i18n"
}

if (-not $commitTypes.ContainsKey($commitTypeNum)) {
    Write-LogError "Opção inválida!"
    exit 1
}

$commitType = $commitTypes[$commitTypeNum]

# Capturar informações do commit
Write-LogStep "Coletando informações do commit..."
$commitDescription = Read-Host "📝 Descrição curta do commit"
$commitScope = Read-Host "🎯 Escopo (opcional, ex: auth, ui, api)"
$breakingChangeInput = Read-Host "💥 Breaking change? (y/N)"
$breakingChange = $breakingChangeInput -eq "y" -or $breakingChangeInput -eq "Y"

$breakingDescription = ""
if ($breakingChange) {
    $breakingDescription = Read-Host "📋 Descrição do breaking change"
}

$commitBody = Read-Host "📋 Descrição detalhada (opcional)"
$relatedIssue = Read-Host "🔗 Issue relacionada (opcional, ex: #123)"

# Função para gerar nome da branch
function Generate-BranchName {
    param($Type, $Scope, $Description)
    
    $cleanDescription = $Description.ToLower() -replace '[^a-z0-9]', '-' -replace '-+', '-' -replace '^-|-$', ''
    
    if ($Scope) {
        return "$Type/$Scope-$cleanDescription"
    } else {
        return "$Type/$cleanDescription"
    }
}

# Gerenciamento de branch
Write-LogStep "Gerenciando branch de desenvolvimento..."

if ($currentBranch -eq "main" -or $currentBranch -eq "master") {
    Write-LogInfo "Você está na branch principal ($currentBranch)"
    
    $newBranch = Generate-BranchName $commitType $commitScope $commitDescription
    
    Write-Host "Opções de branch:" -ForegroundColor Cyan
    Write-Host "1) 🌿 Criar nova branch: $newBranch"
    Write-Host "2) 📝 Especificar nome customizado"
    Write-Host "3) 🚀 Continuar na branch atual ($currentBranch)"
    
    $branchOption = Read-Host "Escolha uma opção (1-3)"
    
    switch ($branchOption) {
        "1" {
            Write-LogInfo "Criando nova branch: $newBranch"
            git checkout -b $newBranch
            $currentBranch = $newBranch
        }
        "2" {
            $customBranch = Read-Host "🌿 Nome da nova branch"
            Write-LogInfo "Criando nova branch: $customBranch"
            git checkout -b $customBranch
            $currentBranch = $customBranch
        }
        "3" {
            Write-LogWarning "Continuando na branch principal. Certifique-se de que isso é intencional!"
        }
        default {
            Write-LogError "Opção inválida!"
            exit 1
        }
    }
} else {
    Write-LogInfo "Continuando na branch atual: $currentBranch"
}

# Construir mensagem de commit
Write-LogStep "Construindo mensagem de commit..."

$commitTitle = if ($commitScope) { "$commitType($commitScope): $commitDescription" } else { "$commitType: $commitDescription" }

if ($breakingChange) {
    $commitTitle += "!"
}

$commitMessage = $commitTitle

if ($commitBody) {
    $commitMessage += "`n`n$commitBody"
}

if ($breakingChange -and $breakingDescription) {
    $commitMessage += "`n`nBREAKING CHANGE: $breakingDescription"
}

if ($relatedIssue) {
    $commitMessage += "`n`nCloses $relatedIssue"
}

Write-LogInfo "Mensagem de commit construída:"
Write-Host $commitMessage -ForegroundColor Cyan

# Versionamento
Write-LogStep "Determinando versionamento..."

$currentVersion = "0.0.0"
if (Test-Path "package.json") {
    try {
        $packageJson = Get-Content "package.json" | ConvertFrom-Json
        $currentVersion = $packageJson.version
    } catch {
        Write-LogWarning "Erro ao ler package.json, usando versão padrão"
    }
}

Write-LogInfo "Versão atual: $currentVersion"

$versionBump = switch ($commitType) {
    { $_ -in @("feat") } {
        if ($breakingChange) { "major" } else { "minor" }
    }
    { $_ -in @("fix", "security", "perf") } {
        if ($breakingChange) { "major" } else { "patch" }
    }
    default {
        if ($breakingChange) { "major" } else { "patch" }
    }
}

Write-LogInfo "Tipo de versionamento: $versionBump"

# Calcular nova versão
$versionParts = $currentVersion.Split('.')
$major = [int]$versionParts[0]
$minor = [int]$versionParts[1]
$patch = [int]$versionParts[2]

switch ($versionBump) {
    "major" {
        $major++
        $minor = 0
        $patch = 0
    }
    "minor" {
        $minor++
        $patch = 0
    }
    "patch" {
        $patch++
    }
}

$newVersion = "$major.$minor.$patch"
Write-LogInfo "Nova versão: $newVersion"

# Atualizar package.json se existir
if (Test-Path "package.json") {
    try {
        $packageJson = Get-Content "package.json" | ConvertFrom-Json
        $packageJson.version = $newVersion
        $packageJson | ConvertTo-Json -Depth 100 | Set-Content "package.json"
        Write-LogSuccess "package.json atualizado para versão $newVersion"
    } catch {
        Write-LogWarning "Erro ao atualizar package.json"
    }
}

# Fazer commit
Write-LogStep "Fazendo commit..."
git add .
git commit -m $commitMessage
Write-LogSuccess "Commit realizado com sucesso!"

# Criar tag
git tag -a "v$newVersion" -m "Release version $newVersion"
Write-LogSuccess "Tag v$newVersion criada!"

# Gerar changelog
Write-LogStep "Gerando changelog..."
$date = Get-Date -Format "yyyy-MM-dd"
$changelogEntry = @"
## [$newVersion] - $date

### $commitType
- $commitDescription
"@

if ($commitBody) {
    $changelogEntry += "`n`n  $commitBody"
}

if (Test-Path "CHANGELOG.md") {
    $existingChangelog = Get-Content "CHANGELOG.md" -Raw
    $newChangelog = "$changelogEntry`n`n$existingChangelog"
    Set-Content "CHANGELOG.md" $newChangelog
} else {
    Set-Content "CHANGELOG.md" "# Changelog`n`n$changelogEntry"
}

Write-LogSuccess "Changelog atualizado!"

# Push
Write-LogStep "Fazendo push..."
git push origin $currentBranch
git push origin "v$newVersion"
Write-LogSuccess "Push realizado para branch $currentBranch e tag v$newVersion"

# Gerar template de PR
$prTemplate = @"
# 🚀 Pull Request: $commitTitle

## 📋 Descrição
$commitDescription

$(if ($commitBody) { $commitBody })

## 🔄 Tipo de Mudança
- [x] $commitType: $(switch ($commitType) {
    "feat" { "Nova funcionalidade" }
    "fix" { "Correção de bug" }
    "docs" { "Documentação" }
    "style" { "Formatação/estilo" }
    "refactor" { "Refatoração" }
    "perf" { "Performance" }
    "test" { "Testes" }
    "chore" { "Tarefas de build/ferramentas" }
    "security" { "Segurança" }
    "i18n" { "Internacionalização" }
})

## 📊 Impacto
- **Versão**: $currentVersion → $newVersion
- **Breaking Change**: $(if ($breakingChange) { "⚠️ SIM" } else { "✅ NÃO" })
$(if ($breakingChange -and $breakingDescription) { "- **Breaking Change Details**: $breakingDescription" })

## 🧪 Como Testar
1. Fazer checkout da branch `$currentBranch`
2. Instalar dependências: `npm install` ou `yarn install`
3. Executar testes: `npm test` ou `yarn test`
4. Executar aplicação: `npm start` ou `yarn start`

## ✅ Checklist
- [x] Código testado localmente
- [x] Testes passando
- [x] Documentação atualizada (se necessário)
- [x] Changelog atualizado
- [x] Versão incrementada

$(if ($relatedIssue) { "## 🔗 Issues Relacionadas`n$relatedIssue" })

## 🖥️ Plataforma de Desenvolvimento
- **OS**: Windows (PowerShell)
- **Branch**: $currentBranch
- **Commit**: $(git rev-parse --short HEAD)

---
*PR gerado automaticamente pelo Git Flow v2.0* 🤖
"@

Set-Content "PR_TEMPLATE.md" $prTemplate
Write-LogSuccess "Template de PR gerado: PR_TEMPLATE.md"

# Resumo final
Write-LogStep "Resumo da Operação"
Write-Host "✅ Automação concluída com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Resumo:" -ForegroundColor Cyan
Write-Host "• Plataforma: Windows (PowerShell)"
Write-Host "• Branch: $currentBranch"
Write-Host "• Commit: $commitTitle"
Write-Host "• Versão: $currentVersion → $newVersion"
Write-Host "• Tag: v$newVersion"
Write-Host "• Breaking Change: $(if ($breakingChange) { "SIM" } else { "NÃO" })"
Write-Host ""
Write-Host "🚀 Próximos passos:" -ForegroundColor Cyan
Write-Host "1. Verificar o PR template gerado: PR_TEMPLATE.md"
Write-Host "2. Criar Pull Request no GitHub/GitLab"
if ($currentBranch -ne "main" -and $currentBranch -ne "master") {
    Write-Host "3. Após merge, deletar branch: git branch -d $currentBranch"
}
Write-Host ""
Write-Host "🎉 Happy coding!" -ForegroundColor Green
