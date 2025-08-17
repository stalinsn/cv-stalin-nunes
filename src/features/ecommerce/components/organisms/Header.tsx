"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { isOn } from '../../config/featureFlags';
import { useCart } from '../../state/CartContext';
import { Button } from '../atoms/Button';
import { useUI } from '../../state/UIContext';
import { DepartmentsDropdown } from './Dropdowns';
import { Modal } from '../atoms/Modal';
import dynamic from 'next/dynamic';
const DeliveryModal = dynamic(() => import('../molecules/DeliveryModal').then(module => module.DeliveryModal), { ssr: false });
import { SearchIcon, CartIcon, MenuIcon } from '../atoms/Icon';

export default function Header() {
  const { totalItems } = useCart();
  const { toggleCart } = useUI();
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [term, setTerm] = useState('');
  const [hydrated, setHydrated] = useState(false);
  const router = useRouter();
  useEffect(() => { setHydrated(true); }, []);
  
  if (!isOn('ecom.header')) return null;
  return (
    <header className="ecom-header">
      <div className="container">
        <div className="ecom-header__promo" role="note" aria-label="Promoções">
          <strong>Prime</strong> • Frete grátis e ofertas exclusivas
        </div>
        <div className="ecom-header__delivery">
          <button 
            className="delivery-pill" 
            aria-label="Selecionar como deseja receber"
            onClick={() => setIsDeliveryModalOpen(true)}
          >
            <span className="pill-ico" aria-hidden>📍</span>
            <span>Como deseja receber suas compras?</span>
          </button>
        </div>
        <div className="ecom-header__util">
          <div className="ecom-header__loc">
            <button 
              className="delivery-trigger"
              onClick={() => setIsDeliveryModalOpen(true)}
            >
              Retirar em loja
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
            <Button variant="icon" aria-label="Favoritos" data-fav>❤</Button>
            <Button 
              variant="icon" 
              aria-label="Ver carrinho" 
              onClick={toggleCart}
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
  );
}
