import type { CvData } from '@/types/cv';

export const cvDataEs: CvData = {
  name: "Stalin Souza Nunes",
  title: "Especialista VTEX IO y Front-End Senior | ReactJS | TypeScript | Arquitectura de E-commerce y Web Full-Cycle",
  location: "São Paulo – SP, Brasil",
  contact: {
    phone: "+55 11 96367-2087",
    email: "stalinsn@hotmail.com",
    linkedin: "https://linkedin.com/in/stalinsn",
  },
  summary: `Desarrollador Web Senior, especialista en <strong>VTEX IO, ReactJS y TypeScript</strong>, con más de <strong>10 años de experiencia</strong> en proyectos de <strong>e-commerce, arquitectura de soluciones y desarrollo full-cycle</strong>. Actúo desde el levantamiento de requisitos, arquitectura, desarrollo e integración hasta el despliegue y evolución continua.<br><br>Fuerte actuación como <strong>líder técnico</strong>, mentorando equipos, definiendo estándares de código, arquitectura escalable y estrategias que impulsan <strong>rendimiento, conversión y gobernanza técnica</strong> en las plataformas. Apasionado por la tecnología, con mentalidad orientada a resultados y excelencia técnica.`,

  coreSkills: [
    "Arquitectura de E-commerce (Headless, VTEX IO, API-First)",
    "Desarrollo Web Front-end (React, Next.js, TypeScript)",
    "Desarrollo Full-Cycle (Back-end, Front-end y DevOps)",
    "Integración y Arquitectura de APIs (REST / GraphQL)",
    "Versionado, Git Flow y Patrones de Branches",
    "Liderazgo Técnico, Mentoría y Code Review",
    "Metodologías Ágiles (Scrum, Kanban)",
    "DevOps, CI/CD (Linux, Docker, GitHub Actions)",
  ],

  technicalSkills: {
    "Front‑end": "ReactJS, Next.js, JavaScript ES6+, TypeScript, HTML5, CSS3, SASS, Styled Components, TailwindCSS",
    "E‑commerce": "VTEX CMS/IO, Loja Integrada, NuvemShop",
    "Back‑end": "Node.js, Strapi, PHP",
    DevOps: "GitHub Actions, GitLab CI, Docker, Linux (Nginx, PM2)",
    "Bases de Datos": "MySQL, PostgreSQL",
    Otros: "Core Web Vitals, SEO Técnico, A/B Testing, Arquitectura Headless, Performance y Escalabilidad",
  },

  languages: [
    { name: "Portugués", level: "Nativo" },
    { name: "Inglés", level: "Avanzado (Lectura, escritura y conversación técnica)" },
    { name: "Español", level: "Intermedio (Conversación técnica y lectura)" },
  ],

  experience: [
    {
      company: "Stefanini Brasil",
      role: "Analista Desarrollador Sr. | Especialista VTEX IO",
      period: "Jul 2022 – Actual",
      location: "São Paulo – SP",
      bullets: [
        "Liderazgo técnico en squads VTEX IO, definiendo arquitectura escalable, buenas prácticas, code review y estrategia de desarrollo.",
        "Responsable del ciclo completo de desarrollo de soluciones e-commerce, desde requisitos hasta despliegue y soporte.",
        "Implementación de pipelines CI/CD con GitHub Actions, generando un aumento del 40% en la eficiencia de los ciclos de QA y producción.",
        "Condujo la migración completa a arquitectura headless VTEX IO en 5 tiendas multimarcas, con reducción del 30% en el tiempo de entrega y aumento de la estabilidad en producción.",
        "Mentoría activa para el equipo de desarrollo, elevando la calidad técnica y reduciendo el retrabajo en más del 90%.",
        "Actuación directa en troubleshooting de ambientes productivos, despliegue, mantenimiento evolutivo y soporte de código.",
      ],
    },
    {
      company: "Tok&Stok",
      role: "Analista Desarrollador Web VTEX CMS/IO",
      period: "Oct 2020 – Jun 2022",
      location: "São Paulo – SP",
      bullets: [
        "Liderazgo en la migración de la plataforma de VTEX Legacy a VTEX IO, modernizando la arquitectura e interfaces.",
        "Responsable del desarrollo de nuevas PDPs, Homepages y features, con un aumento de +18% en performance (page speed).",
        "Participación activa en la planificación de soluciones, revisión de código y definición de mejores prácticas.",
        "Mejoró los procesos de versionado implementando Git Flow, reduciendo fallos de integración en un 25%.",
      ],
    },
    {
      company: "EzLogic Tecnologia",
      role: "Desarrollador Web VTEX",
      period: "May 2020 – Oct 2020",
      location: "São Paulo – SP",
      bullets: [
        "Desarrollo de features personalizadas y mantenimiento de tiendas VTEX con foco en UX y SEO técnico.",
        "Actuación en grandes proyectos como Vivo, Claro Promo, Usaflex, Tupperware, Loja Avenida, American Pet, Payot y Linea Alimentos.",
        "Implementación de mejoras en performance, responsividad y SEO, además de adecuación a las reglas de negocio.",
      ],
    },
    {
      company: "Elocc Effective Business Builder",
      role: "Desarrollador Web Ecommerces",
      period: "Ago 2019 – Feb 2020",
      location: "São Paulo – SP",
      bullets: [
        "Desarrollo, mantenimiento e implementación de tiendas en VTEX, WooCommerce y plataformas propias.",
        "Participación en proyectos de grandes marcas como Copag, Cafe Store, Kenner, MyBasic, OxuaBeach, Casa da Arte, Dular y Drogafuji.",
        "Trabajos enfocados en responsividad, SEO y mejora de funcionalidades.",
      ],
    },
    {
      company: "Enext, a VML Company",
      role: "Desarrollador Web Front End",
      period: "Nov 2018 – Feb 2019",
      location: "São Paulo – SP",
      bullets: [
        "Desarrollo de páginas y componentes para e-commerce en la plataforma VTEX.",
        "Actuación en el equipo de proyectos, garantizando calidad de entrega y adherencia a los layouts UI/UX.",
      ],
    },
    {
      company: "MPPIT Information Technology",
      role: "Técnico Programador Web",
      period: "Feb 2013 – Oct 2018",
      location: "São Paulo – SP",
      bullets: [
        "Actuación como desarrollador web en sistemas internos basados en PHP, hospedados en servidor privado configurado por mí.",
        "Responsable de soporte técnico (Smart Hands) para equipos extranjeros y mantenimiento de equipos y redes.",
        "Ejecución de mantenimientos técnicos, troubleshooting de hardware, software e infraestructura TI.",
      ],
    },
    {
      company: "Artmeta Informatica",
      role: "Técnico Especialista",
      period: "Ago 2011 – Jan 2013",
      location: "São Paulo – SP",
      bullets: [
        "Técnico en mantenimiento de hardware, soporte a usuarios y especialista en desarrollo web y mantenimiento de sistemas operativos.",
        "Atención técnica de alto nivel para clientes y mantenimiento de infraestructura tecnológica.",
      ],
    },
  ],

  education: [
    {
      institution: "Universidade Anhanguera São Paulo",
      degree: "Licenciatura en Ingeniería de Software (en curso)",
      period: "2024 – 2028",
      details:
        "Enfoque en arquitectura de software, ingeniería de requisitos, desarrollo web fullstack y prácticas de DevOps.",
    },
    {
      institution: "Escola Estadual Eusébio de Paula Marcondes",
      degree: "Educación Secundaria",
      period: "2004 – 2007",
    },
  ],

  interests: [
    "Arquitectura de Software",
    "Liderazgo Técnico",
    "Mentoría y Desarrollo de Equipos",
    "Proyectos Internacionales / Remoto",
    "E-commerce de Alto Rendimiento",
    "Open-source y Comunidades de Desarrollo",
  ],
};
