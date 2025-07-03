'use client';

import React, { useState, useRef, useEffect } from 'react';
import '@/styles/statusbar.css';
import { statusbarFacts } from './statusbarFacts';
import '@/styles/components/status-bar.css';

interface StatusBarProps {
  loading: boolean;
  statusMessage: string;
  tokensUsed: number | null;
  elapsedTime: number | null;
  payloadSize: number | null;
  charCount: number | null;
  model: string;
  usosRestantes?: number | null;
}

export default function StatusBar({
  loading,
  statusMessage,
  tokensUsed,
  elapsedTime,
  payloadSize,
  charCount,
  model,
  usosRestantes,
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

  // Função para sortear curiosidade
  function randomFact(arr: string[], vars?: Record<string, string|number>) {
    const fact = arr[Math.floor(Math.random() * arr.length)];
    if (!vars) return fact;
    return fact.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));
  }

  // Anedotas para cada estatística
  const anecdotes = {
    tokens: 'Tokens são pedaços de palavras. Exemplo: [Olá] [!] [mundo] [!] = 4 tokens',
    elapsed: elapsedTime !== null
      ? `Processamento: ${Math.round(elapsedTime * 1000)} ms. Sabia que um piscar de olhos dura cerca de 300 ms? 👀`
      : '',
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
      className={`statusbar-draggable${!expanded ? ' minimized' : ''}`}
      style={{
        top: position.top,
        left: position.left,
        width: expanded ? '370px' : '230px',
        transition: dragging ? 'none' : 'all 0.3s cubic-bezier(.4,2,.6,1)',
        cursor: dragging ? 'grabbing' : 'default',
      }}
    >
      <div
        className="statusbar-header"
        onMouseDown={onMouseDown}
        style={!expanded ? { cursor: 'default', userSelect: 'auto' } : {}}
      >
        <p className="statusbar-title" style={!expanded ? { fontSize: '1.08rem', fontWeight: 600, marginRight: 8, marginBottom: 0 } : {}}>
          {statusMessage}
          {usosRestantes !== undefined && usosRestantes !== null && statusMessage.includes('Tradução concluída') && (
            <span className="statusbar-title-remaining" style={!expanded ? { color: 'var(--accent)', fontWeight: 500, marginLeft: 6 } : {}}>
              ({usosRestantes} uso{usosRestantes === 1 ? '' : 's'} restantes)
            </span>
          )}
        </p>
        {!expanded && (
          <button
            className="statusbar-close-btn"
            title="Fechar barra de status"
            onClick={() => setVisible(false)}
            aria-label="Fechar barra de status"
            style={{ marginLeft: 'auto', marginRight: 0 }}
          >
            ×
          </button>
        )}
        <div className="statusbar-flex">
          <button
            onClick={() => setExpanded(!expanded)}
            className="statusbar-btn"
            title={expanded ? 'Recolher' : 'Expandir'}
          >
            {expanded ? '⬆️' : '⬇️'}
          </button>
        </div>
      </div>

      {expanded && (
        <>
          <hr className="statusbar-divider" />
          {tokensUsed !== null && (
            <div className="statusbar-section">
              <p className="statusbar-section-title statusbar-stat-hover" tabIndex={0}>
                🧠 Tokens usados: {tokensUsed}
                <span className="statusbar-anecdote">{randomFact(statusbarFacts.tokens)}</span>
              </p>
              <div className="statusbar-section-detail">
                Tokens são blocos de texto. Exemplo: <span className="statusbar-section-monospace">[Olá] [!] [mundo] [!]</span> = 4 tokens
              </div>
            </div>
          )}
          {elapsedTime !== null && (
            <div className="statusbar-section">
              <p className="statusbar-section-title statusbar-stat-hover" tabIndex={0}>
                ⏱️ Tempo: {formatSeconds(elapsedTime)} <span className="statusbar-section-span">({Math.round(elapsedTime * 1000)} ms)</span>
                <span className="statusbar-anecdote">{randomFact(statusbarFacts.elapsed, { ms: Math.round(elapsedTime * 1000) })}</span>
              </p>
              <div className="statusbar-section-detail">
                Tempo total de processamento da tradução.
              </div>
            </div>
          )}
          {speed && (
            <div className="statusbar-section">
              <p className="statusbar-section-title statusbar-stat-hover" tabIndex={0}>
                ⚡ Velocidade: {speed} tokens/s
                <span className="statusbar-anecdote">{randomFact(statusbarFacts.speed)}</span>
              </p>
              <div className="statusbar-section-detail">
                Quanto maior, mais rápida a tradução.
              </div>
            </div>
          )}
          {payloadSize && (
            <div className="statusbar-section">
              <p className="statusbar-section-title statusbar-stat-hover" tabIndex={0}>
                📦 Payload: {payloadSize.toFixed(2)} KB
                <span className="statusbar-anecdote">{randomFact(statusbarFacts.payload)}</span>
              </p>
              <div className="statusbar-section-detail">
                Aproximadamente {Math.ceil(payloadSize/2)} páginas de texto puro.
              </div>
            </div>
          )}
          {charCount && (
            <div className="statusbar-section">
              <p className="statusbar-section-title statusbar-stat-hover" tabIndex={0}>
                📝 Caracteres: {charCount}
                <span className="statusbar-anecdote">{randomFact(statusbarFacts.charCount)}</span>
              </p>
              <div className="statusbar-section-detail">
                ≈ {Math.ceil(charCount/280)} tweets completos
              </div>
            </div>
          )}
          {costUSD > 0 && (
            <>
              <div className="statusbar-section">
                <p className="statusbar-section-title statusbar-stat-hover" tabIndex={0}>
                  💰 Custo estimado: ${costUSD.toFixed(5)} (~R${costBRL.toFixed(5)})
                  <span className="statusbar-anecdote">{randomFact(statusbarFacts.cost)}</span>
                </p>
                <div className="statusbar-section-detail">
                  Base OpenAI, dólar = R$5,20
                </div>
              </div>
              <div className="statusbar-section">
                <p className="statusbar-section-title statusbar-stat-hover" tabIndex={0}>
                  🧾 Com $1 você faz aprox. {requisicoesPorDolar} requisições desse tamanho
                  <span className="statusbar-anecdote">{randomFact(statusbarFacts.reqs)}</span>
                </p>
                <div className="statusbar-section-detail">
                  Quanto menor o custo, mais traduções por dólar!
                </div>
              </div>
            </>
          )}
          <div className="statusbar-section">
            <p className="statusbar-section-title statusbar-stat-hover" tabIndex={0}>
              🤖 Modelo: {model}
              <span className="statusbar-anecdote">{randomFact(statusbarFacts.model)}</span>
            </p>
            <div className="statusbar-section-detail">
              Exemplo: gpt-3.5-turbo
            </div>
          </div>
        </>
      )}
    </div>
  );
}
