[⬅ Voltar ao Índice](../../DOCUMENTATION.md)

# Navbar

## 1. Descrição do Componente
Barra de navegação principal do currículo, com opções de idioma, tema e navegação entre seções.

## 2. Propriedades
- `lang: string` — Idioma atual
- `onTranslate: (lang: string) => void` — Callback para troca de idioma
- `onToggleTheme: () => void` — Callback para alternar tema
- `theme: string` — Tema atual
- `translationMode: string` — Modo de tradução
- `onChangeTranslationMode: (mode: string) => void` — Callback para modo de tradução

## 3. Funcionalidades
- Permite alternar idioma e tema.
- Exibe links para seções do currículo.
- Permite alternar modo de tradução.

## 4. Interações
- Interage com hooks de internacionalização e tema.

## 5. Considerações de Manutenção
- Mantenha os links e opções sincronizados com as funcionalidades do app.

## 6. Links de referência
- Testes: (Adicionar link se houver)
- Funcional: Usado em `src/app/page.tsx`
