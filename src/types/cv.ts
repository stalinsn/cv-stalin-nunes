export interface Contact {
  phone: string;
  email: string;
  linkedin: string;
}

export interface Language {
  name: string;
  level: string;
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  location: string;
  bullets: string[];
}

export interface Education {
  institution: string;
  degree: string;
  period: string;
  details?: string;
}

export interface CvData {
  name: string;
  title: string;
  location: string;
  contact: Contact;
  summary: string;
  coreSkills: string[];
  technicalSkills: Record<string, string>;
  languages: Language[];
  experience: Experience[];
  education: Education[];
  interests: string[];
  // Títulos traduzidos por IA (opcionais)
  summaryTitle?: string;
  coreSkillsTitle?: string;
  technicalSkillsTitle?: string;
  experienceTitle?: string;
  educationTitle?: string;
  languagesTitle?: string;
}