---
tags:
  - guia
  - admin
  - editor
---

# Painel - Editor Visual

## O que você encontra aqui

Esta nota mostra o editor visual como um sistema de composição de blocos, e não apenas uma tela com drag-and-drop.

## Arquivos principais

- `src/features/ecommpanel/components/SiteEditorManager.tsx`
- `src/features/ecommpanel/components/SitePagePreview.tsx`

## Trecho 1 - inserir bloco por drag

```tsx
function insertBlockByDrag(payload: DragPayload, targetSlotId: string, targetIndex: number) {
  setSlots((current) => {
    const snapshot = current.map((slot) => ({ ...slot, blocks: [...slot.blocks] }));
    let blockToInsert: SiteBlock | null = null;

    if (payload.kind === 'new') {
      blockToInsert = makeDefaultBlock(payload.blockType);
    } else {
      const fromSlot = snapshot.find((slot) => slot.id === payload.fromSlotId);
      const sourceIndex = fromSlot.blocks.findIndex((block) => block.id === payload.blockId);
      const [movedBlock] = fromSlot.blocks.splice(sourceIndex, 1);
      blockToInsert = movedBlock;
    }

    const targetSlot = snapshot.find((slot) => slot.id === targetSlotId);
    targetSlot.blocks.splice(clamped, 0, blockToInsert);
    return snapshot;
  });
}
```

## Leitura guiada

Esse é o coração da interação.

A função aceita dois mundos:

- bloco novo vindo da toolbox;
- bloco existente sendo movido.

Em termos didáticos, isso é muito bom para mostrar um estado imutável controlado:

- cria snapshot;
- calcula origem;
- calcula destino;
- devolve um novo estado.

## Trecho 2 - salvar rascunho

```tsx
body: JSON.stringify({
  title,
  slug,
  description,
  seo: { ... },
  theme: {
    backgroundColor: themeBackgroundColor,
    textColor: themeTextColor,
    accentColor: themeAccentColor,
  },
  layoutPreset,
  slots,
}),
```

## O que isso ensina

O editor não salva só blocos.

Ele salva um documento composto por:

- identidade da página;
- rota;
- SEO;
- tema local da página;
- preset de layout;
- slots e blocos.

Ou seja, a página dinâmica é tratada como entidade completa.

## Trecho 3 - namespace dentro do editor

```tsx
const [namespaceId, setNamespaceId] = useState<SiteRouteNamespaceId>('landing');
const [customPrefix, setCustomPrefix] = useState('');
const [leafPath, setLeafPath] = useState('');
const composedSlug = useMemo(
  () => buildNamespacedRoutePath({ namespaceId, customPrefix, leafPath }),
  [customPrefix, leafPath, namespaceId],
);
```

## Leitura técnica

O editor reaproveita a mesma lógica de namespace do cadastro de rotas.

Isso evita um problema comum de painel administrativo:

- criar em uma tela com uma regra;
- editar em outra com uma regra diferente.

## Ordem de execução do editor

1. carrega rotas e páginas;
2. seleciona a página atual;
3. hidrata namespace, slug, preset, slots e blocos;
4. o operador move e edita blocos;
5. `saveDraft` persiste o documento;
6. `publishOrDraft` muda o estado público da página.

## Explicando de forma simples

> "O editor visual é um composer. Ele não é um CMS WYSIWYG solto. Ele manipula uma estrutura declarativa de slots e blocos. O drag-and-drop é só a UX por cima dessa estrutura."

## Próxima leitura

- [[05 - Painel - Cadastro de Rotas]]
- [[08 - Painel - Persistencia e Publicacao]]
