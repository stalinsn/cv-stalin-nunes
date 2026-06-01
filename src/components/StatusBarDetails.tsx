import React from 'react';
import { statusbarFacts } from './statusbarFacts';

interface StatusBarDetailsProps {
  loading: boolean;
  tokensUsed: number | null;
  elapsedTime: number | null;
  payloadSize: number | null;
  charCount: number | null;
  model: string;
  promptTokens?: number | null;
  completionTokens?: number | null;
  inputPricePerMillion: number;
  outputPricePerMillion: number;
  isEstimatedTokenSplit: boolean;
  mode?: 'ai' | 'mock' | 'cache' | null;
  costUSD: number;
  costBRL: number;
  speed: string | null;
  requisicoesPorDolar: string;
}

function formatDuration(ms: number) {
  if (ms < 1000) return `${Math.round(ms)} ms`;
  const sec = ms / 1000;
  if (sec < 60) return `${sec.toFixed(2)}s`;
  const min = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  if (min < 60) return `${min}min ${s}s`;
  const h = Math.floor(min / 60);
  return `${h}h ${min % 60}min ${s}s`;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(2)} KB`;
}

function randomFact(arr: string[], vars?: Record<string, string|number>) {
  const fact = arr[Math.floor(Math.random() * arr.length)];
  if (!vars) return fact;
  return fact.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));
}

export default function StatusBarDetails({
  loading,
  tokensUsed,
  elapsedTime,
  payloadSize,
  charCount,
  model,
  promptTokens,
  completionTokens,
  inputPricePerMillion,
  outputPricePerMillion,
  isEstimatedTokenSplit,
  mode,
  costUSD,
  costBRL,
  speed,
  requisicoesPorDolar,
}: StatusBarDetailsProps) {
  return (
    <>
      <hr className="statusbar-divider" />
      {loading && (
        <div className="statusbar-section">
          <p className="statusbar-section-title">⏳ Aguardando resposta da IA...</p>
          <div className="statusbar-section-detail">
            As estatísticas finais aparecem assim que a API retornar tokens, tempo e modelo.
          </div>
        </div>
      )}
      {tokensUsed !== null && (
        <div className="statusbar-section">
          <p className="statusbar-section-title statusbar-stat-hover" tabIndex={0}>
            🧠 Tokens usados: {tokensUsed}
            <span className="statusbar-anecdote">{randomFact(statusbarFacts.tokens)}</span>
          </p>
          <div className="statusbar-section-detail">
            Tokens são blocos de texto. Entrada: {promptTokens ?? 'estimada'}; saída: {completionTokens ?? 'estimada'}.
          </div>
        </div>
      )}
      {elapsedTime !== null && (
        <div className="statusbar-section">
          <p className="statusbar-section-title statusbar-stat-hover" tabIndex={0}>
            ⏱️ Tempo: {formatDuration(elapsedTime)}
            <span className="statusbar-anecdote">{randomFact(statusbarFacts.elapsed, { ms: Math.round(elapsedTime) })}</span>
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
      {payloadSize !== null && (
        <div className="statusbar-section">
          <p className="statusbar-section-title statusbar-stat-hover" tabIndex={0}>
            📦 Payload: {formatBytes(payloadSize)}
            <span className="statusbar-anecdote">{randomFact(statusbarFacts.payload)}</span>
          </p>
          <div className="statusbar-section-detail">
            Tamanho aproximado do JSON enviado para tradução.
          </div>
        </div>
      )}
      {charCount !== null && (
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
              Base OpenAI: ${inputPricePerMillion}/1M entrada e ${outputPricePerMillion}/1M saída. Dólar = R$5,20{isEstimatedTokenSplit ? '; divisão entrada/saída estimada.' : '.'}
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
      {(model || mode === 'mock' || mode === 'cache') && <div className="statusbar-section">
        <p className="statusbar-section-title statusbar-stat-hover" tabIndex={0}>
          🤖 Modelo: {mode === 'mock' ? 'mock local' : mode === 'cache' ? 'cache local' : model}
          <span className="statusbar-anecdote">{randomFact(statusbarFacts.model)}</span>
        </p>
        <div className="statusbar-section-detail">
          {mode === 'mock'
            ? 'Fallback local, sem custo de API.'
            : mode === 'cache'
              ? 'Tradução reutilizada do navegador, sem nova chamada de API.'
              : 'Modelo usado na tradução por IA.'}
        </div>
      </div>}
    </>
  );
}
