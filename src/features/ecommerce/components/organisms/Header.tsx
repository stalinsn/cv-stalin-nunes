"use client";
import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { isOn } from '../../config/featureFlags';
import { useCart } from '../../state/CartContext';
import { useOrderForm } from '../../state/OrderFormContext';
import { Button } from '../atoms/Button';
import { useUI } from '../../state/UIContext';
import { DepartmentsDropdown } from './Dropdowns';
import { Modal } from '../atoms/Modal';
import dynamic from 'next/dynamic';
const DeliveryModal = dynamic(() => import('../molecules/DeliveryModal').then(module => module.DeliveryModal), { ssr: false });
import { SearchIcon, CartIcon, MenuIcon } from '../atoms/Icon';

export default function Header() {
  const { totalItems } = useCart();
  const { orderForm } = useOrderForm();
  const { toggleCart } = useUI();
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [term, setTerm] = useState('');
  const [hydrated, setHydrated] = useState(false);
  const [isCondensed, setIsCondensed] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const headerRef = React.useRef<HTMLElement | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    setHydrated(true);
  }, []);
  useEffect(() => {
    const onScroll = () => {
      const offsetY = window.scrollY || 0;
      setIsCondensed(offsetY > 64);
      setShowBackToTop(offsetY > 520);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    const element = headerRef.current;
    if (!element || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => {
      const nextHeight = Math.ceil(element.getBoundingClientRect().height);
      setHeaderHeight(nextHeight);
    });
    observer.observe(element);
    setHeaderHeight(Math.ceil(element.getBoundingClientRect().height));
    return () => observer.disconnect();
  }, [isCondensed, hydrated, totalItems]);
  const isCheckoutFlow = pathname.startsWith('/e-commerce/checkout');
  const isCartFlow = pathname.startsWith('/e-commerce/cart');
  const isSimpleHeader = isCheckoutFlow || isCartFlow;
  const selectedAddress = orderForm.shipping.selectedAddress;
  const selectedOption = orderForm.shipping.deliveryOptions[orderForm.shipping.deliveryOptions.length - 1];
  const cepDigits = (selectedAddress?.postalCode || '').replace(/\D/g, '');
  const formattedCep = cepDigits.length === 8 ? cepDigits.replace(/(\d{5})(\d{3})/, '$1-$2') : '';
  const regionalizationSummary = selectedOption?.id?.startsWith('pickup')
    ? 'Retirada em loja selecionada'
    : formattedCep
      ? `Entregar no CEP ${formattedCep}`
      : 'Como deseja receber suas compras?';
  const deliverySummaryLabel = hydrated ? regionalizationSummary : 'Como deseja receber suas compras?';
  const deliveryModeLabel = hydrated && selectedOption?.id?.startsWith('pickup')
    ? 'Retirada em loja ativa'
    : 'Retirar em loja';
  
  if (!isOn('ecom.header')) return null;

  if (isSimpleHeader) {
    return (
      <>
        <header ref={headerRef} className="ecom-header ecom-header--simple">
          <div className="container">
            <div className="ecom-header__simpleRow">
              <div className="ecom-header__brand">
                <Link href="/e-commerce" aria-label="Ir para a Home">SuperMart</Link>
              </div>
              <div className="ecom-header__simpleActions">
                <Link href="/e-commerce" className="ecom-header__simpleLink" data-track-id="simple-header-home">
                  Home
                </Link>
                {isCheckoutFlow ? (
                  <Link href="/e-commerce/cart" className="ecom-header__simpleLink" data-track-id="simple-header-cart">
                    Carrinho
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        </header>
        <div className="ecom-header-spacer" aria-hidden style={{ height: headerHeight }} />
      </>
    );
  }

  return (
    <>
      <header ref={headerRef} className={`ecom-header ${isCondensed ? 'ecom-header--condensed' : ''}`}>
        <div className="container">
          <div className="ecom-header__promo" role="note" aria-label="Promoções">
            <strong>Prime</strong> • Frete grátis e ofertas exclusivas
          </div>
          <div className="ecom-header__delivery">
            <button 
              className="delivery-pill" 
              aria-label="Selecionar como deseja receber"
              data-track-id="header-open-delivery"
              onClick={() => setIsDeliveryModalOpen(true)}
            >
              <span className="pill-ico" aria-hidden>📍</span>
              <span>{deliverySummaryLabel}</span>
            </button>
          </div>
          <div className="ecom-header__util">
            <div className="ecom-header__loc">
              <button 
                className="delivery-trigger"
                data-track-id="header-open-delivery"
                onClick={() => setIsDeliveryModalOpen(true)}
              >
                {deliveryModeLabel}
              </button>
            </div>
            <div className="ecom-header__links">
              <button className="ecom-link">Clube</button>
              <button className="ecom-link">Ajuda</button>
              <button className="ecom-link">Login</button>
            </div>
          </div>

          <div className="ecom-header__top">
            <div className="ecom-header__burger">
              <DepartmentsDropdown trigger={<button className="ecom-nav__btn ecom-nav__btn--departments" aria-label="Abrir menu"><MenuIcon /></button>} />
            </div>
            <div className="ecom-header__brand">
              <Link href="/e-commerce" aria-label="Ir para a Home">SuperMart</Link>
            </div>
            <form
              className="ecom-header__search"
              role="search"
              onSubmit={(e) => {
                e.preventDefault();
                router.push(`/e-commerce/plp?q=${encodeURIComponent(term)}`);
              }}
            >
              <input
                placeholder="Pesquise aqui"
                aria-label="Buscar produtos"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
              />
              <Button type="submit" variant="icon" aria-label="Buscar" className="ecom-header__searchBtn"><SearchIcon size={26} /></Button>
            </form>
            <div className="ecom-header__actions">
              <button className="ecom-header__quick-login" type="button">Login</button>
              <Button variant="icon" aria-label="Favoritos" data-fav>❤</Button>
              <Button 
                variant="icon" 
                aria-label="Ver carrinho" 
                onClick={toggleCart}
                data-track-id="header-open-cart"
                className="ecom-cartBtn"
                data-count={hydrated ? totalItems : 0}
              >
                <CartIcon />
              </Button>
            </div>
          </div>

          <nav className="ecom-header__nav">
            <DepartmentsDropdown />
            <span className="ecom-nav__meta">Atacado e Varejo</span>
          </nav>
        </div>
        
        <Modal 
          isOpen={isDeliveryModalOpen} 
          onClose={() => setIsDeliveryModalOpen(false)}
          className="delivery-modal-wrapper"
        >
          <DeliveryModal onClose={() => setIsDeliveryModalOpen(false)} />
        </Modal>
      </header>
      <div className="ecom-header-spacer" aria-hidden style={{ height: headerHeight }} />
      {showBackToTop ? (
        <button
          type="button"
          className="ecom-back-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Voltar ao topo"
          title="Voltar ao topo"
        >
          ↑
        </button>
      ) : null}
    </>
  );
}
