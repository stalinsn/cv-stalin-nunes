import React, { useState } from 'react';
import '@/styles/components/confirm-translate-modal.css';

interface ConfirmTranslateModalProps {
  open: boolean;
  languageLabel: string;
  onConfirm: (token: string) => void;
  onCancel: () => void;
  error?: string | null;
}

export default function ConfirmTranslateModal({
  open,
  languageLabel,
  onConfirm,
  onCancel,
  error,
}: ConfirmTranslateModalProps) {
  const [token, setToken] = useState('');
  const [internalError, setInternalError] = useState('');
  React.useEffect(() => {
    setInternalError(error || '');
  }, [error]);
  if (!open) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2 className="text-lg font-semibold mb-4">
          Confirmação de Tradução
        </h2>
        <p className="mb-6">
          Deseja traduzir para o idioma selecionado?
          <br />
          <strong>{languageLabel}</strong>
        </p>
        <input
          className="token-input confirm-modal-input"
          type="text"
          placeholder="Insira seu token de autorização"
          value={token}
          onChange={e => { setToken(e.target.value); setInternalError(''); }}
        />
        {(internalError) && <div className="confirm-modal-error">{internalError}</div>}
        <div className="flex gap-4 justify-end">
          <button
            className="btn btn-primary"
            onClick={() => {
              if (!token.trim()) {
                setInternalError('Informe o token para liberar a tradução IA!');
                return;
              }
              onConfirm(token.trim());
            }}
          >
            Sim
          </button>
          <button className="btn btn-secondary" onClick={onCancel}>
            Não
          </button>
        </div>
      </div>
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .modal-card {
          background: var(--card-bg);
          color: var(--text);
          border-radius: 12px;
          padding: 2.5rem 3rem;
          box-shadow: 0 4px 32px rgba(0, 0, 0, 0.18);
          min-width: 340px;
          max-width: 90vw;
          text-align: center;
        }
        .flex {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
        }
        .btn {
          padding: 0.75rem 2.25rem;
          border-radius: 8px;
          font-weight: 500;
          border: none;
          cursor: pointer;
          font-size: 1.1rem;
          transition: background 0.2s;
        }
        .btn-primary {
          background: var(--accent);
          color: #fff;
        }
        .btn-primary:hover {
          background: var(--accent-hover, #0056b3);
        }
        .btn-secondary {
          background: var(--card-bg);
          color: var(--text);
          border: 1px solid var(--border);
        }
        .btn-secondary:hover {
          background: var(--bg);
        }
      `}</style>
    </div>
  );
}
