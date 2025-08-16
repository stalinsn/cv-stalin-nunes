"use client";
import React, { useState } from 'react';
import { isOn } from '../../config/featureFlags';
import { useCart } from '../../state/CartContext';
import { Button } from '../atoms/Button';
import { useUI } from '../../state/UIContext';
import { DepartmentsDropdown, ServicesDropdown } from './Dropdowns';
import { Modal } from '../atoms/Modal';
import { DeliveryModal } from '../molecules/DeliveryModal';

export default function Header() {
  // Hooks must be called unconditionally
  const { totalItems } = useCart();
  const { toggleCart } = useUI();
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  
  if (!isOn('ecom.header')) return null;
  return (
    <header className="ecom-header">
      <div className="container">
        {/* Util row */}
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

        {/* Brand + Search */}
        <div className="ecom-header__top">
          <div className="ecom-header__brand">SuperMart</div>
          <div className="ecom-header__search">
            <input placeholder="Pesquise aqui por produto e/ou marca..." aria-label="Buscar" />
            <Button>Buscar</Button>
          </div>
          <div className="ecom-header__actions">
            <Button variant="icon" aria-label="Favoritos">❤</Button>
            <Button variant="icon" aria-label="Ver carrinho" onClick={toggleCart}>🛒<span className="ecom-header__badge">{totalItems}</span></Button>
          </div>
        </div>

        {/* Nav row */}
        <nav className="ecom-header__nav">
          <DepartmentsDropdown />
          <ServicesDropdown />
          <span className="ecom-nav__meta">Atacado e Varejo</span>
        </nav>
      </div>
      
      {/* Modal de Regionalização */}
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
