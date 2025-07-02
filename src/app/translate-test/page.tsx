'use client';

import { useState } from 'react';

export default function TranslateTestPage() {
  const [text, setText] = useState('');
  const [targetLang, setTargetLang] = useState('en');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTranslate = async () => {
    if (!text) {
      alert('Digite um texto para traduzir!');
      return;
    }

    setLoading(true);

    const res = await fetch('/api/translate', {
      method: 'POST',
      body: JSON.stringify({ text, targetLang }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();

    if (data.translatedText) {
      setResult(data.translatedText);
    } else {
      setResult('Erro na tradução!');
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Teste de Tradução com IA</h1>

      <textarea
        rows={4}
        placeholder="Digite seu texto aqui..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ width: '100%', padding: '0.5rem' }}
      />

      <div style={{ margin: '1rem 0' }}>
        <label>Idioma de destino: </label>
        <select
          value={targetLang}
          onChange={(e) => setTargetLang(e.target.value)}
        >
          <option value="en">Inglês</option>
          <option value="es">Espanhol</option>
          <option value="fr">Francês</option>
          <option value="de">Alemão</option>
          <option value="ptbr">Português</option>
        </select>
      </div>

      <button onClick={handleTranslate} disabled={loading}>
        {loading ? 'Traduzindo...' : 'Traduzir'}
      </button>

      <div style={{ marginTop: '2rem' }}>
        <h2>Resultado:</h2>
        <div
          style={{
            padding: '1rem',
            border: '1px solid #ccc',
            minHeight: '80px',
          }}
        >
          {result}
        </div>
      </div>
    </div>
  );
}
