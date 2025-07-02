[⬅ Voltar ao Índice](../../DOCUMENTATION.md)

# cv-ptbr, cv-en, cv-es, cv-fr, cv-de

## 1. Descrição
Arquivos de dados contendo o currículo em diferentes idiomas.

## 2. Estrutura
- Exportam objetos com dados do currículo (nome, título, experiência, educação, etc.)

## 3. Funcionalidades
- Permitem internacionalização do conteúdo

## 4. Interações
- Usados pelo hook `useI18n` e componentes de exibição

## 5. Considerações de Manutenção
- Mantenha os campos sincronizados entre idiomas
- Atualize sempre que houver mudanças no currículo

## 6. Links de referência
- Funcional: Usado em `src/app/page.tsx`, `useI18n`
