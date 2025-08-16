"use client";
import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Header from '../../../../features/ecommerce/components/organisms/Header';
import Footer from '../../../../features/ecommerce/components/organisms/Footer';
import DrawerCart from '../../../../features/ecommerce/components/organisms/DrawerCart';
import { PdpBreadcrumbs } from '../../../../features/ecommerce/components/pdp/PdpBreadcrumbs';
import { PdpGallery } from '../../../../features/ecommerce/components/pdp/PdpGallery';
import { PdpPriceActions } from '../../../../features/ecommerce/components/pdp/PdpPriceActions';

import raw from '../../../../features/ecommerce/data/products.json';
import { mapToUIProduct } from '../../../../features/ecommerce/lib/mapProduct';
import type { EcommerceItem } from '../../../../features/ecommerce/types/product';
import '../../../../styles/ecommerce/index.css';
import Showcase from '../../../../features/ecommerce/components/organisms/Showcase';

function Tabs() {
  const [active, setActive] = React.useState(0);
  return (
    <div>
      <div className="tabs" role="tablist" aria-label="Informações do produto">
        <button role="tab" id="tab-desc" aria-selected={active === 0} className={`tab ${active === 0 ? 'is-active' : ''}`} onClick={() => setActive(0)}>Descrição</button>
        <button role="tab" id="tab-feat" aria-selected={active === 1} className={`tab ${active === 1 ? 'is-active' : ''}`} onClick={() => setActive(1)}>Características</button>
        <button role="tab" id="tab-rev" aria-selected={active === 2} className={`tab ${active === 2 ? 'is-active' : ''}`} onClick={() => setActive(2)}>Avaliações dos Clientes</button>
      </div>

      <div className="tab-panel" role="tabpanel" aria-labelledby={active === 0 ? 'tab-desc' : active === 1 ? 'tab-feat' : 'tab-rev'}>
        {active === 0 && (
          <div>
            <p>
              • Sabão em Pó Lavagem Perfeita OMO permite uma brancura imbatível* enquanto cuida das roupas pretas e não desgasta os tecidos. Este detergente possui um perfume exclusivo que dura por muito tempo.
            </p>
          </div>
        )}
        {active === 1 && (
          <div>
            <ul>
              <li>Fórmula com Biotecnologia</li>
              <li>Rende mais por lavagem</li>
              <li>Indicado para roupas brancas e coloridas</li>
            </ul>
          </div>
        )}
        {active === 2 && (
          <div>
            <p>Nenhuma avaliação ainda. Seja o primeiro a avaliar este produto.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function useProductBySlug(slug: string) {
  const all = (raw as unknown as EcommerceItem[]).map(mapToUIProduct);
  // Try match by detailUrl slug (/slug/p) or by id fallback
  const bySlug = all.find((p) => p.url && p.url.includes(`/${slug}/p`));
  if (bySlug) return bySlug;
  return all.find((p) => p.id === slug) || null;
}

export default function ProductDetailPage() {
  const routeParams = useParams<{ slug: string }>();
  const slug = typeof routeParams?.slug === 'string' ? routeParams.slug : Array.isArray(routeParams?.slug) ? routeParams.slug[0] : '';
  const product = useProductBySlug(slug);

  if (!product) {
    return (
      <main className="ecom" data-theme="light">
        <Header />
        <section className="container pdp pdp-empty">
          <h1>Produto não encontrado</h1>
          <p>Não encontramos este produto. Volte para a página inicial e continue comprando.</p>
          <Link href="/e-commerce" className="pdp-back">Voltar para a Home</Link>
        </section>
        <Footer />
        <DrawerCart />
      </main>
    );
  }

  return (
    <main className="ecom" data-theme="light">
      <Header />

      <PdpBreadcrumbs name={product.name} categoryPath={product.categoryPath} />

  <section className="container pdp">
        {/* Gallery à esquerda */}
        <PdpGallery image={product.image} name={product.name} price={product.price} listPrice={product.listPrice} />

        {/* Info à direita */}
        <div className="pdp__info">
          <h1 className="pdp__title">{product.name}</h1>
          
          <div className="pdp__meta">
            {product.unit && <span className="meta-pill">/ {product.unit}</span>}
            {product.packSize && <span className="meta-pill">Pacote c/ {product.packSize}</span>}
          </div>

          {/* Preço com desconto tachado */}
          <div className="pdp__pricing">
            {product.listPrice && product.listPrice > product.price && (
              <span className="price-original">R$ {product.listPrice.toFixed(2)}</span>
            )}
            <span className="price-current">R$ {product.price.toFixed(2)}</span>
            {product.unit && <span className="price-unit">/ {product.unit}</span>}
          </div>

          {/* Badge Prime */}
          <div className="prime-section">
            <div className="prime-badge">
              <span className="prime-logo">prime</span>
              <span className="prime-text">Até 5 unidades, demais unidades poderão ser...</span>
            </div>
          </div>

          {/* Botão de adicionar */}
          <PdpPriceActions id={product.id} name={product.name} image={product.image} price={product.price} listPrice={product.listPrice} unit={product.unit} packSize={product.packSize} />

          {/* Sobre o produto */}
          <div className="pdp__about">
            <h3>Sobre o produto</h3>
            <p>
              Informações do produto, detalhes e especificações. Este bloco é um placeholder para
              descrição, origem, conservação e outros atributos.
            </p>
          </div>
        </div>
      </section>

      {/* Tabs: Descrição / Características / Avaliações (interactive) */}
      <section className="container pdp-tabs" aria-labelledby="pdp-tabs">
        <Tabs />
      </section>

  <section className="container pdp__extra">
        <div className="pdp__panel">
          <h3>Informações nutricionais</h3>
          <p>Conteúdo ilustrativo. Adicione aqui tabela e observações.</p>
        </div>
        <div className="pdp__panel">
          <h3>Conservação</h3>
          <p>Mantenha refrigerado/ambiente conforme o tipo de produto.</p>
        </div>
      </section>

      {/* Related products shelf */}
      <section className="container pdp-related">
        <Showcase title="Produtos Relacionados" flag="ecom.showcaseGrocery" />
      </section>

      <Footer />
      <DrawerCart />
    </main>
  );
}
