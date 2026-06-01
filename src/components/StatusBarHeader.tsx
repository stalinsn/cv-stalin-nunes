import React from 'react';

interface StatusBarHeaderProps {
  loading: boolean;
  statusMessage: string;
  usosRestantes?: number | null;
  expanded: boolean;
  setVisible: (v: boolean) => void;
  setExpanded: (v: boolean) => void;
}

export default function StatusBarHeader({
  loading,
  statusMessage,
  usosRestantes,
  expanded,
  setVisible,
  setExpanded,
}: StatusBarHeaderProps) {
  return (
    <div className="statusbar-header-content">
      <p className="statusbar-title" style={!expanded ? { fontSize: '1.08rem', fontWeight: 600, marginRight: 8, marginBottom: 0 } : {}}>
        {statusMessage}
        {usosRestantes !== undefined && usosRestantes !== null && statusMessage.includes('Tradução concluída') && (
          <span className="statusbar-title-remaining" style={!expanded ? { color: 'var(--accent)', fontWeight: 500, marginLeft: 6 } : {}}>
            ({usosRestantes} uso{usosRestantes === 1 ? '' : 's'} restantes)
          </span>
        )}
      </p>
      {!expanded && !loading && (
        <button
          className="statusbar-close-btn"
          title="Fechar barra de status"
          onMouseDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation();
            setVisible(false);
          }}
          aria-label="Fechar barra de status"
          style={{ marginLeft: 'auto', marginRight: 0 }}
        >
          ×
        </button>
      )}
      <div className="statusbar-flex">
        <button
          onMouseDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation();
            setExpanded(!expanded);
          }}
          className="statusbar-btn"
          title={expanded ? 'Recolher' : 'Expandir'}
          aria-label={expanded ? 'Recolher estatísticas' : 'Expandir estatísticas'}
          type="button"
        >
          {expanded ? '⬆️' : '⬇️'}
        </button>
      </div>
    </div>
  );
}
