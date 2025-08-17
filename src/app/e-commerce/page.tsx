import React from 'react';
import HeroBanner from '../../features/ecommerce/components/organisms/HeroBanner';
import Showcase from '../../features/ecommerce/components/organisms/Showcase';
import ServicesBar from '../../features/ecommerce/components/organisms/ServicesBar';
import { HeroBannerLarge, StripsBelow } from '../../features/ecommerce/components/organisms/Banners';
import Carousel from '../../features/ecommerce/components/organisms/Carousel';
import ProductCard from '../../features/ecommerce/components/molecules/ProductCard';
import raw from '../../features/ecommerce/data/products.json';
import { mapToUIProduct } from '../../features/ecommerce/lib/mapProduct';
import type { EcommerceItem } from '../../features/ecommerce/types/product';
import { isOn } from '../../features/ecommerce/config/featureFlags';

export default function EcommerceHome() {
  // Keep mock data available for local testing regardless of flags
  const data = (raw as unknown as EcommerceItem[]).map(mapToUIProduct);
  const demo2 = data.slice(0, 2);
  const demo16 = Array.from({ length: 16 }, (_, i) => data[i % data.length]).map((p, i) => ({ ...p, id: `${p.id}-x${i}` }));
  return (
    <>
      {/* Hero principal */}
      <HeroBanner />

      {/* Ofertas do dia (primeira vitrine após hero) */}
      <Showcase title="Ofertas do dia" flag="ecom.showcaseDaily" />

      {/* Services (pílulas) */}
      <ServicesBar />

  <Showcase title="Para sua despensa" flag="ecom.showcaseGrocery" />

  {/* Combos (demo banners) */}
  {isOn('ecom.demoBanners') && <HeroBannerLarge />}

  {/* Demais faixas (demo) */}
  {isOn('ecom.demoBanners') && <StripsBelow />}

  {/* Demo shelves (kept for testing, gated by flag) */}
  {isOn('ecom.demoShelves') && (
        <Carousel
          title="Exemplo: Somente 2 itens (alinhado à esquerda)"
          config={{ variant: 'default', banner: { image: '/globe.svg', alt: 'Pague como preferir', position: 'left' }, seeMoreHref: '#' }}
        >
          {demo2.map((p) => (
            <ProductCard
              key={p.id}
              id={p.id}
              name={p.name}
              image={p.image}
              price={p.price}
              listPrice={p.listPrice}
              unit={p.unit}
              packSize={p.packSize}
              url={p.url}
            />
          ))}
        </Carousel>
      )}

      {isOn('ecom.demoShelves') && (
        <Carousel
          title="Exemplo: 16 itens (paginado com peek)"
          config={{ variant: 'dark', banner: { image: '/window.svg', alt: 'Prime', position: 'right' }, seeMoreHref: '#' }}
        >
          {demo16.map((p) => (
            <ProductCard
              key={p.id}
              id={p.id}
              name={p.name}
              image={p.image}
              price={p.price}
              listPrice={p.listPrice}
              unit={p.unit}
              packSize={p.packSize}
              url={p.url}
            />
          ))}
        </Carousel>
      )}

  {/* Inline mini-cart removed: use only DrawerCart (layout-client) */}
    </>
  );
}
