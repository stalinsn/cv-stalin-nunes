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
7. Na conta criada, clique em **Adicionar chave > Criar nova chave > JSON**. Baixe o arquivo `google-service-account.json`.
8. **Nunca compartilhe esse arquivo publicamente!**

### 3. Compartilhando a Planilha com a Service Account
1. No Google Sheets, clique em **Compartilhar**.
2. Cole o e-mail da service account (ex: `svc-tokens-ia@seu-projeto.iam.gserviceaccount.com`).
3. Dê permissão de **Editor** (ou apenas Leitor, se só for ler dados).

### 4. Configurando o Projeto Next.js
1. Coloque o arquivo `google-service-account.json` na raiz do projeto (ou caminho seguro).
2. Certifique-se de que o arquivo está listado no `.gitignore` para não subir ao GitHub.
3. No código, use o ID da planilha e o caminho do arquivo de credenciais:
   ```ts
   // Exemplo de uso em Node.js/Next.js
   const CREDENTIALS_PATH = path.resolve(process.cwd(), 'google-service-account.json');
   const SPREADSHEET_ID = '1AbCDeFGhIJKlmNOPqrsTUVwxyz1234567890';
   ```
4. (Opcional) Use variáveis de ambiente para maior segurança:
   ```env
   GOOGLE_SERVICE_ACCOUNT_JSON=./google-service-account.json
   GOOGLE_SHEET_ID=1AbCDeFGhIJKlmNOPqrsTUVwxyz1234567890
   ```
   E no código:
   ```ts
   const CREDENTIALS_PATH = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
   const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
   ```

### 5. Dicas de Segurança
- **Nunca** faça commit do arquivo `google-service-account.json`.
- Limite as permissões da planilha e da service account ao mínimo necessário.
- Se possível, restrinja o acesso da API apenas ao seu domínio/projeto.
- Troque as credenciais se suspeitar de vazamento.
- Não exponha o conteúdo do arquivo de credenciais em logs ou erros.

### 6. Testando a Integração
- Use endpoints de teste (ex: `/api/validate-token`) para garantir que a leitura/escrita está funcionando.
- Verifique os logs do servidor para mensagens de erro de autenticação ou permissão.

### 7. Referências Oficiais
- [Documentação Google Sheets API](https://developers.google.com/sheets/api/quickstart/nodejs)
- [Documentação Service Accounts](https://cloud.google.com/iam/docs/service-accounts)

---

> Para dúvidas, sugestões ou contribuições, abra uma issue ou envie um pull request!
