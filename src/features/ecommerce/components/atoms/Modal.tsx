"use client";
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

function ScrollLock() {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);
  return null;
}

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
};

export function Modal({ isOpen, onClose, children, className = '' }: ModalProps) {
  if (!isOpen) return null;

  const content = (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`modal-content ${className}`}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Fechar modal"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );

  // Render via portal to ensure overlay covers the full viewport
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    return createPortal(<><ScrollLock />{content}</>, document.body);
  }
  return <><ScrollLock />{content}</>;
}
