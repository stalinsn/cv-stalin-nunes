# =============================================================================
# 🚀 SCRIPT DE AUTOMAÇÃO GIT FLOW - PowerShell
# =============================================================================
# Versão Windows do script de automação completa
# =============================================================================

param([switch]$Help)

if ($Help) {
    Write-Host "Script de Automacao Git Flow" -ForegroundColor Cyan
    Write-Host "Este script automatiza:" -ForegroundColor Yellow
    Write-Host "  - Conventional commits"
    Write-Host "  - Versionamento automatico"
    Write-Host "  - Changelog automatico"
    Write-Host "  - Template de PR"
    Write-Host "  - Push para repositorio"
    Write-Host "Uso: .\scripts\automate-git-flow.ps1" -ForegroundColor Green
    exit 0
}

# Verificar se estamos em um repositório Git
if (!(Test-Path ".git")) {
    Write-Host "Este diretorio nao e um repositorio Git!" -ForegroundColor Red
    exit 1
}

Write-Host "Iniciando fluxo de automacao Git..." -ForegroundColor Magenta

# Verificar estado do repositório
Write-Host "Verificando estado do repositorio..." -ForegroundColor Blue
$gitStatus = git status --porcelain

if ($gitStatus) {
    Write-Host "Arquivos modificados encontrados:" -ForegroundColor Blue
    git status --short
} else {
    Write-Host "Nenhum arquivo modificado encontrado!" -ForegroundColor Yellow
    $continue = Read-Host "Deseja continuar mesmo assim? (y/N)"
    if ($continue -ne "y" -and $continue -ne "Y") {
        Write-Host "Operacao cancelada." -ForegroundColor Blue
        exit 0
    }
}

# Seleção do tipo de commit
Write-Host "Selecionando tipo de commit..." -ForegroundColor Magenta
Write-Host "Selecione o tipo de commit:" -ForegroundColor Cyan
Write-Host "1) feat      - Nova funcionalidade"
Write-Host "2) fix       - Correcao de bug"
Write-Host "3) docs      - Documentacao"
Write-Host "4) style     - Formatacao/estilo"
Write-Host "5) refactor  - Refatoracao"
Write-Host "6) perf      - Performance"
Write-Host "7) test      - Testes"
Write-Host "8) chore     - Tarefas de build/ferramentas"
Write-Host "9) security  - Seguranca"
Write-Host "10) i18n     - Internacionalizacao"

$commitTypeNum = Read-Host "Digite o numero (1-10)"

$commitType = switch ($commitTypeNum) {
    "1" { "feat" }
    "2" { "fix" }
    "3" { "docs" }
    "4" { "style" }
    "5" { "refactor" }
    "6" { "perf" }
    "7" { "test" }
    "8" { "chore" }
    "9" { "security" }
    "10" { "i18n" }
    default { 
        Write-Host "Opcao invalida!" -ForegroundColor Red
        exit 1
    }
}

# Capturar informações do commit
Write-Host "Coletando informacoes do commit..." -ForegroundColor Magenta

$commitDescription = Read-Host "Descricao curta do commit"
$commitScope = Read-Host "Escopo (opcional, ex: auth, ui, api)"
$breakingChangeInput = Read-Host "Breaking change? (y/N)"
$breakingChange = $breakingChangeInput -eq "y" -or $breakingChangeInput -eq "Y"

if ($breakingChange) {
    $breakingDescription = Read-Host "Descricao do breaking change"
}

$commitBody = Read-Host "Descricao detalhada (opcional)"
$relatedIssue = Read-Host "Issue relacionada (opcional, ex: #123)"

# Construir mensagem de commit
Write-Host "Construindo mensagem de commit..." -ForegroundColor Magenta

$commitTitle = if ($commitScope) { 
    "${commitType}(${commitScope}): ${commitDescription}" 
} else { 
    "${commitType}: ${commitDescription}" 
}

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

Write-Host "Mensagem de commit construida:" -ForegroundColor Blue
Write-Host $commitMessage -ForegroundColor Cyan

# Determinar versionamento
Write-Host "Determinando versionamento..." -ForegroundColor Magenta

try {
    $packageJson = Get-Content "package.json" | ConvertFrom-Json
    $currentVersion = $packageJson.version
    Write-Host "Versao atual: $currentVersion" -ForegroundColor Blue
} catch {
    Write-Host "Erro ao ler package.json" -ForegroundColor Red
    exit 1
}

$versionBump = switch ($commitType) {
    { $_ -eq "feat" } { 
        if ($breakingChange) { "major" } else { "minor" }
    }
    { $_ -in @("fix", "security", "perf") } { 
        if ($breakingChange) { "major" } else { "patch" }
    }
    default { 
        if ($breakingChange) { "major" } else { "patch" }
    }
}

Write-Host "Tipo de versionamento: $versionBump" -ForegroundColor Blue

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
Write-Host "Nova versao: $newVersion" -ForegroundColor Green

# Confirmação
Write-Host "=============================================" -ForegroundColor Yellow
Write-Host "RESUMO DAS OPERACOES" -ForegroundColor Yellow
Write-Host "=============================================" -ForegroundColor Yellow
Write-Host "Versao: $currentVersion -> $newVersion" -ForegroundColor Green
Write-Host "Commit: $commitTitle" -ForegroundColor Cyan
Write-Host "Tipo: $versionBump" -ForegroundColor Magenta
Write-Host "Breaking: $breakingChange" -ForegroundColor Red
Write-Host "=============================================" -ForegroundColor Yellow

$confirm = Read-Host "Continuar com estas operacoes? (y/N)"
if ($confirm -ne "y" -and $confirm -ne "Y") {
    Write-Host "Operacao cancelada." -ForegroundColor Blue
    exit 0
}

# Executar operações
try {
    Write-Host "Adicionando arquivos..." -ForegroundColor Magenta
    git add .
    Write-Host "Arquivos adicionados" -ForegroundColor Green

    Write-Host "Realizando commit..." -ForegroundColor Magenta
    git commit -m $commitMessage
    Write-Host "Commit realizado" -ForegroundColor Green

    Write-Host "Atualizando versao no package.json..." -ForegroundColor Magenta
    npm version $newVersion --no-git-tag-version
    Write-Host "Versao atualizada para $newVersion" -ForegroundColor Green

    Write-Host "Atualizando CHANGELOG..." -ForegroundColor Magenta
    $currentDate = Get-Date -Format "yyyy-MM-dd"
    $changelogEntry = @"

## [$newVersion] - $currentDate

### $(switch ($commitType) {
    "feat" { "Adicionado" }
    "fix" { "Corrigido" }
    "docs" { "Documentacao" }
    "style" { "Estilo" }
    "refactor" { "Refatorado" }
    "perf" { "Performance" }
    "test" { "Testes" }
    "chore" { "Manutencao" }
    "security" { "Seguranca" }
    "i18n" { "Internacionalizacao" }
    default { "Mudancas" }
})

- $commitDescription
"@

    if (!(Test-Path "CHANGELOG.md")) {
        @"
# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

## [Unreleased]
$changelogEntry
"@ | Out-File "CHANGELOG.md" -Encoding UTF8
    } else {
        $changelog = Get-Content "CHANGELOG.md" -Raw
        $changelog = $changelog -replace "(## \[Unreleased\])", "`$1$changelogEntry"
        $changelog | Out-File "CHANGELOG.md" -Encoding UTF8
    }
    Write-Host "CHANGELOG atualizado" -ForegroundColor Green

    Write-Host "Commitando versao e changelog..." -ForegroundColor Magenta
    git add package.json CHANGELOG.md
    git commit -m "chore: bump version to $newVersion and update changelog"
    Write-Host "Versao e changelog commitados" -ForegroundColor Green

    Write-Host "Criando tag..." -ForegroundColor Magenta
    git tag -a "v$newVersion" -m "Release v$newVersion"
    Write-Host "Tag v$newVersion criada" -ForegroundColor Green

    Write-Host "Realizando push..." -ForegroundColor Magenta
    $currentBranch = git branch --show-current
    git push origin $currentBranch
    git push origin "v$newVersion"
    Write-Host "Push realizado para branch $currentBranch e tag v$newVersion" -ForegroundColor Green

    Write-Host "Gerando template de PR..." -ForegroundColor Magenta
    $prTemplate = @"
# Pull Request - v$newVersion

## Descricao
$commitDescription

## Tipo de Mudanca
- [$( if ($commitType -eq "fix") { "x" } else { " " })] Bug fix (correcao de bug)
- [$( if ($commitType -eq "feat") { "x" } else { " " })] Nova funcionalidade (feature)
- [$( if ($commitType -eq "docs") { "x" } else { " " })] Documentacao

## Funcionalidades Adicionadas/Alteradas
- $commitDescription

## Mudancas Tecnicas
- Versao atualizada para $newVersion
- Changelog atualizado com as mudancas

## Checklist de Verificacao
- [x] Testei localmente e tudo funciona
- [x] Documentacao atualizada (se necessario)
- [x] Commit messages seguem padrao conventional commits

## Notas Adicionais
Release v$newVersion gerado automaticamente pelo script de automacao Git.
"@

    $prTemplate | Out-File ".pr-template-filled.md" -Encoding UTF8
    Write-Host "Template de PR gerado" -ForegroundColor Green

    Write-Host ""
    Write-Host "FLUXO COMPLETO EXECUTADO COM SUCESSO!" -ForegroundColor Green
    Write-Host "O que foi feito:" -ForegroundColor Cyan
    Write-Host "  - Commit conventional realizado"
    Write-Host "  - Versao atualizada para $newVersion" -ForegroundColor Green
    Write-Host "  - CHANGELOG atualizado"
    Write-Host "  - Tag criada e enviada"
    Write-Host "  - Push realizado"
    Write-Host "  - Template de PR gerado"
    Write-Host ""
    Write-Host "Proximos passos:" -ForegroundColor Yellow
    Write-Host "  1. Acesse GitHub e crie o Pull Request"
    Write-Host "  2. Use o template em .pr-template-filled.md"
    Write-Host "  3. Revise e submeta o PR"

} catch {
    Write-Host "Erro durante execucao: $_" -ForegroundColor Red
    exit 1
}
