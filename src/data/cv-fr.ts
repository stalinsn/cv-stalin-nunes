import type { CvData } from '@/types/cv';

export const cvDataFr: CvData = {
  name: "Stalin Souza Nunes",
  title: "Spécialiste VTEX IO & Front-End Senior | ReactJS | TypeScript | Architecture E-commerce & Web Full-Cycle",
  location: "São Paulo – SP, Brésil",
  contact: {
    phone: "+55 11 96367-2087",
    email: "stalinsn@hotmail.com",
    linkedin: "https://linkedin.com/in/stalinsn",
  },
  summary: `Développeur Web Senior, spécialiste en <strong>VTEX IO, ReactJS et TypeScript</strong>, avec plus de <strong>10 ans d'expérience</strong> dans des projets de <strong>e-commerce, architecture de solutions et développement full-cycle</strong>. J'interviens depuis la collecte des besoins, l'architecture, le développement et l'intégration jusqu'au déploiement et à l'évolution continue.<br><br>Forte expérience en tant que <strong>leader technique</strong>, mentorant des équipes, définissant des standards de code, une architecture évolutive et des stratégies qui favorisent la <strong>performance, la conversion et la gouvernance technique</strong> sur les plateformes. Passionné de technologie, avec un esprit orienté résultats et une excellence technique.`,

  coreSkills: [
    "Architecture E-commerce (Headless, VTEX IO, API-First)",
    "Développement Web Front-end (React, Next.js, TypeScript)",
    "Développement Full-Cycle (Back-end, Front-end et DevOps)",
    "Intégration et Architecture d'APIs (REST / GraphQL)",
    "Gestion de versions, Git Flow et modèles de branches",
    "Leadership technique, mentorat et revue de code",
    "Méthodologies Agiles (Scrum, Kanban)",
    "DevOps, CI/CD (Linux, Docker, GitHub Actions)",
  ],

  technicalSkills: {
    "Front‑end": "ReactJS, Next.js, JavaScript ES6+, TypeScript, HTML5, CSS3, SASS, Styled Components, TailwindCSS",
    "E‑commerce": "VTEX CMS/IO, Loja Integrada, NuvemShop",
    "Back‑end": "Node.js, Strapi, PHP",
    DevOps: "GitHub Actions, GitLab CI, Docker, Linux (Nginx, PM2)",
    "Bases de Données": "MySQL, PostgreSQL",
    Autres: "Core Web Vitals, SEO Technique, A/B Testing, Architecture Headless, Performance et Scalabilité",
  },

  languages: [
    { name: "Portugais", level: "Natif" },
    { name: "Anglais", level: "Avancé (Lecture, écriture et conversation technique)" },
    { name: "Espagnol", level: "Intermédiaire (Conversation technique et lecture)" },
  ],

  experience: [
    {
      company: "Stefanini Brasil",
      role: "Développeur Senior | Spécialiste VTEX IO",
      period: "Juil 2022 – Présent",
      location: "São Paulo – SP",
      bullets: [
        "Leadership technique dans les squads VTEX IO, définition d'architectures évolutives, bonnes pratiques, revue de code et stratégie de développement.",
        "Responsable du cycle complet de développement de solutions e-commerce, des besoins au déploiement et au support.",
        "Mise en place de pipelines CI/CD avec GitHub Actions, augmentant l'efficacité des cycles QA et production de 40%.",
        "Migration complète vers l'architecture headless VTEX IO dans 5 boutiques multimarques, réduction de 30% du temps de livraison et augmentation de la stabilité en production.",
        "Mentorat actif de l'équipe de développement, amélioration de la qualité technique et réduction de la reprise de plus de 90%.",
        "Intervention directe sur le troubleshooting des environnements de production, déploiement, maintenance évolutive et support du code.",
      ],
    },
    {
      company: "Tok&Stok",
      role: "Développeur Web VTEX CMS/IO",
      period: "Oct 2020 – Juin 2022",
      location: "São Paulo – SP",
      bullets: [
        "Leadership dans la migration de la plateforme VTEX Legacy vers VTEX IO, modernisation de l'architecture et des interfaces.",
        "Responsable du développement de nouvelles PDP, Homepages et fonctionnalités, avec un gain de +18% en performance (page speed).",
        "Participation active à la planification des solutions, revue de code et définition des meilleures pratiques.",
        "Amélioration des processus de gestion de versions avec Git Flow, réduction des erreurs d'intégration de 25%.",
      ],
    },
    {
      company: "EzLogic Tecnologia",
      role: "Développeur Web VTEX",
      period: "Mai 2020 – Oct 2020",
      location: "São Paulo – SP",
      bullets: [
        "Développement de fonctionnalités personnalisées et maintenance de boutiques VTEX axées sur l'UX et le SEO technique.",
        "Participation à de grands projets comme Vivo, Claro Promo, Usaflex, Tupperware, Loja Avenida, American Pet, Payot et Linea Alimentos.",
        "Mise en œuvre d'améliorations de performance, de réactivité et de SEO, ainsi qu'adaptation aux règles métier.",
      ],
    },
    {
      company: "Elocc Effective Business Builder",
      role: "Développeur Web Ecommerces",
      period: "Août 2019 – Fév 2020",
      location: "São Paulo – SP",
      bullets: [
        "Développement, maintenance et implémentation de boutiques sur VTEX, WooCommerce et plateformes propriétaires.",
        "Participation à des projets de grandes marques comme Copag, Cafe Store, Kenner, MyBasic, OxuaBeach, Casa da Arte, Dular et Drogafuji.",
        "Travaux axés sur la réactivité, le SEO et l'amélioration des fonctionnalités.",
      ],
    },
    {
      company: "Enext, a VML Company",
      role: "Développeur Web Front End",
      period: "Nov 2018 – Fév 2019",
      location: "São Paulo – SP",
      bullets: [
        "Développement de pages et composants pour e-commerce sur la plateforme VTEX.",
        "Participation à l'équipe projet, garantissant la qualité des livraisons et l'adhésion aux layouts UI/UX.",
      ],
    },
    {
      company: "MPPIT Information Technology",
      role: "Technicien Programmeur Web",
      period: "Fév 2013 – Oct 2018",
      location: "São Paulo – SP",
      bullets: [
        "Développement web sur des systèmes internes basés sur PHP, hébergés sur un serveur privé configuré par moi-même.",
        "Responsable du support technique (Smart Hands) pour des équipes étrangères et de la maintenance des équipements et réseaux.",
        "Réalisation de maintenances techniques, troubleshooting hardware, software et infrastructure IT.",
      ],
    },
    {
      company: "Artmeta Informatica",
      role: "Technicien Spécialiste",
      period: "Août 2011 – Jan 2013",
      location: "São Paulo – SP",
      bullets: [
        "Technicien en maintenance hardware, support aux utilisateurs et spécialiste en développement web et maintenance de systèmes d'exploitation.",
        "Support technique de haut niveau pour les clients et maintenance de l'infrastructure technologique.",
      ],
    },
  ],

  education: [
    {
      institution: "Universidade Anhanguera São Paulo",
      degree: "Licence en Ingénierie Logicielle (en cours)",
      period: "2024 – 2028",
      details:
        "Focalisation sur l'architecture logicielle, l'ingénierie des exigences, le développement web fullstack et les pratiques DevOps.",
    },
    {
      institution: "Escola Estadual Eusébio de Paula Marcondes",
      degree: "Enseignement Secondaire",
      period: "2004 – 2007",
    },
  ],

  interests: [
    "Architecture Logicielle",
    "Leadership Technique",
    "Mentorat et Développement d'Équipes",
    "Projets Internationaux / Télétravail",
    "E-commerce Haute Performance",
    "Open-source et Communautés de Développement",
  ],
};
