import { useState, useEffect, useCallback } from 'react';

// =====================================================================
// SISTEMA AVANÇADO DE GERAÇÃO DE FRASES MOTIVACIONAIS
// =====================================================================

// Estruturas gramaticais coerentes
const TEMPLATES = {
  // Template: [CONTEXTO] + [AÇÃO] + [OBJETO/FOCO] + [MOTIVAÇÃO]
  CONTEXTO_ACAO_FOCO: {
    pattern: "{{contexto}} {{acao}} {{foco}}, {{motivacao}}",
    description: "Contexto + Ação + Foco + Motivação"
  },
  
  // Template: [CONDICIONAL] + [CONSELHO] + [RESULTADO]
  CONDICIONAL_CONSELHO: {
    pattern: "{{condicional}} {{conselho}}, {{resultado}}",
    description: "Situação condicional + Conselho + Resultado esperado"
  },
  
  // Template: [REFLEXAO] + [ACAO_POSITIVA] + [IMPACTO]
  REFLEXAO_ACAO: {
    pattern: "{{reflexao}} {{acao_positiva}} {{impacto}}",
    description: "Reflexão + Ação positiva + Impacto"
  },
  
  // Template: [MOMENTO] + [OPORTUNIDADE] + [BENEFICIO]
  MOMENTO_OPORTUNIDADE: {
    pattern: "{{momento}} {{oportunidade}} {{beneficio}}",
    description: "Momento + Oportunidade + Benefício"
  }
};

// =====================================================================
// VOCABULÁRIO EXPANDIDO E CATEGORIZADO
// =====================================================================

const VOCABULARIO = {
  // CONTEXTOS (quando/onde aplicar)
  contexto: [
    "Hoje é um ótimo dia para",
    "Neste momento, vale a pena",
    "Agora é a hora ideal para",
    "Este é o momento perfeito para",
    "Sempre que possível, tente",
    "A cada novo dia, procure",
    "Em cada projeto, lembre de",
    "Durante os desafios, é importante",
    "No meio da correria, não esqueça de",
    "Quando as coisas ficam intensas, tente"
  ],

  // CONDICIONAIS (situações específicas)
  condicional: [
    "Se o desafio parecer grande demais",
    "Quando o bug aparecer",
    "Se a motivação estiver em baixa",
    "Quando o prazo apertar",
    "Se der aquele medo de não conseguir",
    "Quando tudo parecer impossível",
    "Se a solução não vier rapidamente",
    "Quando o time estiver sobrecarregado",
    "Se parecer que não vai dar tempo",
    "Quando a pressão aumentar",
    "Se o código não cooperar",
    "Quando as ideias não fluírem"
  ],

  // AÇÕES POSITIVAS (o que fazer)
  acao: [
    "celebrar",
    "compartilhar",
    "colaborar em",
    "investir tempo em",
    "focar na",
    "cultivar a",
    "praticar a",
    "desenvolver a",
    "exercitar a",
    "fortalecer a",
    "aprimorar a",
    "valorizar a"
  ],

  acao_positiva: [
    "celebre cada pequena vitória",
    "compartilhe suas dúvidas com o time",
    "peça ajuda sem hesitar",
    "divida o conhecimento",
    "reconheça o progresso já feito",
    "agradeça pelo suporte recebido",
    "valorize o esforço coletivo",
    "aprenda com cada erro",
    "mantenha o foco no objetivo",
    "confie no processo",
    "respire e reorganize as ideias",
    "lembre-se de suas conquistas anteriores"
  ],

  // CONSELHOS (sugestões práticas)
  conselho: [
    "respire fundo e divida o problema em partes menores",
    "lembre que cada erro é um aprendizado valioso",
    "peça ajuda - ninguém precisa resolver tudo sozinho",
    "celebre cada pequeno avanço do caminho",
    "confie no processo e no seu potencial",
    "foque no próximo passo, não no problema inteiro",
    "lembre que o time está junto nessa jornada",
    "veja isso como uma oportunidade de crescimento",
    "mantenha a curiosidade e a vontade de aprender",
    "valorize o progresso, mesmo que pareça pequeno"
  ],

  // FOCOS/OBJETOS (em que concentrar energia)
  foco: [
    "colaboração",
    "comunicação",
    "criatividade",
    "aprendizado contínuo",
    "resiliência",
    "empatia",
    "inovação",
    "qualidade",
    "eficiência",
    "bem-estar do time",
    "crescimento pessoal",
    "melhoria contínua",
    "solução de problemas",
    "trabalho em equipe",
    "desenvolvimento técnico",
    "mentoria",
    "feedback construtivo",
    "organização"
  ],

  // REFLEXÕES (pensamentos motivacionais)
  reflexao: [
    "Lembre-se:",
    "É importante saber que",
    "Nunca esqueça que",
    "Uma coisa é certa:",
    "O mais importante é que",
    "Vale sempre lembrar que",
    "A verdade é que",
    "Não há dúvida de que"
  ],

  // MOMENTOS (timing/oportunidades)
  momento: [
    "Este é o momento ideal para",
    "Agora é uma ótima hora para",
    "Hoje vale a pena",
    "Esta semana, tente",
    "Neste projeto, procure",
    "Durante esta sprint, foque em",
    "Ao longo do dia, lembre de",
    "Em cada tarefa, busque"
  ],

  // OPORTUNIDADES (o que aproveitar)
  oportunidade: [
    "aprender algo novo com a equipe",
    "compartilhar conhecimento",
    "fortalecer os laços do time",
    "melhorar um processo",
    "experimentar uma abordagem diferente",
    "pedir feedback sobre seu trabalho",
    "ajudar um colega com suas dificuldades",
    "documentar uma solução interessante",
    "celebrar uma conquista coletiva",
    "refletir sobre o crescimento alcançado"
  ],

  // MOTIVAÇÕES/RESULTADOS (por que vale a pena)
  motivacao: [
    "porque juntos somos mais fortes",
    "pois cada passo conta na jornada",
    "já que o crescimento é um processo contínuo",
    "porque a colaboração multiplica resultados",
    "pois cada desafio nos torna mais resilientes",
    "já que o aprendizado nunca para",
    "porque pequenas melhorias geram grandes impactos",
    "pois a qualidade se constrói no dia a dia",
    "já que a experiência é o melhor professor",
    "porque o time cresce quando todos crescem"
  ],

  resultado: [
    "e você vai ver como as coisas se encaixam",
    "e a solução vai aparecer mais clara",
    "e o caminho vai ficar mais nítido",
    "e você vai se surpreender com o resultado",
    "e o time todo vai se beneficiar",
    "e o progresso vai ser mais consistente",
    "e a motivação vai se renovar",
    "e o aprendizado vai ser mais profundo",
    "e a confiança vai aumentar naturalmente",
    "e o processo vai fluir melhor"
  ],

  beneficio: [
    "e fortalecer ainda mais o time",
    "e acelerar o desenvolvimento de todos",
    "e criar um ambiente mais colaborativo",
    "e gerar soluções mais criativas",
    "e aumentar a satisfação no trabalho",
    "e melhorar a qualidade das entregas",
    "e construir relacionamentos mais sólidos",
    "e desenvolver novas habilidades",
    "e aumentar a confiança coletiva",
    "e criar momentum para novos desafios"
  ],

  impacto: [
    "e isso fará toda a diferença no resultado final",
    "e você verá como isso transforma o ambiente",
    "e o impacto positivo será sentido por todos",
    "e isso criará um ciclo virtuoso de crescimento",
    "e a equipe toda se beneficiará dessa atitude",
    "e isso fortalecerá a cultura de colaboração",
    "e o efeito multiplicador será impressionante",
    "e isso contribuirá para um ambiente mais saudável",
    "e o resultado será muito além do esperado",
    "e isso inspirará outros a fazerem o mesmo"
  ]
};

// Frases prontas (mantidas para diversidade)
const FRASES_PRONTAS = [
  "Se chegamos até aqui, já vale um parabéns — cada passo conta!",
  "Nem sempre a estrada é fácil, mas juntos a gente transforma o caminho em conquista.",
  "Todo mundo erra, mas só quem compartilha aprende de verdade. Bora crescer juntos?",
  "A entrega é importante, mas ninguém precisa carregar o peso sozinho. Pode chamar!",
  "Não subestime o poder de uma boa dúvida: ela pode ser o início da nossa próxima solução.",
  "O código compila mais rápido quando a gente comemora cada avanço — não esqueça de celebrar!",
  "Aqui, cada vitória é do time todo. E cada dificuldade também. Vamos virar esse jogo juntos.",
  "O resultado de hoje é mérito do esforço coletivo — e amanhã tem mais.",
  "Às vezes, a melhor sprint é aquela em que todo mundo termina sorrindo.",
  "Se está difícil agora, é porque estamos no meio do caminho. O final dessa história a gente escreve juntos.",
  "Cada bug resolvido é uma pequena vitória que merece ser comemorada.",
  "O melhor código é aquele escrito em colaboração — duas cabeças pensam melhor que uma.",
  "Não existe pergunta boba quando o objetivo é aprender e crescer juntos.",
  "O deadline é importante, mas a saúde mental e o bem-estar do time são prioridade.",
  "Lembra quando isso parecia impossível? Pois é, você chegou aqui. Continue!",
  "O erro de hoje é a experiência de amanhã — aproveite cada oportunidade de aprender.",
  "Seu código pode não estar perfeito, mas sua dedicação e esforço são impecáveis.",
  "O segredo não é acertar na primeira, é persistir até encontrar a solução certa.",
  "Cada commit é um passo à frente, cada pull request é uma chance de melhorar.",
  "O que importa não é a velocidade, mas a consistência e a qualidade da jornada."
];

// =====================================================================
// LÓGICA DE GERAÇÃO INTELIGENTE
// =====================================================================

class GeradorFrases {
  private usedCombinations: Set<string> = new Set();
  
  private getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }
  
  private generateFromTemplate(templateKey: keyof typeof TEMPLATES): string {
    const template = TEMPLATES[templateKey];
    let frase = template.pattern;
    
    // Substitui cada placeholder pelo vocabulário correspondente
    const placeholders = frase.match(/\{\{(\w+)\}\}/g);
    
    if (!placeholders) return frase;
    
    placeholders.forEach(placeholder => {
      const key = placeholder.replace(/[{}]/g, '') as keyof typeof VOCABULARIO;
      if (VOCABULARIO[key]) {
        const palavra = this.getRandomElement(VOCABULARIO[key]);
        frase = frase.replace(placeholder, palavra);
      }
    });
    
    return frase;
  }
  
  private createCombinationId(frase: string): string {
    // Cria um ID baseado nas palavras-chave da frase para evitar repetições similares
    const palavrasChave = frase
      .toLowerCase()
      .replace(/[.,!?]/g, '')
      .split(' ')
      .filter(palavra => palavra.length > 3)
      .slice(0, 3)
      .join('-');
    
    return `GEN-${palavrasChave}`;
  }
  
  public gerarFrase(): string {
    const tipoFrase = Math.random();
    
    // 60% - Frases geradas por template
    if (tipoFrase < 0.6) {
      const templateKeys = Object.keys(TEMPLATES) as Array<keyof typeof TEMPLATES>;
      const templateEscolhido = this.getRandomElement(templateKeys);
      
      let tentativas = 0;
      let frase: string;
      let id: string;
      
      do {
        frase = this.generateFromTemplate(templateEscolhido);
        id = this.createCombinationId(frase);
        tentativas++;
      } while (this.usedCombinations.has(id) && tentativas < 10);
      
      if (tentativas < 10) {
        this.usedCombinations.add(id);
        return frase;
      }
    }
    
    // 40% - Frases prontas
    const frasesDisponiveis = FRASES_PRONTAS.filter(frase => 
      !this.usedCombinations.has(`FIXED-${frase.substring(0, 20)}`)
    );
    
    if (frasesDisponiveis.length > 0) {
      const frase = this.getRandomElement(frasesDisponiveis);
      this.usedCombinations.add(`FIXED-${frase.substring(0, 20)}`);
      return frase;
    }
    
    // Se todas as frases foram usadas, reseta o histórico
    this.resetUsedCombinations();
    return this.gerarFrase();
  }
  
  public resetUsedCombinations(): void {
    this.usedCombinations.clear();
  }
  
  public getStats(): { totalCombinations: number; usedCombinations: number } {
    // Calcula o número teórico de combinações possíveis
    const templateCount = Object.keys(TEMPLATES).length;
    let totalCombinations = FRASES_PRONTAS.length;
    
    // Estima combinações por template (aproximação)
    Object.values(VOCABULARIO).forEach(categoria => {
      totalCombinations += categoria.length;
    });
    
    return {
      totalCombinations: totalCombinations * templateCount,
      usedCombinations: this.usedCombinations.size
    };
  }
}

// =====================================================================
// HOOK PRINCIPAL (mantém a interface existente)
// =====================================================================

const gerador = new GeradorFrases();

// Resto do código do hook mantido igual...
const KEY = 'frasesMotivacionaisExibidasV4'; // Versão atualizada
const FAVORITES_KEY = 'frasesMotivacionaisFavoritas';
const STATS_KEY = 'frasesMotivacionaisStats';

function getExibidas(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}

function setExibidas(arr: string[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(arr));
}

function getFavoritas(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
  } catch {
    return [];
  }
}

function setFavoritasStorage(arr: string[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(arr));
}

function getStats(): { total: number; hoje: number; streak: number; lastDate: string } {
  if (typeof window === 'undefined') return { total: 0, hoje: 0, streak: 0, lastDate: '' };
  try {
    return JSON.parse(localStorage.getItem(STATS_KEY) || '{"total":0,"hoje":0,"streak":0,"lastDate":""}');
  } catch {
    return { total: 0, hoje: 0, streak: 0, lastDate: '' };
  }
}

function updateStats(): { total: number; hoje: number; streak: number } {
  if (typeof window === 'undefined') return { total: 0, hoje: 0, streak: 0 };
  
  const today = new Date().toDateString();
  const currentStats = getStats();
  
  const newStats = {
    total: currentStats.total + 1,
    hoje: currentStats.lastDate === today ? currentStats.hoje + 1 : 1,
    streak: currentStats.lastDate === today ? currentStats.streak : currentStats.streak + 1,
    lastDate: today
  };
  
  localStorage.setItem(STATS_KEY, JSON.stringify(newStats));
  return newStats;
}

export function useMotdLogic() {
  const [frase, setFrase] = useState('');
  const [exibidas, setExibidasState] = useState<string[]>([]);
  const [favoritas, setFavoritas] = useState<string[]>([]);
  const [aviso, setAviso] = useState('');
  const [fadeClass, setFadeClass] = useState('fade-in');
  const [stats, setStats] = useState({ total: 0, hoje: 0, streak: 0 });

  const gerarNovaFrase = useCallback(() => {
    setFadeClass('fade-out');
    
    setTimeout(() => {
      const novaFrase = gerador.gerarFrase();
      const exibidasAtual = getExibidas();
      
      exibidasAtual.push(novaFrase);
      setExibidas(exibidasAtual);
      setExibidasState([...exibidasAtual]);
      setFrase(novaFrase);
      setAviso('');
      setFadeClass('fade-in');
      
      // Atualiza estatísticas
      const novasStats = updateStats();
      setStats(novasStats);
    }, 300);
  }, []);

  useEffect(() => {
    const frasesExibidas = getExibidas();
    const frasesGostei = getFavoritas();
    const estatisticas = getStats();
    
    setExibidasState(frasesExibidas);
    setFavoritas(frasesGostei);
    setStats(estatisticas);
  }, []);

  const toggleFavorita = useCallback((fraseTarget: string) => {
    const isCurrentlyFavorited = favoritas.includes(fraseTarget);
    const novasFavoritas = isCurrentlyFavorited 
      ? favoritas.filter(f => f !== fraseTarget)
      : [...favoritas, fraseTarget];
    
    // Se estamos removendo dos favoritos, garantimos que a frase volte para o histórico
    if (isCurrentlyFavorited) {
      const exibidasAtual = getExibidas();
      if (!exibidasAtual.includes(fraseTarget)) {
        exibidasAtual.push(fraseTarget);
        setExibidas(exibidasAtual);
        setExibidasState([...exibidasAtual]);
      }
    }
    
    setFavoritas(novasFavoritas);
    setFavoritasStorage(novasFavoritas);
    
    const acao = isCurrentlyFavorited ? 'removida das' : 'adicionada às';
    const emoji = isCurrentlyFavorited ? '💔' : '❤️';
    const mensagemExtra = isCurrentlyFavorited ? ' (mantida no histórico)' : '';
    setAviso(`Frase ${acao} favoritas${mensagemExtra}! ${emoji}`);
    setTimeout(() => setAviso(''), 2500);
  }, [favoritas]);

  const copiarFrase = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(frase);
      setAviso('Frase copiada! 📋');
      setTimeout(() => setAviso(''), 2000);
    } catch {
      setAviso('Erro ao copiar 😅');
      setTimeout(() => setAviso(''), 2000);
    }
  }, [frase]);

  const compartilharFrase = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Frase Motivacional do Dia',
          text: frase,
          url: window.location.href
        });
      } catch {
        copiarFrase();
      }
    } else {
      copiarFrase();
    }
  }, [frase, copiarFrase]);

  const limparHistorico = useCallback(() => {
    if (typeof window !== 'undefined') {
      // Preserva as frases favoritas no histórico
      const frasesPreservadas = getFavoritas();
      
      if (frasesPreservadas.length > 0) {
        setExibidas(frasesPreservadas);
        setExibidasState([...frasesPreservadas]);
        setAviso(`Histórico limpo! ${frasesPreservadas.length} favoritas preservadas 🗑️❤️`);
      } else {
        localStorage.removeItem(KEY);
        setExibidasState([]);
        setAviso('Histórico limpo! 🗑️');
      }
      
      gerador.resetUsedCombinations();
      setTimeout(() => setAviso(''), 3500);
    }
  }, []);

  const limparTudo = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(KEY);
      localStorage.removeItem(FAVORITES_KEY);
      localStorage.removeItem(STATS_KEY);
      setExibidasState([]);
      setFavoritas([]);
      setStats({ total: 0, hoje: 0, streak: 0 });
      gerador.resetUsedCombinations();
      setAviso('Tudo limpo! Histórico, favoritas e estatísticas removidos 🗑️💥');
      setTimeout(() => setAviso(''), 4000);
    }
  }, []);

  return {
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
  };
}
