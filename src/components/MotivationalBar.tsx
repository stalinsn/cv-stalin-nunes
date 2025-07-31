'use client';
import React, { useEffect, useRef, useState, CSSProperties } from 'react';
import '@/styles/components/motivational-bar.css';

const INICIOS = [
  "Hoje é um ótimo dia para",
  "No meio do desafio, tente",
  "Se o bug aparecer, respire fundo e",
  "Quando o prazo apertar, lembre de",
  "Se parecer impossível, tente",
  "Nos dias difíceis, vale a pena",
  "Se a motivação faltar, é hora de"
];
const ACOES = [
  "celebrar",
  "compartilhar",
  "pedir ajuda sobre",
  "refletir sobre",
  "experimentar algo novo com",
  "dar um passo de cada vez em",
  "olhar com carinho para"
];
const QUALIDADES = [
  "coragem",
  "criatividade",
  "empatia",
  "resiliência",
  "curiosidade",
  "dedicação",
  "humildade",
  "colaboração"
];
const OBJETOS = [
  "o time",
  "o desafio",
  "o código",
  "a entrega",
  "o aprendizado",
  "o bug",
  "a sprint",
  "as pequenas vitórias"
];
const RESULTADOS = [
  "porque juntos vamos mais longe.",
  "ninguém precisa vencer sozinho.",
  "a solução pode estar num olhar diferente.",
  "é assim que a gente cresce de verdade.",
  "amanhã vai ser melhor.",
  "cada avanço merece ser reconhecido.",
  "é a soma dos detalhes que faz a diferença.",
  "o segredo está em não desistir."
];
const INICIOS_COMB = [
  "Hoje é um ótimo dia para",
  "Se o desafio apareceu, é porque você pode",
  "A cada sprint, não esqueça de",
  "Mesmo nos bugs, lembre de",
  "Se der medo, lembre de",
  "No meio do caos, tente",
  "Quando tudo parece impossível, tente",
  "Se a motivação faltar, tente"
];
const ACOES_COMB = [
  "acreditar no seu potencial",
  "celebrar pequenas vitórias",
  "pedir ajuda quando precisar",
  "compartilhar o aprendizado",
  "experimentar algo novo",
  "dar um passo de cada vez",
  "reconhecer o esforço do time",
  "lembrar que cada erro é aprendizado",
  "olhar para trás e ver o quanto já avançou"
];
const RESULTADOS_COMB = [
  "porque juntos vamos mais longe.",
  "ninguém constrói nada grande sozinho.",
  "a solução pode estar mais perto do que parece.",
  "o crescimento é a soma dos pequenos avanços.",
  "o segredo está em não desistir.",
  "o resultado sempre chega para quem persiste.",
  "um time forte se constrói nos desafios.",
  "as melhores ideias surgem das trocas sinceras.",
  "você é mais capaz do que imagina."
];
const frases = [
  "Se chegamos até aqui, já vale um parabéns — cada passo conta!",
  "Nem sempre a estrada é fácil, mas juntos a gente transforma o caminho em conquista.",
  "Todo mundo erra, mas só quem compartilha aprende de verdade. Bora crescer juntos?",
  "A entrega é importante, mas ninguém precisa carregar o peso sozinho. Pode chamar!",
  "Não subestime o poder de uma boa dúvida: ela pode ser o início da nossa próxima solução.",
  "O código compila mais rápido quando a gente comemora cada avanço — não esqueça de celebrar!",
  "Aqui, cada vitória é do time todo. E cada dificuldade também. Vamos virar esse jogo juntos.",
  "O resultado de hoje é mérito do esforço coletivo — e amanhã tem mais.",
  "Às vezes, a melhor sprint é aquela em que todo mundo termina sorrindo.",
  "Se está difícil agora, é porque estamos no meio do caminho. O final dessa história a gente escreve juntos."
];

function fraseUltraCombinada() {
  const inicio = INICIOS[Math.floor(Math.random() * INICIOS.length)];
  const acao = ACOES[Math.floor(Math.random() * ACOES.length)];
  const qualidade = QUALIDADES[Math.floor(Math.random() * QUALIDADES.length)];
  const objeto = OBJETOS[Math.floor(Math.random() * OBJETOS.length)];
  const resultado = RESULTADOS[Math.floor(Math.random() * RESULTADOS.length)];
  return `${inicio} ${acao} ${qualidade} de ${objeto}, ${resultado}`;
}
function fraseCombinada() {
  const inicio = INICIOS_COMB[Math.floor(Math.random() * INICIOS_COMB.length)];
  const acao = ACOES_COMB[Math.floor(Math.random() * ACOES_COMB.length)];
  const resultado = RESULTADOS_COMB[Math.floor(Math.random() * RESULTADOS_COMB.length)];
  return `${inicio} ${acao}, ${resultado}`;
}
function getRandomFrase() {
  const tipo = Math.random();
  if (tipo < 0.3) return fraseUltraCombinada();
  if (tipo < 0.55) return fraseCombinada();
  return frases[Math.floor(Math.random() * frases.length)];
}

type MotivationalBarProps = {
  className?: string;
  style?: CSSProperties;
};

export default function MotivationalBar({ className = '', style = {} }: MotivationalBarProps) {
  const [frase, setFrase] = useState<string>(getRandomFrase());
  const [hidden, setHidden] = useState<boolean>(false);
  const [fade, setFade] = useState<boolean>(false);
  const [showRestore, setShowRestore] = useState<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isHidden = sessionStorage.getItem('motivationalBarHidden') === '1';
      setHidden(isHidden);
      setShowRestore(isHidden);
    }
  }, []);

  useEffect(() => {
    if (hidden) return;
    const interval = setInterval(() => {
      setFade(true);
      timeoutRef.current = setTimeout(() => {
        setFrase(getRandomFrase());
        setFade(false);
      }, 400);
    }, 9000);
    return () => {
      clearInterval(interval);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [hidden]);

  function handleClose() {
    setHidden(true);
    setShowRestore(true);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('motivationalBarHidden', '1');
    }
  }

  function handleRestore() {
    setHidden(false);
    setShowRestore(false);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('motivationalBarHidden');
    }
  }

  // Botão flutuante de restaurar
  if (hidden && showRestore) {
    return (
      <button
        className="motivational-bar__restore"
        onClick={handleRestore}
        title="Mostrar barra motivacional novamente"
        aria-label="Restaurar barra motivacional"
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="11" cy="11" r="10" fill="var(--accent)" stroke="var(--accent-hover)" strokeWidth="2"/>
          <path d="M7 11.5C7 9.01472 9.01472 7 11.5 7C13.9853 7 16 9.01472 16 11.5C16 13.9853 13.9853 16 11.5 16C10.1193 16 8.87147 15.3679 8.05025 14.3636" stroke="var(--text-inverse)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M7 11.5V8.5H10" stroke="var(--text-inverse)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    );
  }

  // Barra motivacional
  if (hidden) return null;

  return (
    <div
      className={["motivational-bar", className].filter(Boolean).join(" ")}
      style={style}
      role="status"
      aria-live="polite"
    >
      <button className="motivational-bar__close" onClick={handleClose} aria-label="Fechar barra motivacional" title="Fechar">
        ×
      </button>
      <span className={"motivational-bar__text" + (fade ? " fade-out" : "")}>{frase}</span>
    </div>
  );
}