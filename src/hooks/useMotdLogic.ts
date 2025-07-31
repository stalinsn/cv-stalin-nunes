import { useState, useEffect, useCallback } from 'react';

// =====================================================================
// SISTEMA AVANÇADO DE GERAÇÃO DE FRASES MOTIVACIONAIS
// =====================================================================

// Estruturas gramaticais inteligentes
const TEMPLATES = {
  // Template motivacional: contexto + ação + foco + motivação
  MOTIVACIONAL: {
    pattern: "{{contexto}} {{acao}} {{foco}}, {{motivacao}}",
    categoria: 'motivacional' as const
  },
  
  // Template humor: contexto + ação + foco + motivação (com vocabulário engraçado)
  HUMOR: {
    pattern: "{{contexto}}, {{acao}} {{foco}}, {{motivacao}}",
    categoria: 'humor' as const
  },
  
  // Template mix: contexto + ação + foco + motivação (equilibrado)
  MIX: {
    pattern: "{{contexto}} {{acao}} {{foco}}, {{motivacao}}",
    categoria: 'mix' as const
  },
  
  // Template condicional (usa vocabulário compartilhado)
  CONDICIONAL: {
    pattern: "{{condicional}}, {{conselho}}, {{resultado}}",
    categoria: 'compartilhado' as const
  }
};

// =====================================================================
// VOCABULÁRIO INTELIGENTE CATEGORIZADO POR TOM
// =====================================================================

const VOCABULARIO = {
  // === MOTIVACIONAL ===
  motivacional: {
    contexto: [
      "Hoje é um ótimo dia para",
      "Neste momento, vale a pena", 
      "Este é o momento perfeito para",
      "A cada novo dia, procure",
      "Em cada projeto, lembre de",
      "Durante os desafios, é importante"
    ],
    acao: [
      "celebrar", "compartilhar", "cultivar a", "fortalecer a",
      "praticar a", "desenvolver a", "valorizar a", "investir em"
    ],
    foco: [
      "colaboração", "comunicação", "resiliência", "empatia",
      "crescimento pessoal", "trabalho em equipe", "melhoria contínua",
      "bem-estar do time", "aprendizado contínuo", "qualidade"
    ],
    motivacao: [
      "porque juntos somos mais fortes",
      "pois cada passo conta na jornada", 
      "já que o crescimento é contínuo",
      "porque a colaboração multiplica resultados",
      "pois cada desafio nos torna resilientes"
    ]
  },

  // === HUMOR ===
  humor: {
    contexto: [
      "Antes que o café acabe",
      "Entre um bug e outro", 
      "Enquanto o deploy roda",
      "Depois de resolver aquele bug chato",
      "No intervalo entre reuniões",
      "Quando a internet finalmente voltar"
    ],
    acao: [
      "abraçar o caos da", "fazer as pazes com", "negociar com",
      "domesticar a", "sobreviver à", "domar a", "conviver com"
    ],
    foco: [
      "arte do rubber duck debugging", "diplomacia com CSS rebelde",
      "zen da documentação", "filosofia do console.log",
      "mistério dos bugs fantasmas", "magia do 'funciona na minha máquina'",
      "paciência com merge conflicts", "sabedoria do Stack Overflow"
    ],
    motivacao: [
      "porque programar é resolver quebra-cabeças pagos",
      "já que todo mundo passou por isso (e sobreviveu)",
      "pois café + código = fórmula mágica",
      "porque amanhã você vai rir disso",
      "já que até os ninjas começaram do zero"
    ]
  },

  // === MIX (Motivação + Humor) ===
  mix: {
    contexto: [
      "No meio da correria, não esqueça de",
      "Quando as coisas ficam intensas",
      "Entre commits e deploys",
      "Durante a sprint, lembre de"
    ],
    acao: [
      "celebrar com humor", "equilibrar", "manter a", "cultivar"
    ],
    foco: [
      "leveza no trabalho pesado", "harmonia entre front e back",
      "paz interior durante code reviews", "alegria nas entregas",
      "equilíbrio vida-código", "diversão em equipe"
    ],
    motivacao: [
      "porque debuggar é ser detetive do século XXI",
      "pois cada bug resolvido é uma vitória épica",
      "já que programar é arte disfarçada de lógica"
    ]
  },

  // === VOCABULÁRIO COMPARTILHADO ===
  compartilhado: {
    condicional: [
      "Se o desafio parecer grande", "Quando o prazo apertar",
      "Se as ideias não fluírem", "Quando a pressão aumentar",
      "Se der aquele medo", "Quando tudo parecer impossível"
    ],
    conselho: [
      "respire fundo e divida o problema",
      "peça ajuda sem hesitar", 
      "confie no processo",
      "foque no próximo passo",
      "lembre que o time está junto"
    ],
    resultado: [
      "e você vai se surpreender com o resultado",
      "e o time todo vai se beneficiar",
      "e a solução vai aparecer mais clara",
      "e o progresso vai ser consistente"
    ]
  }
};

// Frases prontas organizadas por categoria
const FRASES_PRONTAS = [
  // === MOTIVACIONAL PURO ===
  "Se chegamos até aqui, já vale um parabéns — cada passo conta!",
  "Nem sempre a estrada é fácil, mas juntos a gente transforma o caminho em conquista.",
  "Todo mundo erra, mas só quem compartilha aprende de verdade. Bora crescer juntos?",
  "A entrega é importante, mas ninguém precisa carregar o peso sozinho. Pode chamar!",
  "Não subestime o poder de uma boa dúvida: ela pode ser o início da nossa próxima solução.",
  "O resultado de hoje é mérito do esforço coletivo — e amanhã tem mais.",
  "Cada bug resolvido é uma pequena vitória que merece ser comemorada.",
  "O melhor código é aquele escrito em colaboração — duas cabeças pensam melhor que uma.",
  "Não existe pergunta boba quando o objetivo é aprender e crescer juntos.",
  "O deadline é importante, mas a saúde mental e o bem-estar do time são prioridade.",
  "Lembra quando isso parecia impossível? Pois é, você chegou aqui. Continue!",
  "O erro de hoje é a experiência de amanhã — aproveite cada oportunidade de aprender.",
  "Seu código pode não estar perfeito, mas sua dedicação e esforço são impecáveis.",
  "O segredo não é acertar na primeira, é persistir até encontrar a solução certa.",
  "Cada commit é um passo à frente, cada pull request é uma chance de melhorar.",
  "O que importa não é a velocidade, mas a consistência e a qualidade da jornada.",
  
  // === HUMOR PURO ===
  "Programar é 10% inspiração, 20% cafeína e 70% tentar entender o código que você escreveu ontem.",
  "Todo desenvolvedor tem três versões: 'funciona na minha máquina', 'deveria funcionar' e 'não sei por que funciona'.",
  "O melhor debugger do mundo ainda é o console.log estrategicamente posicionado.",
  "A diferença entre um dev júnior e sênior? O sênior sabe onde procurar no Google.",
  "Erro 404: motivação não encontrada. Reiniciando com café...",
  "Se você nunca teve que explicar seu código para um pato de borracha, você não é um dev de verdade.",
  "Commit message: 'Fixed everything' - a esperança eterna de todo programador.",
  "Tem dia que o CSS coopera, tem dia que ele resolve trollar. Hoje parece um dia de trollagem.",
  "A única constante na programação são as mudanças... e os bugs que aparecem do nada.",
  "Não é bug, é uma funcionalidade não documentada esperando pelo momento certo de brilhar!",
  "Git commit -m 'isso vai funcionar' - famosas últimas palavras antes do rollback.",
  "Seu código funcionar na primeira tentativa é como ganhar na loteria: teoricamente possível, praticamente improvável.",
  "Stack Overflow é tipo Google, mas para pessoas que sabem o que estão procurando... mais ou menos.",
  "Documentação é como a academia: todo mundo sabe que deveria fazer, mas sempre deixa para depois.",
  "99 little bugs in the code, 99 little bugs... take one down, patch it around, 117 little bugs in the code.",
  
  // === MOTIVACIONAL + HUMOR (MIX) ===
  "O código compila mais rápido quando a gente comemora cada avanço — não esqueça de celebrar!",
  "Aqui, cada vitória é do time todo. E cada dificuldade também. Vamos virar esse jogo juntos.",
  "Às vezes, a melhor sprint é aquela em que todo mundo termina sorrindo.",
  "Se está difícil agora, é porque estamos no meio do caminho. O final dessa história a gente escreve juntos.",
  "Se o código funciona, não mexa. Se não funciona, também não mexa... brincadeira, pode mexer!",
  "Lembre-se: até o Stack Overflow começou com uma pergunta boba de alguém.",
  "Seu código hoje pode não ser perfeito, mas é infinitamente melhor que o código que você não escreveu.",
  "Cada deploy bem-sucedido é uma pequena vitória que merece pelo menos um café comemorativo.",
  "O bug mais difícil de hoje vai ser a história engraçada de amanhã — e você vai ter orgulho de ter resolvido.",
  "Entre um merge conflict e outro, lembre-se: você está construindo algo incrível.",
  "Todo código que funciona é um pequeno milagre disfarçado de lógica — celebre isso!",
  "Quando o CSS finalmente cooperar, você vai saber que é hora de fazer backup de tudo.",
  "Debuggar é como resolver um mistério: frustrante no começo, satisfatório no final.",
  "Se o código não funcionou na primeira, parabéns! Você está oficialmente no clube dos 99% dos desenvolvedores.",
  "Entre um bug e uma funcionalidade nova, sempre sobra tempo para um bom café e uma risada com o time."
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
    
    // Seleciona o vocabulário baseado na categoria do template
    const categoria = template.categoria;
    const vocabularioEscolhido = VOCABULARIO[categoria];
    
    // Substitui cada placeholder pelo vocabulário correspondente
    const placeholders = frase.match(/\{\{(\w+)\}\}/g);
    
    if (!placeholders) return frase;
    
    placeholders.forEach(placeholder => {
      const key = placeholder.replace(/[{}]/g, '');
      if (vocabularioEscolhido && key in vocabularioEscolhido) {
        const palavras = vocabularioEscolhido[key as keyof typeof vocabularioEscolhido] as string[];
        const palavra = this.getRandomElement(palavras);
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
    // Define que tipo de frase será gerada
    const tipoRandom = Math.random();
    let templateEscolhido: keyof typeof TEMPLATES;
    
    // 40% motivacional, 30% humor, 20% mix, 10% condicional
    if (tipoRandom < 0.4) {
      templateEscolhido = 'MOTIVACIONAL';
    } else if (tipoRandom < 0.7) {
      templateEscolhido = 'HUMOR';
    } else if (tipoRandom < 0.9) {
      templateEscolhido = 'MIX';
    } else {
      templateEscolhido = 'CONDICIONAL';
    }

    // 70% - Frases geradas por template
    if (Math.random() < 0.7) {
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
    
    // 30% - Frases prontas
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
  
  public getStats(): { 
    totalCombinations: number; 
    usedCombinations: number; 
    breakdown: {
      frasesPronestas: number;
      templates: {
        motivacional: number;
        humor: number;
        mix: number;
        condicional: number;
        total: number;
      };
      grandTotal: number;
    }
  } {
    // Calcula as combinações reais possíveis
    let totalCombinations = FRASES_PRONTAS.length;
    
    // Calcula combinações por categoria de template
    const motivacional = VOCABULARIO.motivacional;
    const humor = VOCABULARIO.humor;
    const mix = VOCABULARIO.mix;
    const compartilhado = VOCABULARIO.compartilhado;
    
    // Multiplicação das possibilidades por template
    const combinacoesMotivacional = 
      motivacional.contexto.length * 
      motivacional.acao.length * 
      motivacional.foco.length * 
      motivacional.motivacao.length;
      
    const combinacoesHumor = 
      humor.contexto.length * 
      humor.acao.length * 
      humor.foco.length * 
      humor.motivacao.length;
      
    const combinacoesMix = 
      mix.contexto.length * 
      mix.acao.length * 
      mix.foco.length * 
      mix.motivacao.length;
      
    const combinacoesCondicional = 
      compartilhado.condicional.length * 
      compartilhado.conselho.length * 
      compartilhado.resultado.length;
    
    const totalTemplates = combinacoesMotivacional + combinacoesHumor + combinacoesMix + combinacoesCondicional;
    totalCombinations += totalTemplates;
    
    const breakdown = {
      frasesPronestas: FRASES_PRONTAS.length,
      templates: {
        motivacional: combinacoesMotivacional,
        humor: combinacoesHumor, 
        mix: combinacoesMix,
        condicional: combinacoesCondicional,
        total: totalTemplates
      },
      grandTotal: totalCombinations
    };
    
    return {
      totalCombinations,
      usedCombinations: this.usedCombinations.size,
      breakdown
    };
  }
}

// =====================================================================
// HOOK PRINCIPAL (mantém a interface existente)
// =====================================================================

const gerador = new GeradorFrases();

// Log das estatísticas para debug
console.log('🎯 ESTATÍSTICAS MOTD:', gerador.getStats());

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
