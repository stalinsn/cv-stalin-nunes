'use client';
import React, { useEffect } from 'react';
import '@/styles/components/motd.css';
import { useMotdLogic } from '@/hooks/useMotdLogic';
import MotdMainArea from '@/components/motd/MotdMainArea';
import MotdSidebar from '@/components/motd/MotdSidebar';

export default function MotdPage() {
  const {
    frase,
    setFrase,
    exibidas,
    favoritas,
    aviso,
    fadeClass,
    setFadeClass,
    stats,
    gerarNovaFrase,
    toggleFavorita,
    copiarFrase,
    compartilharFrase,
    limparHistorico,
    limparTudo
  } = useMotdLogic();

  // Gerar frase automaticamente na primeira carga
  useEffect(() => {
    setTimeout(() => {
      gerarNovaFrase();
    }, 500);
  }, [gerarNovaFrase]);

  // Atalhos de teclado melhorados
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignora se está digitando em um input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          gerarNovaFrase();
          break;
        case 'KeyF':
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            toggleFavorita(frase);
          }
          break;
        case 'KeyC':
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            copiarFrase();
          }
          break;
        case 'KeyS':
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            compartilharFrase();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [gerarNovaFrase, frase, toggleFavorita, copiarFrase, compartilharFrase]);

  return (
    <div className="motd-container">
      <MotdMainArea
        frase={frase}
        fadeClass={fadeClass}
        stats={stats}
        isFavorited={favoritas.includes(frase)}
        aviso={aviso}
        onGenerateNew={gerarNovaFrase}
        onToggleFavorite={() => toggleFavorita(frase)}
        onCopy={copiarFrase}
        onShare={compartilharFrase}
        onClick={gerarNovaFrase}
      />
      
      <MotdSidebar
        historico={exibidas.slice().reverse()} // Mais recentes primeiro
        favoritas={favoritas}
        currentFrase={frase}
        onSelectFrase={(novaFrase) => {
          setFrase(novaFrase);
          setFadeClass('fade-in');
        }}
        onToggleFavorite={toggleFavorita}
        onClearHistory={limparHistorico}
        onClearAll={limparTudo}
      />
    </div>
  );
}
