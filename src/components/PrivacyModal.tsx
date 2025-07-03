import React from 'react';
import { labels } from '@/data/labels';

interface PrivacyModalProps {
  open: boolean;
  onClose: () => void;
  lang: keyof typeof labels.privacyModalTitle;
}

export default function PrivacyModal({ open, onClose, lang }: PrivacyModalProps) {
  const langKey = lang;
  return !open ? null : (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: 520, textAlign: 'left' }}>
        <h2 style={{marginBottom: 16}}>{labels.privacyModalTitle?.[langKey] || 'Política de Privacidade'}</h2>
        <p style={{marginBottom: 12}}>
          <b>{labels.privacyModalTransparency?.[langKey] || 'Transparência é coisa séria (mas pode ser leve):'}</b>
        </p>
        <ul style={{marginBottom: 16, paddingLeft: 20, color: 'var(--text)'}}>
          <li>
            {labels.privacyModalList1Main?.[langKey]}{' '}
            <span style={{ fontStyle: 'italic', color: 'var(--accent)', fontSize: '0.98em' }}>
              {labels.privacyModalList1Hash?.[langKey]}
            </span>
          </li>
          <li>{labels.privacyModalList2?.[langKey]}</li>
          <li>{labels.privacyModalList3?.[langKey]}</li>
          <li>{labels.privacyModalList4?.[langKey]}</li>
          <li>{labels.privacyModalList5?.[langKey]}</li>
          <li>{labels.privacyModalList6?.[langKey]}</li>
        </ul>
        <p style={{marginBottom: 12}}>
          <b>Resumo:</b> {labels.privacyModalSummary?.[langKey] || 'O currículo é meu, mas sua privacidade é sua mesmo. Só queremos garantir que todo mundo possa brincar com IA sem sustos (e sem falir o dono do site 😅).'}
        </p>
        <div style={{textAlign:'right'}}>
          <button
            className="btn btn-primary"
            style={{marginTop: 8}}
            onClick={onClose}
          >
            {labels.privacyModalClose?.[langKey] || 'Fechar'}
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
          background: rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .modal-card {
          background: var(--card-bg);
          color: var(--text);
          border-radius: 12px;
          padding: 2.5rem 2.5rem 1.5rem 2.5rem;
          box-shadow: 0 4px 32px rgba(0,0,0,0.18);
          min-width: 340px;
          max-width: 90vw;
        }
        .btn-primary {
          background: var(--accent);
          color: #fff;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          padding: 0.7em 2.2em;
          font-size: 1.1em;
          cursor: pointer;
        }
        .btn-primary:hover {
          background: var(--accent-hover, #0056b3);
        }
      `}</style>
    </div>
  );
}
