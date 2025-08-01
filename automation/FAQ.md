# ❓ FAQ - Perguntas Frequentes

## 🔧 **Instalação e Configuração**

### **Q: Preciso instalar alguma coisa além do Git?**
**A:** Não! A automação funciona apenas com Git e Bash (que vem com Git no Windows). Node.js é opcional para melhor parsing do package.json.

### **Q: Funciona em qualquer projeto?**
**A:** Sim! Funciona em qualquer repositório Git, independente da linguagem de programação. Testado em Node.js, Python, Go, Docker, e projetos simples.

### **Q: Preciso do package.json obrigatoriamente?**
**A:** Não é obrigatório, mas é recomendado. Sem package.json:
- Versionamento inicia em 0.1.0
- Funciona normalmente para commits e changelog
- Apenas perde atualização automática da versão no arquivo

### **Q: Como sei se a exportação funcionou?**
**A:** Execute `bash automation/migrate.sh` - ele testa tudo automaticamente e mostra ✅ ou ❌ para cada componente.

## 📋 **Uso Diário**

### **Q: Qual comando usar: `yarn gitflow` ou `./automation/git-flow.sh`?**
**A:** Ambos fazem a mesma coisa:
- `yarn gitflow` - Mais limpo, precisa do package.json
- `./automation/git-flow.sh` - Funciona sempre, sem dependências

### **Q: Como interromper o processo sem estragar nada?**
**A:** Pressione `Ctrl+C` a qualquer momento antes da confirmação final. O script só modifica arquivos após você confirmar o push.

### **Q: Posso usar em branches que não são main/master?**
**A:** Sim! A automação funciona em qualquer branch. Ela oferece opções para:
- Continuar na branch atual
- Criar nova branch automaticamente
- Especificar nome customizado

### **Q: E se eu errar alguma informação durante o processo?**
**A:** Até a confirmação final, nada é permanente. Depois da confirmação, você pode fazer um novo commit corrigindo.

## 🌐 **Compatibilidade**

### **Q: Funciona no Windows?**
**A:** Sim! Use Git Bash (vem com Git for Windows). Não funciona no CMD/PowerShell padrão.

### **Q: Funciona em projetos antigos/legados?**
**A:** Perfeitamente! Desde que tenha Git inicializado. A automação não interfere com código existente.

### **Q: Funciona com monorepos?**
**A:** Sim! Você pode:
- Usar uma automação na raiz para todo o monorepo
- Copiar para cada subprojeto com configurações específicas

### **Q: Funciona com GitLab/Bitbucket?**
**A:** Funciona para commits, versionamento e changelog. URLs de PR só funcionam com GitHub.

## ⚙️ **Customização**

### **Q: Como adicionar novos tipos de commit?**
**A:** Edite `automation/config/commit-types.conf`:
```bash
hotfix:🚑:Correção urgente:patch
experiment:🧪:Experimental:patch
```

### **Q: Como mudar o comportamento padrão?**
**A:** Edite `automation/config/settings.conf`. Exemplos:
```bash
DEFAULT_INITIAL_VERSION=1.0.0     # Versão inicial
REQUIRE_SCOPE=true                # Escopo obrigatório
CHANGELOG_INCLUDE_EMOJIS=false    # Sem emojis no changelog
```

### **Q: Como usar em projetos que não são JavaScript?**
**A:** A automação funciona independente da linguagem. Para projetos sem package.json:
1. Crie um package.json básico para versionamento
2. Ou use apenas para commits e changelog (versioning manual)

## 🐛 **Problemas Comuns**

### **Q: Erro "Permission denied" ao executar**
**A:** Execute: `chmod +x automation/git-flow.sh`

### **Q: Erro "not a git repository"**
**A:** Certifique-se de estar em um diretório com Git:
```bash
git status  # Deve funcionar
# Se não, execute: git init
```

### **Q: Erro "bash: automation/git-flow.sh: No such file"**
**A:** Verifique se:
1. A pasta automation foi copiada corretamente
2. Você está no diretório correto
3. Os arquivos existem: `ls -la automation/`

### **Q: Script inicia mas trava ou dá erro**
**A:** Verifique se todos os módulos existem:
```bash
ls -la automation/modules/
# Deve ter 8 arquivos .sh
```

## 🔄 **Workflow e Melhores Práticas**

### **Q: Quando usar cada tipo de commit?**
**A:**
- `feat` - Nova funcionalidade para o usuário
- `fix` - Correção de bug
- `docs` - Apenas documentação
- `refactor` - Reestruturação sem mudar comportamento
- `chore` - Tarefas de manutenção (deps, build, etc.)

### **Q: Quando fazer breaking change?**
**A:** Quando mudanças quebram compatibilidade:
- Remover funcionalidades
- Mudar APIs existentes
- Alterar comportamento esperado

### **Q: Como organizar branches?**
**A:** A automação sugere nomes no formato:
- `feat/auth-oauth` (feature)
- `fix/memory-leak` (correção)
- `docs/api-documentation` (documentação)

## 📊 **Versionamento**

### **Q: Como funciona o versionamento semântico?**
**A:**
- `major` (1.0.0 → 2.0.0) - Breaking changes
- `minor` (1.0.0 → 1.1.0) - Novas features
- `patch` (1.0.0 → 1.0.1) - Correções

### **Q: Posso forçar um tipo específico de versão?**
**A:** Sim! A automação sempre pergunta e você pode escolher manual:
1. major, 2. minor, 3. patch, 4. usar sugestão

### **Q: Como voltar uma versão se fiz errado?**
**A:** Para rollback completo:
```bash
# Remover tag local e remota
git tag -d vX.X.X
git push origin :refs/tags/vX.X.X

# Reverter commit
git revert HEAD
```

## 🚀 **Dicas Avançadas**

### **Q: Como personalizar ainda mais?**
**A:** Você pode editar os módulos em `automation/modules/` para comportamentos específicos. Cada módulo é independente.

### **Q: Como fazer backup das configurações?**
**A:** Copie a pasta config:
```bash
cp -r automation/config/ backup-config/
```

### **Q: Posso usar hooks personalizados?**
**A:** Sim! (Ainda em desenvolvimento). Configure `ENABLE_HOOKS=true` no settings.conf.

### **Q: Como contribuir com melhorias?**
**A:** A estrutura modular facilita:
1. Edite módulos específicos
2. Adicione novos módulos
3. Compartilhe configurações úteis

---

**💡 Não encontrou sua dúvida?** A documentação completa está em `automation/README.md` e `automation/EXPORT-GUIDE.md`!
