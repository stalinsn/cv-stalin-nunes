'use client';

import React, { useState, useRef, useEffect } from 'react';
import '@/styles/statusbar.css';

interface StatusBarProps {
  loading: boolean;
  statusMessage: string;
  tokensUsed: number | null;
  elapsedTime: number | null;
  payloadSize: number | null;
  charCount: number | null;
  model: string;
}

export default function StatusBar({
  loading,
  statusMessage,
  tokensUsed,
  elapsedTime,
  payloadSize,
  charCount,
  model,
}: StatusBarProps) {
  const [expanded, setExpanded] = useState(false);
  const [visible, setVisible] = useState(true);
  const [position, setPosition] = useState({ top: 16, left: 16 });
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const barRef = useRef<HTMLDivElement>(null);

  // Drag preciso e suave: atualiza o estilo diretamente durante o drag
  const onMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    dragOffset.current = {
      x: e.clientX - position.left,
      y: e.clientY - position.top,
    };
    document.body.style.userSelect = 'none';
  };

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (dragging && barRef.current) {
        const left = Math.max(0, e.clientX - dragOffset.current.x);
        const top = Math.max(0, e.clientY - dragOffset.current.y);
        barRef.current.style.left = left + 'px';
        barRef.current.style.top = top + 'px';
      }
    }
    function handleMouseUp(e: MouseEvent) {
      if (dragging && barRef.current) {
        const left = Math.max(0, e.clientX - dragOffset.current.x);
        const top = Math.max(0, e.clientY - dragOffset.current.y);
        setPosition({ left, top }); // só atualiza o estado ao soltar
      }
      setDragging(false);
      document.body.style.userSelect = '';
    }
    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging]);

  // Sempre mostra se loading, senão respeita o visible
  const shouldShow = loading || (statusMessage && visible);
  if (!shouldShow) return null;

  const dolar = 5.2; // Base de conversão manual
  const costUSD = tokensUsed ? (tokensUsed / 1000) * 0.002 : 0;
  const costBRL = costUSD * dolar;
  const speed =
    tokensUsed && elapsedTime ? (tokensUsed / elapsedTime).toFixed(2) : null;
  const requisicoesPorDolar =
    costUSD > 0 ? (1 / costUSD).toFixed(0) : '∞';

  // Função para converter segundos em formato amigável
  function formatSeconds(sec: number) {
    // Corrige se vier em milissegundos (valor muito alto)
    if (sec > 600) sec = sec / 1000;
    if (sec < 60) return `${sec.toFixed(2)}s`;
    const min = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    if (min < 60) return `${min}min ${s}s`;
    const h = Math.floor(min / 60);
    return `${h}h ${min % 60}min ${s}s`;
  }

  // Anedotas para cada estatística
  const anecdotes = {
    tokens: 'Sabia que 1 token é como um pedacinho de frase? Quanto mais tokens, mais caro! 💸',
    elapsed: 'Tempo é dinheiro... mas aqui é só curiosidade mesmo! ⏳',
    speed: 'Se fosse uma tartaruga, seria mais devagar. 🐢',
    payload: 'Daria pra enviar isso por pombo-correio? Talvez não... 🕊️',
    charCount: 'Já pensou em escrever um livro? Esse texto já é um capítulo! 📖',
    cost: 'Com esse valor, quase dá pra comprar um café... ☕',
    reqs: 'Dá pra traduzir muita coisa com 1 dólar, hein? 💵',
    model: 'Esse modelo é mais inteligente que muito humano! 🤖',
  };

  return (
    <div
      ref={barRef}
      className="statusbar-draggable"
      style={{
        position: 'fixed',
        top: position.top,
        left: position.left,
        background: 'rgba(30,30,30,0.82)',
        color: '#fff',
        padding: '0.85rem 1.15rem',
        borderRadius: '12px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.22)',
        zIndex: 9999,
        width: expanded ? '370px' : '230px',
        transition: dragging ? 'none' : 'all 0.3s cubic-bezier(.4,2,.6,1)',
        fontSize: '0.97rem',
        backdropFilter: 'blur(2px)',
        cursor: dragging ? 'grabbing' : 'default',
      }}
    >
      <div
        className="statusbar-header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'grab',
          userSelect: 'none',
        }}
        onMouseDown={onMouseDown}
      >
        <p style={{ margin: 0, fontWeight: 'bold' }}>{statusMessage}</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
            title={expanded ? 'Recolher' : 'Expandir'}
          >
            {expanded ? '⬆️' : '⬇️'}
          </button>
          {!loading && (
            <button
              onClick={() => setVisible(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '1.1rem',
                marginLeft: 2,
              }}
              title="Fechar"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {expanded && (
        <>
          <hr style={{ border: '0.5px solid #333' }} />
          {tokensUsed !== null && (
            <div style={{marginBottom: '0.5em', position:'relative'}}>
              <p style={{margin:0}} className="statusbar-stat-hover" tabIndex={0}>
                🧠 Tokens usados: {tokensUsed}
                <span className="statusbar-anecdote">{anecdotes.tokens}</span>
              </p>
              <div style={{fontSize:'0.82em',color:'#bdbdbd',marginTop:'0.1em'}}>
                Token = unidade de texto para IA (ex: &apos;Olá, mundo!&apos; ≈ 4 tokens)
              </div>
            </div>
          )}
          {elapsedTime !== null && (
            <div style={{marginBottom: '0.5em', position:'relative'}}>
              <p style={{margin:0}} className="statusbar-stat-hover" tabIndex={0}>
                ⏱️ Tempo: {formatSeconds(elapsedTime)}
                <span className="statusbar-anecdote">{anecdotes.elapsed}</span>
              </p>
              <div style={{fontSize:'0.82em',color:'#bdbdbd',marginTop:'0.1em'}}>
                {elapsedTime < 60 ? 'Tradução instantânea!' : `Equivale a ${formatSeconds(elapsedTime)} de processamento.`}
              </div>
            </div>
          )}
          {speed && (
            <div style={{marginBottom: '0.5em', position:'relative'}}>
              <p style={{margin:0}} className="statusbar-stat-hover" tabIndex={0}>
                ⚡ Velocidade: {speed} tokens/s
                <span className="statusbar-anecdote">{anecdotes.speed}</span>
              </p>
              <div style={{fontSize:'0.82em',color:'#bdbdbd',marginTop:'0.1em'}}>
                Quanto maior, mais rápida a tradução.
              </div>
            </div>
          )}
          {payloadSize && (
            <div style={{marginBottom: '0.5em', position:'relative'}}>
              <p style={{margin:0}} className="statusbar-stat-hover" tabIndex={0}>
                📦 Payload: {payloadSize.toFixed(2)} KB
                <span className="statusbar-anecdote">{anecdotes.payload}</span>
              </p>
              <div style={{fontSize:'0.82em',color:'#bdbdbd',marginTop:'0.1em'}}>
                Aproximadamente {Math.ceil(payloadSize/2)} páginas de texto puro.
              </div>
            </div>
          )}
          {charCount && (
            <div style={{marginBottom: '0.5em', position:'relative'}}>
              <p style={{margin:0}} className="statusbar-stat-hover" tabIndex={0}>
                📝 Caracteres: {charCount}
                <span className="statusbar-anecdote">{anecdotes.charCount}</span>
              </p>
              <div style={{fontSize:'0.82em',color:'#bdbdbd',marginTop:'0.1em'}}>
                ≈ {Math.ceil(charCount/280)} tweets completos
              </div>
            </div>
          )}
          {costUSD > 0 && (
            <>
              <div style={{marginBottom: '0.5em', position:'relative'}}>
                <p style={{margin:0}} className="statusbar-stat-hover" tabIndex={0}>
                  💰 Custo estimado: ${costUSD.toFixed(5)} (~R${costBRL.toFixed(5)})
                  <span className="statusbar-anecdote">{anecdotes.cost}</span>
                </p>
                <div style={{fontSize:'0.82em',color:'#bdbdbd',marginTop:'0.1em'}}>
                  Base OpenAI, dólar = R$5,20
                </div>
              </div>
              <div style={{marginBottom: '0.5em', position:'relative'}}>
                <p style={{margin:0}} className="statusbar-stat-hover" tabIndex={0}>
                  🧾 Com $1 você faz aprox. {requisicoesPorDolar} requisições desse tamanho
                  <span className="statusbar-anecdote">{anecdotes.reqs}</span>
                </p>
                <div style={{fontSize:'0.82em',color:'#bdbdbd',marginTop:'0.1em'}}>
                  Quanto menor o custo, mais traduções por dólar!
                </div>
              </div>
            </>
          )}
          <div style={{marginBottom: '0.5em', position:'relative'}}>
            <p style={{margin:0}} className="statusbar-stat-hover" tabIndex={0}>
              🤖 Modelo: {model}
              <span className="statusbar-anecdote">{anecdotes.model}</span>
            </p>
            <div style={{fontSize:'0.82em',color:'#bdbdbd',marginTop:'0.1em'}}>
              Exemplo: gpt-3.5-turbo
            </div>
          </div>
        </>
      )}
    </div>
  );
}
