"use client";
import React, { useState } from 'react';
import { Button } from '../atoms/Button';
import { useOrderForm } from '../../state/OrderFormContext';
import { inRange, lookupCep, estimateShipping } from '../../lib/cepService';
import { useUI } from '../../state/UIContext';

type DeliveryOption = 'delivery' | 'pickup';

type DeliveryModalProps = {
  onClose: () => void;
};

const mockStores = [
  {
    id: '1',
    name: 'SuperMart Centro',
    address: 'Rua das Flores, 123 - Centro - 01000-000 - São Paulo - SP'
  },
  {
    id: '2', 
    name: 'SuperMart Shopping Norte',
    address: 'Avenida Principal, 456 - Zona Norte - 02000-000 - São Paulo - SP'
  },
  {
    id: '3',
    name: 'SuperMart Vila Nova', 
    address: 'Rua da Esperança, 789 - Vila Nova - 03000-000 - São Paulo - SP'
  },
  {
    id: '4',
    name: 'SuperMart Jardins',
    address: 'Avenida Paulista, 1000 - Jardins - 04000-000 - São Paulo - SP'
  },
  {
    id: '5',
    name: 'SuperMart Zona Sul',
    address: 'Rua dos Comerciantes, 555 - Zona Sul - 05000-000 - São Paulo - SP'
  }
];

export function DeliveryModal({ onClose }: DeliveryModalProps) {
  const [step, setStep] = useState<'options' | 'cep' | 'stores'>('options');
  const [selectedOption, setSelectedOption] = useState<DeliveryOption>('delivery');
  const [cep, setCep] = useState('');
  const [selectedStore, setSelectedStore] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setShipping } = useOrderForm();
  const { showToast } = useUI();

  const RANGE_START = '00000-001';
  const RANGE_END = '40000-999';

  const handleOptionSelect = (option: DeliveryOption) => {
    setSelectedOption(option);
    if (option === 'delivery') {
      setStep('cep');
    } else {
      setStep('stores');
    }
  };

  const handleCepSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      const ok = inRange(cep, RANGE_START, RANGE_END);
      if (!ok) {
        const msg = `Entregamos somente entre ${RANGE_START} e ${RANGE_END}.`;
        setError(msg);
        showToast(msg, 'error');
        return;
      }
      const addr = await lookupCep(cep);
      const { option } = estimateShipping(cep);
      setShipping({
        address: addr
          ? {
              street: addr.street,
              neighborhood: addr.neighborhood,
              city: addr.city,
              state: addr.state,
              postalCode: addr.cep,
              country: addr.country,
            }
          : null,
        option,
      });
  showToast('Endereço confirmado e frete calculado.', 'success');
  onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleStoreConfirm = () => {
    if (!selectedStore) return;
    setShipping({
      address: null,
      option: { id: `pickup-${selectedStore}`, name: 'Retire em loja', price: 0, estimate: '1-2h' },
    });
    onClose();
  };

  if (step === 'options') {
    return (
      <div className="delivery-modal">
        <h2 className="delivery-modal__title">Como deseja receber suas compras?</h2>
        
        <div className="delivery-modal__options">
          <button 
            className={`delivery-option ${selectedOption === 'delivery' ? 'delivery-option--selected' : ''}`}
            onClick={() => handleOptionSelect('delivery')}
          >
            <span className="delivery-option__icon">🚚</span>
            <span>Entrega em casa</span>
          </button>
          
          <button 
            className={`delivery-option ${selectedOption === 'pickup' ? 'delivery-option--selected' : ''}`}
            onClick={() => handleOptionSelect('pickup')}
          >
            <span className="delivery-option__icon">🏪</span>
            <span>Retire em Loja</span>
          </button>
        </div>
      </div>
    );
  }

  if (step === 'cep') {
    return (
      <div className="delivery-modal">
        <h2 className="delivery-modal__title">Como deseja receber suas compras?</h2>
        
        <div className="delivery-modal__options">
          <button 
            className="delivery-option delivery-option--selected"
            onClick={() => setStep('options')}
          >
            <span className="delivery-option__icon">🚚</span>
            <span>Entrega em casa</span>
          </button>
          
          <button 
            className="delivery-option"
            onClick={() => setStep('options')}
          >
            <span className="delivery-option__icon">🏪</span>
            <span>Retire em Loja</span>
          </button>
        </div>

        <div className="delivery-modal__cep">
          <h3>Confira se atendemos sua região</h3>
          <p>Digite o CEP para visualizar ofertas em sua região.</p>
          
          <div className="cep-input-group">
            <input 
              type="text"
              placeholder="Digite seu CEP"
              value={cep}
              onChange={(e) => setCep(e.target.value)}
              className="cep-input"
              maxLength={9}
            />
            <Button onClick={handleCepSubmit} disabled={loading}>{loading ? 'Verificando…' : 'Verificar'}</Button>
          </div>
          {error && <div style={{ color: '#b00020', marginTop: 8 }}>{error}</div>}
          
          <button className="link-button">
            Não sabe seu CEP? Clique aqui
          </button>
          
          <p className="delivery-modal__disclaimer">
            As condições de preço e frete dos produtos podem alterar mediante a modalidade de entrega escolhida
          </p>
        </div>
      </div>
    );
  }

  if (step === 'stores') {
    return (
      <div className="delivery-modal">
        <h2 className="delivery-modal__title">Como deseja receber suas compras?</h2>
        
        <div className="delivery-modal__options">
          <button 
            className="delivery-option"
            onClick={() => setStep('options')}
          >
            <span className="delivery-option__icon">🚚</span>
            <span>Entrega em casa</span>
          </button>
          
          <button 
            className="delivery-option delivery-option--selected"
            onClick={() => setStep('options')}
          >
            <span className="delivery-option__icon">🏪</span>
            <span>Retire em Loja</span>
          </button>
        </div>

        <div className="delivery-modal__stores">
          <h3>Selecione a loja para retirada:</h3>
          
          <div className="stores-list">
            {mockStores.map((store) => (
              <label key={store.id} className="store-option">
                <input 
                  type="radio"
                  name="selectedStore"
                  value={store.id}
                  checked={selectedStore === store.id}
                  onChange={(e) => setSelectedStore(e.target.value)}
                />
                <div className="store-info">
                  <h4>{store.name}</h4>
                  <p>{store.address}</p>
                </div>
              </label>
            ))}
          </div>
          
          <Button 
            onClick={handleStoreConfirm}
            disabled={!selectedStore}
            className="w-full"
          >
            Confirmar
          </Button>
          
          <p className="delivery-modal__disclaimer">
            As condições de preço e frete dos produtos podem alterar mediante a modalidade de entrega escolhida
          </p>
        </div>
      </div>
    );
  }

  return null;
}
