import React from 'react';

interface PrivacyModalProps {
  open: boolean;
  onClose: () => void;
}

export default function PrivacyModal({ open, onClose }: PrivacyModalProps) {
  if (!open) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: 520, textAlign: 'left' }}>
        <h2 style={{marginBottom: 16}}>Política de Privacidade</h2>
        <p style={{marginBottom: 12}}>
          <b>Transparência é coisa séria (mas pode ser leve):</b>
        </p>
        <ul style={{marginBottom: 16, paddingLeft: 20, color: 'var(--text)'}}>
          <li>Coletamos apenas dados técnicos: <b>IP</b>, <b>navegador</b> (user agent), idioma, estatísticas de uso e um hash do texto traduzido.<br/>
            <span style={{fontSize:'0.93em',color:'var(--text-light)',fontStyle:'italic',display:'block',marginTop:2}}>
              (O hash é um código matemático que funciona como um “carimbo único” do dado: não revela o conteúdo, só marca que aquele texto já passou por aqui.)
            </span>
          </li>
          <li><b>Não coletamos</b> nome, e-mail, CPF, endereço ou qualquer dado pessoal sensível.</li>
          <li>Esses dados servem <b>exclusivamente</b> para controle acadêmico, limitação de uso da IA e evitar abusos.</li>
          <li>Não vendemos, compartilhamos ou usamos seus dados para fins comerciais.</li>
          <li>Se quiser que seus dados sejam removidos, é só pedir: deletamos rapidinho!</li>
          <li>Todos os dados ficam armazenados de forma segura e não são expostos publicamente.</li>
        </ul>
        <p style={{marginBottom: 12}}>
          <b>Resumo:</b> O currículo é meu, mas sua privacidade é sua mesmo. Só queremos garantir que todo mundo possa brincar com IA sem sustos (e sem falir o dono do site 😅).
        </p>
        <div style={{textAlign:'right'}}>
          <button
            className="btn btn-primary"
            style={{marginTop: 8}}
            onClick={onClose}
          >
            Fechar
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
