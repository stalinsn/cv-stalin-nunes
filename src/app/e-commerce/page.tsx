import React from 'react';
import Header from '../../features/ecommerce/components/organisms/Header';
import Footer from '../../features/ecommerce/components/organisms/Footer';
import HeroBanner from '../../features/ecommerce/components/organisms/HeroBanner';
import Showcase from '../../features/ecommerce/components/organisms/Showcase';
import ServicesBar from '../../features/ecommerce/components/organisms/ServicesBar';
import Carousel from '../../features/ecommerce/components/organisms/Carousel';
import ProductCard from '../../features/ecommerce/components/molecules/ProductCard';
import raw from '../../features/ecommerce/data/products.json';
import { mapToUIProduct } from '../../features/ecommerce/lib/mapProduct';
import type { EcommerceItem } from '../../features/ecommerce/types/product';
import { HeroBannerLarge, StripsBelow } from '../../features/ecommerce/components/organisms/Banners';
import CartMini from '../../features/ecommerce/components/organisms/CartMini';
import DrawerCart from '../../features/ecommerce/components/organisms/DrawerCart';
import '../../styles/ecommerce.css';

export default function EcommerceHome() {
  const data = (raw as unknown as EcommerceItem[]).map(mapToUIProduct);
  return (
  <main className="ecom" data-theme="light">
      <Header />
      <HeroBanner />
  <HeroBannerLarge />
  <ServicesBar />
      <Carousel title="Principais Ofertas">
    {data.map((p) => (
          <div key={p.id} style={{ scrollSnapAlign: 'start' }}>
      <ProductCard id={p.id} name={p.name} image={p.image} price={p.price} listPrice={p.listPrice} unit={p.unit} packSize={p.packSize} />
          </div>
        ))}
      </Carousel>
  <StripsBelow />

      <section className="container ecom-section">
        <Showcase title="Ofertas do dia" flag="ecom.showcaseDaily" />
        <Showcase title="Para sua despensa" flag="ecom.showcaseGrocery" />
      </section>
  <CartMini />
      <Footer />
  <DrawerCart />
    </main>
  );
}
