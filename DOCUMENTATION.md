# Índice da Documentação

Bem-vindo à documentação técnica do projeto **cv-stalin-nunes**!

Este índice facilita a navegação entre todos os módulos, componentes, hooks, utilitários, dados e tipos do projeto.

---

## 📚 Documentação Geral
- [README (Visão Geral do Projeto)](README.md)
- [CHANGELOG (Histórico de Versões)](CHANGELOG.md)

## 🧩 Componentes
- [Visão Geral dos Componentes](src/components/README.md)
- [BackToTop](src/components/BackToTop.md)
- [Education](src/components/Education.md)
- [Experience](src/components/Experience.md)
- [FallbackModal](src/components/FallbackModal.md)
- [Footer](src/components/Footer.md)
- [Header](src/components/Header.md)
- [LanguageSelector](src/components/LanguageSelector.md)
- [Languages](src/components/Languages.md)
- [Navbar](src/components/Navbar.md)
- [Skills](src/components/Skills.md)
- [StatusBar](src/components/StatusBar.md)
- [Summary](src/components/Summary.md)
- [ThemeToggle](src/components/ThemeToggle.md)

## 🪝 Hooks
- [Visão Geral dos Hooks](src/hooks/README.md)
- [useAITranslation](src/hooks/useAITranslation.md)
- [useI18n](src/hooks/useI18n.md)
- [useLanguage](src/hooks/useLanguage.md)
- [useTheme](src/hooks/useTheme.md)
- [useTranslation](src/hooks/useTranslation.md)

## 🛠️ Utilitários (Utils)
- [Visão Geral dos Utilitários](src/utils/README.md)
- [PasswordModal](src/utils/PasswordModal.md)
- [translate](src/utils/translate.md)
- [translateFree](src/utils/translateFree.md)

## 📦 Bibliotecas (Lib)
- [Visão Geral das Libs](src/lib/README.md)
- [exportPDF](src/lib/exportPDF.md)
- [exportPrint](src/lib/exportPrint.md)
- [translateAI](src/lib/translateAI.md)
- [translateFree](src/lib/translateFree.md)
- [translateMock](src/lib/translateMock.md)
- [translateService](src/lib/translateService.md)
- [translation](src/lib/translation.md)

## 🗂️ Dados
- [Visão Geral dos Dados](src/data/README.md)
- [Arquivos de Currículo por Idioma](src/data/cvDataFiles.md)
- [cvData](src/data/cvData.md)
- [labels](src/data/labels.md)
- [languages](src/data/languages.md)
- [index (data)](src/data/index.md)

## 📝 Tipos (Types)
- [Visão Geral dos Tipos](src/types/README.md)
- [cv](src/types/cv.md)
- [translation](src/types/translation.md)

---

# Integração Multilíngue Segura com Google Sheets e Controle de Tokens

## Visão Geral
Este projeto implementa uma experiência multilíngue avançada e segura, integrando tradução automática via IA, controle de acesso por tokens temporários (gerenciados em Google Sheets), transparência LGPD e uma UX rica e divertida.

## Funcionalidades Principais
- **Tradução IA controlada por tokens:**
  - Usuário insere token temporário para liberar tradução automática.
  - Tokens são validados, decrementados e logados via endpoints Next.js integrados ao Google Sheets.
  - Feedback de usos restantes exibido na StatusBar.
  - Bloqueio temporário por IP após tentativas erradas.
- **Experiência de usuário aprimorada:**
  - StatusBar exibe curiosidades randomizadas e usos restantes do token.
  - Modais de confirmação, política de privacidade e overlays informativos.
  - Labels e traduções centralizadas para fácil manutenção.
- **LGPD e privacidade:**
  - Barra fixa de aviso LGPD, modal de política de privacidade leve e transparente.
  - Hash dos textos traduzidos, sem armazenamento de conteúdo sensível.

## Como Funciona a Integração com Google Sheets
1. **Configuração do Google Sheets:**
   - Planilha com colunas: Token, Usos Restantes, Último Uso, IP, User Agent, Hash, etc.
   - API do Google habilitada e credenciais de serviço configuradas.
2. **Endpoints Next.js:**
   - `/api/validate-token`: Valida token, verifica usos e bloqueios.
   - `/api/translate`: Realiza tradução, decrementa usos, registra estatísticas.
3. **Fluxo de Tradução:**
   - Usuário solicita tradução, insere token.
   - Token é validado e, se aprovado, tradução é realizada e uso registrado.
   - Feedback visual de usos restantes e curiosidades exibidos.

## Passo a Passo para Reutilizar/Customizar
1. **Configurar Google Sheets e credenciais:**
   - Criar planilha conforme modelo.
   - Gerar credenciais de serviço e definir permissões.
2. **Ajustar variáveis de ambiente:**
   - Adicionar credenciais e ID da planilha no `.env.local`.
3. **Customizar labels e traduções:**
   - Editar arquivos em `src/data/labels.ts` e `src/data/languageLabels.ts`.
4. **Ajustar curiosidades e temas:**
   - Editar `src/components/statusbarFacts.ts`.
5. **Revisar e adaptar endpoints:**
   - `src/app/api/validate-token/route.ts`
   - `src/app/api/translate/route.ts`
   - `src/lib/updateTokenRow.ts`
   - `src/lib/translateService.ts`

## Passo a Passo: Integrando Google Sheets como API para Controle de Tokens

1. **Criar Projeto no Google Cloud Platform (GCP):**
   - Acesse https://console.cloud.google.com/ e faça login.
   - Crie um novo projeto ou selecione um existente.

2. **Ativar a API do Google Sheets:**
   - No painel do projeto, vá em "APIs e Serviços" > "Biblioteca".
   - Busque por "Google Sheets API" e clique em "Ativar".

3. **Criar Credenciais de Serviço:**
   - Em "APIs e Serviços" > "Credenciais", clique em "Criar credenciais" > "Conta de serviço".
   - Dê um nome e crie a conta. Não é necessário conceder permissões extras.
   - Após criar, clique na conta de serviço e em "Chaves" > "Adicionar chave" > "Criar nova chave JSON".
   - Baixe o arquivo JSON gerado (guarde com segurança, será usado no backend).

4. **Compartilhar a Planilha com a Conta de Serviço:**
   - Crie uma planilha no Google Sheets com as colunas necessárias (Token, Usos Restantes, etc).
   - Compartilhe a planilha com o e-mail da conta de serviço (ex: `xxxx@xxxx.iam.gserviceaccount.com`) com permissão de editor.

5. **Configurar Variáveis de Ambiente:**
   - Adicione o conteúdo do JSON da conta de serviço em uma variável (ex: `GOOGLE_SERVICE_ACCOUNT_JSON`) no `.env.local`.
   - Adicione o ID da planilha em outra variável (ex: `GOOGLE_SHEET_ID`).

6. **Ajustar o Backend:**
   - Certifique-se de que os arquivos `updateTokenRow.ts` e `translateService.ts` usam as variáveis de ambiente corretamente para autenticar e acessar a planilha.
   - Os endpoints `/api/validate-token` e `/api/translate` já estão prontos para consumir essas variáveis.

7. **Testar a Integração:**
   - Realize uma requisição de validação ou tradução e verifique se os dados são lidos/escritos na planilha.
   - Monitore erros de permissão ou autenticação no console do backend.

> **Dica:** Para ambientes de produção, nunca exponha o JSON da conta de serviço no frontend. Use apenas no backend seguro.

### Como Capturar o Google Sheet ID
O ID da planilha é a sequência de caracteres entre `/d/` e `/edit` na URL do Google Sheets. Exemplo:

```
https://docs.google.com/spreadsheets/d/1A2B3C4D5E6F7G8H9I0J/edit#gid=0
```

Neste caso, o **Sheet ID** é:
```
1A2B3C4D5E6F7G8H9I0J
```

Use esse valor na variável de ambiente `GOOGLE_SHEET_ID`.

## Documentação dos Arquivos Principais
- `src/app/api/validate-token/route.ts`: Validação e bloqueio de tokens.
- `src/app/api/translate/route.ts`: Tradução IA, decremento e logging de tokens.
- `src/lib/updateTokenRow.ts`: Funções utilitárias para manipulação da planilha.
- `src/components/ConfirmTranslateModal.tsx`: Modal de confirmação e input de token.
- `src/components/StatusBar.tsx`: Exibe usos restantes e curiosidades.
- `src/components/PrivacyModal.tsx`: Modal de política de privacidade.
- `src/components/statusbarFacts.ts`: Curiosidades randomizadas.
- `src/data/labels.ts`, `src/data/languageLabels.ts`: Labels e traduções centralizadas.

## LGPD e Privacidade
- Nenhum texto traduzido é armazenado.
- Apenas hash, IP e user agent são registrados para controle de abuso.
- Política de privacidade clara e acessível via modal.

## Exemplos Visuais e UX
- StatusBar dinâmica, modais responsivos, feedbacks claros e acessíveis.
- Explicações visuais sobre tokens e tempo de uso.

---

> Use este índice para navegar rapidamente entre as documentações técnicas do projeto no Obsidian, VS Code ou qualquer leitor Markdown.
