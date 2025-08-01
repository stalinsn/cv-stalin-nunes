# 🤖 Automação Git Flow

Sistema de automação para commits, versionamento e releases usando conventional commits e semantic versioning.

## 🚀 Comando Principal

```bash
yarn gitflow
```

## 📋 Fluxo Automatizado

### 1. **Seleção de Commit Type**
- feat, fix, docs, style, refactor, perf, test, chore, security, i18n
- Seguindo [Conventional Commits](https://www.conventionalcommits.org/)

### 2. **Captura de Informações**
- Descrição curta e detalhada
- Escopo (opcional)
- Breaking changes
- Issues relacionadas

### 3. **Gerenciamento de Branch**
- Criação automática com nomes padronizados
- Opção de usar branch atual
- Nomes limpos e semânticos

### 4. **Versionamento Inteligente**
- **Manual**: Escolha entre major, minor, patch
- **Automático**: Sugestão baseada no tipo de commit
- **Breaking Changes**: Alerta para major version

### 5. **Segurança**
- Alerta antes do push
- Confirmação obrigatória
- Opção de cancelar sem perder trabalho

### 6. **Geração Automática**
- ✅ Tag semântica (v1.0.0)
- ✅ Changelog atualizado
- ✅ Package.json versionado
- ✅ Template de PR preenchido
- ✅ Links diretos para GitHub/GitLab

## 🎯 Vantagens

- **Padronização**: Commits consistentes
- **Automação**: Menos trabalho manual
- **Profissionalização**: Workflow enterprise
- **Rastreabilidade**: Histórico claro
- **Releases**: Download fácil para usuários

## 🔧 Scripts Disponíveis

```json
{
  "gitflow": "bash ./scripts/automate-git-flow-v2.sh",
  "gitflow:ps": "powershell -ExecutionPolicy Bypass -File ./scripts/automate-git-flow-v2.ps1"
}
```

## 📦 Semantic Versioning

```
MAJOR.MINOR.PATCH
  │     │     └── Bug fixes (1.0.0 → 1.0.1)
  │     └─────── New features (1.0.0 → 1.1.0)
  └───────────── Breaking changes (1.0.0 → 2.0.0)
```

## 🏷️ Tags e Releases

- **Tags**: Marcações no Git (v1.0.0)
- **Releases**: Versões para download no GitHub
- **Assets**: ZIP/TAR.GZ automáticos
- **Release Notes**: Template preenchido

## 🔗 Links Automáticos

O script detecta automaticamente:
- GitHub: `github.com/owner/repo`
- GitLab: `gitlab.com/owner/repo`

E gera links diretos para:
- 🌿 Ver branch
- 🔄 Criar PR
- 🏷️ Ver releases

## 🎉 Resultado Final

- Commit profissional
- Branch organizada
- PR template completo
- Release pronta
- Documentação atualizada
- Links diretos de acesso
