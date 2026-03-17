---
tags:
  - guia
  - ecommerce
  - pdp
---

# PDP - Página e Galeria

## O que você encontra aqui

Esta nota explica dois pontos da PDP:

- como a página do produto é montada;
- como a galeria de imagens funciona.

## Arquivos principais

- `src/app/e-commerce/[slug]/p/page.tsx`
- `src/features/ecommerce/components/pdp/PdpGallery.tsx`

## Trecho 1 - o carregamento da página

```tsx
function useProductBySlug(slug: string) {
  const [prod, setProd] = React.useState<UIProduct | null>(null);
  React.useEffect(() => {
    let alive = true;
    getProductBySlugUnified(slug).then((p) => { if (alive) setProd(p); });
    return () => { alive = false; };
  }, [slug]);
  return prod;
}

export default function ProductDetailPage() {
  const routeParams = useParams<{ slug: string }>();
  const slug = typeof routeParams?.slug === 'string' ? routeParams.slug : '';
  const product = useProductBySlug(slug);

  if (!product) {
    return <section className="container pdp pdp-empty">...</section>;
  }

  return (
    <>
      {isOn('ecom.pdp.gallery') ? <PdpGallery image={product.image} name={product.name} price={product.price} listPrice={product.listPrice} /> : null}
      <div className="pdp__info">...</div>
    </>
  );
}
```

## Explicação em linguagem natural

Aqui a página segue um modelo bem clássico de React orientado a estado e efeito, não orientado a objeto.

A ordem mental é esta:

1. a rota entrega o `slug` do produto;
2. o hook `useProductBySlug` observa esse `slug`;
3. quando ele muda, o `useEffect` dispara a busca do produto;
4. quando a promessa resolve, o produto entra no estado;
5. a página deixa de renderizar fallback e passa a renderizar a PDP completa.

O detalhe do `alive` é didático: ele evita atualizar estado se o componente desmontar antes da promise voltar.

## Trecho 2 - a galeria

```tsx
const thumbs = [image || fallback, image || fallback, image || fallback, image || fallback];
const [active, setActive] = useState<number>(0);
const [isZooming, setIsZooming] = useState(false);
const [zoomOrigin, setZoomOrigin] = useState<{ x: number; y: number }>({ x: 50, y: 50 });

const prev = useCallback(() => setActive((s) => (s - 1 + thumbs.length) % thumbs.length), [thumbs.length]);
const next = useCallback(() => setActive((s) => (s + 1) % thumbs.length), [thumbs.length]);
```

```tsx
<div
  className="pdp__image"
  onMouseEnter={() => setIsZooming(true)}
  onMouseLeave={() => setIsZooming(false)}
  onMouseMove={(e) => {
    const rect = imageWrapperRef.current.getBoundingClientRect();
    const percentX = ((e.clientX - rect.left) / rect.width) * 100;
    const percentY = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomOrigin({ x: percentX, y: percentY });
  }}
>
  <Image
    src={thumbs[active]}
    style={{
      transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
      transform: isZooming ? 'scale(1.8)' : 'scale(1)',
    }}
  />
</div>
```

## Lógica por tras

A galeria não usa um hook externo especializado. Ela é um componente composto por:

- estado de indice ativo;
- estado de zoom;
- eventos de mouse;
- eventos de toque;
- callbacks de navegação.

Ela não é cíclica no sentido de algoritmo recursivo. O que ela tem é um comportamento circular na navegação:

- `prev` e `next` usam módulo para voltar ao inicio ou ao fim da lista.

Isso é importante na explicação: a galeria não está "rodando em loop" sozinha. Ela reage a eventos do usuário.

## Ordem de execução da interação

1. o componente monta com `active = 0`;
2. o usuário clica em miniatura ou seta;
3. `setActive` muda o indice;
4. o `Image` troca para `thumbs[active]`;
5. se houver hover, o `mousemove` recalcula `zoomOrigin`;
6. o `transform-origin` muda e o zoom parece acompanhar o cursor.

## Explicando de forma simples

Uma forma simples de falar seria:

> "A PDP primeiro descobre qual produto a rota pediu. Depois disso ela liga os módulos da página conforme as feature flags. A galeria é um componente client-side com estado local. Ela controla qual imagem está ativa e em que ponto o zoom vai se apoiar. Não existe magia: é estado + evento + renderização reativa."

## Próxima leitura

- [[02 - Home - Template e Flags]]
- [[04 - Runtime - Template e Tema]]
