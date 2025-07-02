import React from "react";

interface FallbackModalProps {
  open: boolean;
  onAccept: () => void;
  onCancel: () => void;
}

const FallbackModal: React.FC<FallbackModalProps> = ({ open, onAccept, onCancel }) => {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 8,
        padding: 32,
        maxWidth: 400,
        boxShadow: '0 2px 16px rgba(0,0,0,0.2)'
      }}>
        <h2 style={{marginBottom: 16}}>Tradução com IA indisponível</h2>
        <p style={{marginBottom: 24}}>A tradução automática com IA está indisponível no momento.<br />Deseja usar a tradução padrão (mock)?</p>
        <div style={{display: 'flex', gap: 16, justifyContent: 'flex-end'}}>
          <button onClick={onCancel} style={{padding: '8px 16px'}}>Não</button>
          <button onClick={onAccept} style={{padding: '8px 16px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: 4}}>Sim</button>
        </div>
      </div>
    </div>
  );
};

export default FallbackModal;
