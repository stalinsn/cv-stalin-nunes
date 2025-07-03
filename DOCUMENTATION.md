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

> Para dúvidas, sugestões ou contribuições, abra uma issue ou envie um pull request!
