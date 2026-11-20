export type ProjectLanguage = 'en' | 'es';

export interface LocalizedText {
  en: string;
  es: string;
}

export interface Project {
  slug: string;
  name: LocalizedText;
  shortDescription: LocalizedText;
  longDescription?: LocalizedText;
  technologies: string[];
  screenshot?: string;
  url?: string;
  repository?: string;
  caseStudy?: {
    problem?: LocalizedText;
    solution?: LocalizedText;
    result?: LocalizedText;
  };
}

export const projectLabels: Record<ProjectLanguage, { visitSite: string; repository: string }> = {
  en: { visitSite: 'Visit site', repository: 'Repository' },
  es: { visitSite: 'Ver sitio', repository: 'Repositorio' },
};

export const projects: Project[] = [
  {
    slug: 'webforge',
    name: { en: 'WebForge', es: 'WebForge' },
    shortDescription: {
      en: 'A digital studio for small businesses and modern entrepreneurs.',
      es: 'Estudio digital para pequeños negocios y emprendedores modernos.',
    },
    longDescription: {
      en: 'My personal digital studio, focused on web platforms and digital tools for small businesses and modern entrepreneurs.',
      es: 'Mi estudio digital personal, enfocado en plataformas web y herramientas digitales para pequeños negocios y emprendedores modernos.',
    },
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'SEO'],
    url: 'https://webforge.dev',
  },
  {
    slug: 'chapinstock',
    name: { en: 'Chapin Stock', es: 'Chapin Stock' },
    shortDescription: {
      en: 'A digital catalog and e-commerce portal for a retail client in Guatemala.',
      es: 'Catálogo digital y portal de comercio electrónico para un cliente minorista en Guatemala.',
    },
    longDescription: {
      en: 'A digital catalog and e-commerce portal featuring WhatsApp checkout and inventory filtering.',
      es: 'Catálogo digital y portal de comercio electrónico con pedidos por WhatsApp y filtros de inventario.',
    },
    technologies: ['TypeScript', 'React', 'Tailwind CSS', 'WhatsApp API', 'UX'],
    url: 'https://chapinstock.gt',
    caseStudy: {
      problem: { en: 'Inventory', es: 'Inventario' },
      solution: { en: 'Inventory organization', es: 'Organización en inventario' },
    },
  },
  {
    slug: 'paraboo',
    name: { en: 'Para Boo', es: 'Para Boo' },
    shortDescription: {
      en: 'An interactive web canvas exploring motion, physics, and audio-reactive visuals.',
      es: 'Lienzo web interactivo que explora movimiento, física y visuales reactivos al audio.',
    },
    longDescription: {
      en: 'An expressive interactive web canvas exploring creative motion, physics-based interactions, and audio-reactive visuals.',
      es: 'Experiencia web interactiva y creativa que explora animaciones con física, microinteracciones y elementos reactivos al audio.',
    },
    technologies: ['React', 'Framer Motion', 'Canvas API', 'Web Audio'],
    url: 'https://paraboo.space',
  },
];
