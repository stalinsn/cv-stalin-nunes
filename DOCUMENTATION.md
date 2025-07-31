# Documentação Técnica Rápida

A documentação detalhada do projeto está centralizada na pasta [`docs/`](docs/), organizada por domínio (componentes, hooks, dados, libs, estilos, tipos e utilitários).

- Use o índice principal [`docs/README_INDEX.md`](docs/README_INDEX.md) para navegar entre os módulos e arquivos de documentação.
- Consulte cada subpasta para detalhes sobre os arquivos e funcionalidades.

---

## Integração Multilíngue Segura com Google Sheets e Controle de Tokens

(Resumo mantido para referência rápida. Para detalhes completos, veja `docs/`.)

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
   - Siga as instruções do README e adapte os endpoints conforme sua necessidade.
2. **Adapte os componentes e hooks:**
   - Todos os fluxos de tradução, cache, seleção de idioma e exibição de status estão centralizados nos hooks e componentes principais.
3. **Personalize os dados e labels:**
   - Edite os arquivos em `src/data` para alterar textos, idiomas e labels.

---

## ⚙️ Configuração de Variáveis de Ambiente

### Arquivo `.env.local`
O projeto utiliza variáveis de ambiente para configurar APIs, credenciais e comportamentos. Copie o arquivo `.env.example` para `.env.local` e configure:

```bash
# Copiar template
cp .env.example .env.local
```

### Variáveis Obrigatórias

#### **OpenAI API (Tradução IA)**
```env
# Chave da API OpenAI
OPENAI_API_KEY=sk-proj-sua_chave_aqui

# Modelo a usar (opcional, padrão: gpt-3.5-turbo)
NEXT_PUBLIC_OPENAI_MODEL=gpt-3.5-turbo

# Habilitar tradução IA
NEXT_PUBLIC_ENABLE_AI=true
```

#### **Sistema de Tradução Alternativo**
```env
# Habilitar tradução gratuita (LibreTranslate)
NEXT_PUBLIC_ENABLE_FREE=true

# Senha para bypass do sistema de tokens (opcional)
AI_TRANSLATE_PASSWORD=sua_senha_aqui
```

#### **Google Sheets (Controle de Tokens)**
```env
# ID da planilha (extrair da URL)
GOOGLE_SHEET_ID=1ESe5JpZFiZTRVDAPZ3uxLAXBek3KoNE3NXDuLqXS6bk

# Credenciais do Google Service Account (extraídas do arquivo JSON)
GOOGLE_SERVICE_ACCOUNT_TYPE=service_account
GOOGLE_SERVICE_ACCOUNT_PROJECT_ID=seu_project_id
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY_ID=sua_private_key_id
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nsua_chave_privada\n-----END PRIVATE KEY-----\n"
GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL=svc@projeto.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_CLIENT_ID=seu_client_id
GOOGLE_SERVICE_ACCOUNT_AUTH_URI=https://accounts.google.com/o/oauth2/auth
GOOGLE_SERVICE_ACCOUNT_TOKEN_URI=https://oauth2.googleapis.com/token
```

#### **Configurações da Aplicação**
```env
# URL base (localhost em dev, domínio em prod)
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Ambiente
NODE_ENV=development
```

### Hierarquia de Tradução
O sistema de tradução funciona em ordem de prioridade:

1. **IA (OpenAI)** - Se `NEXT_PUBLIC_ENABLE_AI=true` e chave válida
2. **Free (LibreTranslate)** - Se `NEXT_PUBLIC_ENABLE_FREE=true`
3. **Mock** - Fallback para desenvolvimento

### Autenticação Dupla
A API de tradução aceita duas formas de autenticação:

1. **Senha direta:** `AI_TRANSLATE_PASSWORD` (bypass total)
2. **Sistema de tokens:** Google Sheets com controle de usos

### Arquivos Necessários
- **`.env.local`** - Variáveis de ambiente (não commitado)
- **`.env.example`** - Template público (commitado)

### Exemplo Completo `.env.local`
```env
# OpenAI
OPENAI_API_KEY=sk-proj-abc123...
NEXT_PUBLIC_OPENAI_MODEL=gpt-3.5-turbo
NEXT_PUBLIC_ENABLE_AI=true

# Tradução alternativa
NEXT_PUBLIC_ENABLE_FREE=true
AI_TRANSLATE_PASSWORD=minha_senha_secreta

# Google Sheets
GOOGLE_SHEET_ID=1ESe5JpZFiZTRVDAPZ3uxLAXBek3KoNE3NXDuLqXS6bk
GOOGLE_SERVICE_ACCOUNT_TYPE=service_account
GOOGLE_SERVICE_ACCOUNT_PROJECT_ID=seu_project_id
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY_ID=sua_private_key_id
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nsua_chave_privada\n-----END PRIVATE KEY-----\n"
GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL=svc@projeto.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_CLIENT_ID=seu_client_id
GOOGLE_SERVICE_ACCOUNT_AUTH_URI=https://accounts.google.com/o/oauth2/auth
GOOGLE_SERVICE_ACCOUNT_TOKEN_URI=https://oauth2.googleapis.com/token

# App
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NODE_ENV=development
```

---

## Guia Detalhado: Integração Segura com Google Sheets e Service Account

### 1. Criando e Configurando a Planilha no Google Sheets
1. Crie uma nova planilha no Google Sheets (ex: `TokensIA`).
2. Organize as colunas conforme sua necessidade (exemplo: `token`, `usos_restantes`, `ativo`, `ultimo_uso`, `ip`, `idioma`, etc).
3. Copie o ID da planilha (está na URL entre `/d/` e `/edit`).
   - Exemplo de URL: `https://docs.google.com/spreadsheets/d/1AbCDeFGhIJKlmNOPqrsTUVwxyz1234567890/edit#gid=0`
   - ID: `1AbCDeFGhIJKlmNOPqrsTUVwxyz1234567890`

### 2. Criando uma Service Account e Obtendo Credenciais
1. Acesse o [Google Cloud Console](https://console.cloud.google.com/).
2. Crie um novo projeto (ou use um existente).
3. No menu, vá em **APIs e Serviços > Biblioteca** e ative a API "Google Sheets".
4. No menu, vá em **APIs e Serviços > Credenciais**.
5. Clique em **Criar credenciais > Conta de serviço**.
6. Dê um nome (ex: `svc-tokens-ia`) e conclua.
7. Na conta criada, clique em **Adicionar chave > Criar nova chave > JSON**. Baixe o arquivo JSON temporariamente.
8. **Extraia as informações** do arquivo JSON para as variáveis de ambiente (veja seção de configuração).
9. **Delete o arquivo JSON** após extrair as credenciais para as variáveis de ambiente.
10. **Nunca compartilhe essas credenciais publicamente!**

### 3. Compartilhando a Planilha com a Service Account
1. No Google Sheets, clique em **Compartilhar**.
2. Cole o e-mail da service account (ex: `svc-tokens-ia@seu-projeto.iam.gserviceaccount.com`).
3. Dê permissão de **Editor** (ou apenas Leitor, se só for ler dados).

### 4. Configurando o Projeto Next.js
1. Configure as credenciais do Service Account como variáveis de ambiente no `.env.local`.
2. Certifique-se de que o arquivo `.env.local` está listado no `.gitignore` para não subir ao GitHub.
3. No código, use as variáveis de ambiente para acessar as credenciais:
   ```ts
   // Função para obter credenciais do Google a partir de variáveis de ambiente
   function getGoogleCredentials() {
     return {
       type: process.env.GOOGLE_SERVICE_ACCOUNT_TYPE,
       project_id: process.env.GOOGLE_SERVICE_ACCOUNT_PROJECT_ID,
       private_key_id: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY_ID,
       private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n'),
       client_email: process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL,
       client_id: process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_ID,
       auth_uri: process.env.GOOGLE_SERVICE_ACCOUNT_AUTH_URI,
       token_uri: process.env.GOOGLE_SERVICE_ACCOUNT_TOKEN_URI,
     };
   }
   ```
4. Configure as variáveis no `.env.local`:
   ```env
   GOOGLE_SHEET_ID=1AbCDeFGhIJKlmNOPqrsTUVwxyz1234567890
   GOOGLE_SERVICE_ACCOUNT_TYPE=service_account
   GOOGLE_SERVICE_ACCOUNT_PROJECT_ID=seu_project_id
   GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY_ID=sua_private_key_id
   GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nsua_chave_privada\n-----END PRIVATE KEY-----\n"
   GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL=svc@projeto.iam.gserviceaccount.com
   GOOGLE_SERVICE_ACCOUNT_CLIENT_ID=seu_client_id
   GOOGLE_SERVICE_ACCOUNT_AUTH_URI=https://accounts.google.com/o/oauth2/auth
   GOOGLE_SERVICE_ACCOUNT_TOKEN_URI=https://oauth2.googleapis.com/token
   ```

### 5. Dicas de Segurança
- **Nunca** faça commit das credenciais do Google Service Account no código.
- Use sempre variáveis de ambiente para armazenar credenciais sensíveis.
- Limite as permissões da planilha e da service account ao mínimo necessário.
- Se possível, restrinja o acesso da API apenas ao seu domínio/projeto.
- Troque as credenciais se suspeitar de vazamento.
- Não exponha o conteúdo das credenciais em logs ou erros.

### 6. Testando a Integração
- Use endpoints de teste (ex: `/api/validate-token`) para garantir que a leitura/escrita está funcionando.
- Verifique os logs do servidor para mensagens de erro de autenticação ou permissão.

### 7. Referências Oficiais
- [Documentação Google Sheets API](https://developers.google.com/sheets/api/quickstart/nodejs)
- [Documentação Service Accounts](https://cloud.google.com/iam/docs/service-accounts)

---

> Para dúvidas, sugestões ou contribuições, abra uma issue ou envie um pull request!
