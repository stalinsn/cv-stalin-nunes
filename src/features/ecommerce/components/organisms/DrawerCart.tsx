"use client";
import React from 'react';
import { useCart } from '../../state/CartContext';
import { useUI } from '../../state/UIContext';
import Image from 'next/image';
import { Button } from '../atoms/Button';

export default function DrawerCart() {
  const { isCartOpen, closeCart } = useUI();
  const { state, inc, dec, remove, subtotal, totalItems, clear } = useCart();
  const items = Object.values(state.items);
  return (
    <div className={`drawer ${isCartOpen ? 'open' : ''}`} aria-hidden={!isCartOpen}>
      <div className="drawer__overlay" onClick={closeCart} />
      <aside className="drawer__panel" aria-label="Meu carrinho" role="dialog" aria-modal="true">
        <header className="drawer__header">
          <button className="drawer__close" aria-label="Fechar" onClick={closeCart}>×</button>
          <strong>Meu carrinho</strong>
          <span>{totalItems} itens</span>
          <button className="drawer__clear" onClick={clear}>Esvaziar</button>
        </header>
        <div className="drawer__content">
          {items.length === 0 ? (
            <div className="drawer__empty">Seu carrinho está vazio.</div>
          ) : (
            <ul className="drawer__list">
              {items.map((it) => (
                <li key={it.id} className="drawer__item">
                  <Image src={it.image || '/file.svg'} alt={it.name} width={48} height={48} />
                  <div className="drawer__info">
                    <div className="drawer__title">{it.name}</div>
                    <div className="drawer__price">R$ {(it.price).toFixed(2)} <small>un</small></div>
                  </div>
                  <div className="drawer__qty">
                    <Button variant="ghost" onClick={() => dec(it.id)}>-</Button>
                    <span>{it.qty}</span>
                    <Button variant="ghost" onClick={() => inc(it.id)}>+</Button>
                  </div>
                  <button className="drawer__remove" aria-label="Remover" onClick={() => remove(it.id)}>🗑</button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <footer className="drawer__footer">
          <div className="drawer__total"><span>Total</span><strong>R$ {subtotal.toFixed(2)}</strong></div>
          <small className="drawer__note">Os custos de transporte serão calculados ao selecionar o método de envio.</small>
          <Button className="drawer__checkout">Finalizar pedido</Button>
        </footer>
      </aside>
    </div>
  );
}
