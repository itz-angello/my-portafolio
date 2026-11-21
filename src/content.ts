// ============================================================
// ALL PERSONAL CONTENT AND TEXTS (EN & ES)
// Edit this file to update your portfolio without touching components.
// ============================================================

export type Language = 'en' | 'es';
import { projects, type Project } from './content/projects';

export interface LocalizedString {
  en: string;
  es: string;
}

export type SkillCategory = 'languages' | 'tools' | 'craft';

export interface Skill {
  id: string;
  name: string;
  group: SkillCategory;
  level: string;
  note: LocalizedString;
  details: LocalizedString;
}

export interface Service {
  id: string;
  num: string;
  title: LocalizedString;
  desc: LocalizedString;
  highlights: LocalizedString[];
}

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  date: string;
  image?: string; // path to certificate image
}

export interface SiteContent {
  // Personal & Brand
  name: string;
  github: string;
  discord: string;
  email: string;
  whatsapp: string;
  cv: string;
  photo: string;

  // Contact Form
  formAction: string;

  // Bilingual strings
  texts: {
    [key in Language]: {
      skipToContent: string;
      nav: {
        label: string;
        home: string;
        about: string;
        portfolio: string;
        contact: string;
        // legacy (kept for any old component references)
        projects: string;
        skills: string;
        services: string;
      };
      metadata: {
        home: { title: string; description: string };
        about: { title: string; description: string };
        portfolio: { title: string; description: string };
        contact: { title: string; description: string };
        notFound: { title: string; description: string };
      };
      home: {
        hi: string;
        viewProjects: string;
        contactMe: string;
        roles: string[];
      };
      hero: {
        badge: string;
        headingLead: string;
        tagline: string;
        cta: string;
        liveBrowserStatus: string;
        visualLabel: string;
        visualCaption: string;
      };
      marqueeTitle: string;
      marqueePills: string[];
      about: {
        heading: string;
        lead: string;
        bio: string; // 1–2 sentence bio for About page
        scrubText: string;
        subnote: string;
        stats: { count: number; suffix?: string; label: string }[];
        cvDownload: string;
        services: { title: string; desc: string }[]; // 4 items for About page
        photoAlt: string;
        nowUsingTitle: string;
        nowUsingTools: string[];
      };
      portfolio: {
        whatIDo: string;
        developCard: { title: string; tags: string[] };
        restoreCard: { title: string; tags: string[] };
        featuredHeading: string;
        archiveHeading: string;
        archiveCount: string;
        archiveEmpty: string;
        captureComing: string;
        visitSite: string;
        repository: string;
        role: string;
        year: string;
        categories: { all: string; personal: string; client: string; learning: string };
        tabs: {
          projects: string;
          certificates: string;
          skills: string;
        };
        heading: string;
        subheading: string;
        liveButton: string;
        previewLabel: string;
        detailsLink: string;
      };
      projectCase: {
        back: string;
        problem: string;
        solution: string;
        tech: string;
        visit: string;
        before: string;
        after: string;
        gallery: string;
        galleryAlt: string;
        notFound: string;
      };
      skills: {
        heading: string;
        subheading: string;
        filterAll: string;
        filterLanguages: string;
        filterTools: string;
        filterCraft: string;
        clickHint: string;
        closeDetail: string;
        workshopTitle: string;
        workshopDescription: string;
        categories: { languages: string; tools: string; craft: string };
      };
      services: {
        badge: string;
        heading: string;
        subheading: string;
        ctaNote: string;
        quoteLabel: string;
      };
      contact: {
        heading: string;
        subheading: string;
        githubButton: string;
        discordButton: string;
        emailDirect: string;
        whatsappButton: string;
        form: {
          nameLabel: string;
          namePlaceholder: string;
          emailLabel: string;
          emailPlaceholder: string;
          messageLabel: string;
          messagePlaceholder: string;
          submitButton: string;
          submitting: string;
          successTitle: string;
          successMessage: string;
          errorTitle: string;
          errorMessage: string;
          sendAnother: string;
        };
      };
      footer: {
        location: string;
        rights: string;
        backToTop: string;
      };
    };
  };

  // Structured Items
  projects: Project[];
  skills: Skill[];
  services: Service[];
  certificates: Certificate[]; // empty for now — user will fill
  marqueeScreenshots: { title: string; image: string }[];
}

export const content: SiteContent = {
  name: "Angel",
  github: "https://github.com/itz-angello",
  discord: "",
  email: "",
  whatsapp: "+50255688746",
  cv: "",
  photo: "",
  formAction: "",

  texts: {
    en: {
      skipToContent: "Skip to content",
      nav: {
        label: "Main navigation",
        home: "Home",
        about: "About",
        portfolio: "Portfolio",
        contact: "Contact",
        // legacy
        projects: "Projects",
        skills: "Skills",
        services: "Services",
      },
      metadata: {
        home: {
          title: "Angel Chacón — Web Developer in Guatemala",
          description: "Angel Chacón, web developer in Guatemala. I build fast, responsive websites for small businesses.",
        },
        about: {
          title: "About — Angel Chacón, Web Developer in Guatemala",
          description: "Learn about Angel Chacón, web developer in Guatemala, his approach and the tools he uses.",
        },
        portfolio: {
          title: "Portfolio — Angel Chacón, Web Developer in Guatemala",
          description: "Selected web development projects by Angel Chacón, web developer in Guatemala.",
        },
        contact: {
          title: "Contact — Angel Chacón, Web Developer in Guatemala",
          description: "Contact Angel Chacón, web developer in Guatemala, about your next website project.",
        },
        notFound: {
          title: "Page not found — Angel Chacón",
          description: "This page was not found. Return to Angel Chacón's web development portfolio in Guatemala.",
        },
      },
      home: {
        hi: "Hi, I'm Angel",
        viewProjects: "View projects",
        contactMe: "Contact me",
        roles: ["Web Developer", "Website restoration", "Freelance projects"],
      },
      hero: {
        badge: "Available for freelance & contract",
        headingLead: "I'm",
        tagline: "I'm a freelance web developer from Guatemala. I build high-performance, responsive websites for small businesses and clients worldwide.",
        cta: "Contact me",
        liveBrowserStatus: "angello.dev/preview — 60fps • accessible",
        visualLabel: "Independent web developer",
        visualCaption: "Designing and building for the web",
      },
      marqueeTitle: "Selected Works & UI Interfaces",
      marqueePills: [
        "Modern Web Apps",
        "Landing Pages",
        "E-Commerce",
        "Website Redesigns",
        "Core Web Vitals 100",
        "Mobile First",
        "Clean TypeScript",
        "Fluid Animations",
      ],
      about: {
        heading: "About",
        lead: "I make websites that load fast, look good on a phone, and turn curious visitors into paying customers.",
        bio: "I'm a freelance web developer based in Guatemala, building and restoring fast, responsive websites for small businesses and clients around the world.",
        scrubText: "Based in Guatemala, I craft bespoke web experiences with meticulous attention to detail. Whether starting from scratch for a local enterprise or breathing new life into an outdated site, I combine speed, responsive aesthetics, and robust code to build platforms that elevate your brand.",
        subnote: "Open to freelance projects, agency contracting, and long-term remote partnerships.",
        stats: [],
        cvDownload: "Download CV",
        services: [
          { title: "Web Development", desc: "Modern, fast sites built with React, TypeScript, and Vite." },
          { title: "Website Restoration", desc: "Rebuilding legacy or broken sites while keeping SEO value." },
          { title: "Landing Pages", desc: "Conversion-focused pages for campaigns, products, and events." },
          { title: "Ongoing Support", desc: "Updates, fixes, and improvements after your site goes live." },
        ],
        photoAlt: "Portrait of Angel",
        nowUsingTitle: "Currently using",
        nowUsingTools: ["VS Code", "Antigravity", "Codex"],
      },
      portfolio: {
        whatIDo: "WHAT I DO",
        developCard: {
          title: "Develop",
          tags: ["React", "TypeScript", "Vite", "Responsive", "SEO"],
        },
        restoreCard: {
          title: "Restore",
          tags: ["Legacy HTML", "CSS fixes", "Mobile bugs", "Speed boost"],
        },
        featuredHeading: "Featured projects",
        archiveHeading: "More projects",
        archiveCount: "{count} projects in archive",
        archiveEmpty: "More projects will appear here as they are added.",
        captureComing: "Capture coming soon",
        visitSite: "Visit site",
        repository: "View repository",
        role: "Role",
        year: "Year",
        categories: { all: "All", personal: "Personal", client: "Client", learning: "Learning" },
        tabs: {
          projects: "Projects",
          certificates: "Certificates",
          skills: "Skills",
        },
        heading: "Featured Work",
        subheading: "A selection of projects crafted with precision, responsiveness, and performance.",
        liveButton: "Live project",
        previewLabel: "View project details",
        detailsLink: "Details →",
      },
      projectCase: {
        back: "Back to portfolio",
        problem: "The challenge",
        solution: "The approach",
        tech: "Technology",
        visit: "Visit live project",
        before: "Before",
        after: "After",
        gallery: "Project view",
        galleryAlt: "Project screen",
        notFound: "This project could not be found.",
      },
      skills: {
        heading: "Skills & Craft",
        subheading: "Focused expertise in the technologies and methodologies I use every day.",
        filterAll: "All",
        filterLanguages: "Languages",
        filterTools: "Tools",
        filterCraft: "Craft",
        clickHint: "Click any skill tile to view details and experience.",
        closeDetail: "Close details",
        workshopTitle: "Tools of the workshop",
        workshopDescription: "The languages, tools, and practices I use to design and build for the web.",
        categories: { languages: "Languages", tools: "Tools", craft: "Craft" },
      },
      services: {
        badge: "What I Offer",
        heading: "Services",
        subheading: "Tailored web engineering solutions designed to solve real business challenges.",
        ctaNote: "Have a custom requirement? Let's discuss a tailored plan.",
        quoteLabel: "Request a project quote",
      },
      contact: {
        heading: "Need a website?",
        subheading: "Tell me about your business and what you need. I'll get back to you with a clear roadmap and estimate.",
        githubButton: "View on GitHub",
        discordButton: "Connect on Discord",
        emailDirect: "Send an email",
        whatsappButton: "Chat on WhatsApp",
        form: {
          nameLabel: "Your Name",
          namePlaceholder: "e.g. Maria Gonzalez",
          emailLabel: "Your Email",
          emailPlaceholder: "maria@example.com",
          messageLabel: "Project Details",
          messagePlaceholder: "Describe your project, timeline, and goals...",
          submitButton: "Send message",
          submitting: "Sending message...",
          successTitle: "Message received!",
          successMessage: "Thank you for reaching out. I'll review your details and respond shortly.",
          errorTitle: "Submission failed",
          errorMessage: "Could not send your message. Please try again or reach out directly on GitHub.",
          sendAnother: "Send another message",
        },
      },
      footer: {
        location: "Built in Guatemala",
        rights: "All rights reserved.",
        backToTop: "Back to top",
      },
    },
    es: {
      skipToContent: "Saltar al contenido",
      nav: {
        label: "Navegación principal",
        home: "Inicio",
        about: "Sobre mí",
        portfolio: "Portafolio",
        contact: "Contacto",
        // legacy
        projects: "Proyectos",
        skills: "Habilidades",
        services: "Servicios",
      },
      metadata: {
        home: {
          title: "Angel Chacón — Desarrollador web en Guatemala",
          description: "Angel Chacón, desarrollador web en Guatemala. Creo sitios rápidos y adaptables para pequeños negocios.",
        },
        about: {
          title: "Sobre mí — Angel Chacón, Desarrollador web en Guatemala",
          description: "Conoce a Angel Chacón, desarrollador web en Guatemala, su enfoque y las herramientas que usa.",
        },
        portfolio: {
          title: "Portafolio — Angel Chacón, Desarrollador web en Guatemala",
          description: "Proyectos seleccionados de Angel Chacón, desarrollador web en Guatemala.",
        },
        contact: {
          title: "Contacto — Angel Chacón, Desarrollador web en Guatemala",
          description: "Contacta a Angel Chacón, desarrollador web en Guatemala, para hablar de tu próximo sitio web.",
        },
        notFound: {
          title: "Página no encontrada — Angel Chacón",
          description: "No encontramos esta página. Vuelve al portafolio de Angel Chacón, desarrollador web en Guatemala.",
        },
      },
      home: {
        hi: "Hola, soy Angel",
        viewProjects: "Ver proyectos",
        contactMe: "Contáctame",
        roles: ["Desarrollador web", "Restauración de sitios", "Proyectos freelance"],
      },
      hero: {
        badge: "Disponible para proyectos freelance",
        headingLead: "Soy",
        tagline: "Soy desarrollador web en Guatemala. Creo páginas web rápidas y adaptables para pequeños negocios y clientes freelance.",
        cta: "Contáctame",
        liveBrowserStatus: "angello.dev/preview — 60fps • accesible",
        visualLabel: "Desarrollador web independiente",
        visualCaption: "Diseño y desarrollo para la web",
      },
      marqueeTitle: "Trabajos Seleccionados e Interfaces",
      marqueePills: [
        "Aplicaciones Web",
        "Landing Pages",
        "Comercio Electrónico",
        "Rediseño Web",
        "Rendimiento 100",
        "Mobile First",
        "TypeScript Limpio",
        "Animaciones Fluidas",
      ],
      about: {
        heading: "Sobre mí",
        lead: "Hago páginas web que cargan rápido, se ven excelentes en cualquier celular y convierten visitantes en clientes.",
        bio: "Soy desarrollador web freelance en Guatemala, creando y restaurando sitios rápidos y adaptables para negocios locales y clientes de todo el mundo.",
        scrubText: "Desde Guatemala, desarrollo experiencias digitales hechas a la medida con cuidado en cada píxel. Ya sea comenzando un sitio desde cero para un negocio local o renovando una página desactualizada, combino velocidad, estética responsive y código confiable para impulsar tu marca.",
        subnote: "Disponible para proyectos freelance, colaboraciones con agencias y clientes a largo plazo.",
        stats: [],
        cvDownload: "Descargar CV",
        services: [
          { title: "Desarrollo web", desc: "Sitios modernos y rápidos con React, TypeScript y Vite." },
          { title: "Restauración de páginas", desc: "Reconstrucción de sitios obsoletos conservando el SEO." },
          { title: "Landing pages", desc: "Páginas de alto impacto para campañas, productos y eventos." },
          { title: "Soporte continuo", desc: "Actualizaciones, correcciones y mejoras después del lanzamiento." },
        ],
        photoAlt: "Retrato de Angel",
        nowUsingTitle: "Ahora estoy usando",
        nowUsingTools: ["VS Code", "Antigravity", "Codex"],
      },
      portfolio: {
        whatIDo: "LO QUE HAGO",
        developCard: {
          title: "Desarrollo",
          tags: ["React", "TypeScript", "Vite", "Responsive", "SEO"],
        },
        restoreCard: {
          title: "Restauración",
          tags: ["HTML heredado", "Corrección CSS", "Bugs móvil", "Velocidad"],
        },
        featuredHeading: "Proyectos destacados",
        archiveHeading: "Más proyectos",
        archiveCount: "{count} proyectos en archivo",
        archiveEmpty: "Aquí aparecerán más proyectos cuando se agreguen.",
        captureComing: "Captura próximamente",
        visitSite: "Ver sitio",
        repository: "Ver repositorio",
        role: "Rol",
        year: "Año",
        categories: { all: "Todos", personal: "Personal", client: "Cliente", learning: "Aprendizaje" },
        tabs: {
          projects: "Proyectos",
          certificates: "Certificados",
          skills: "Habilidades",
        },
        heading: "Proyectos Destacados",
        subheading: "Una muestra de proyectos desarrollados con enfoque en rendimiento y diseño adaptativo.",
        liveButton: "Ver proyecto",
        previewLabel: "Ver detalles del proyecto",
        detailsLink: "Detalles →",
      },
      projectCase: {
        back: "Volver al portafolio",
        problem: "El reto",
        solution: "La solución",
        tech: "Tecnologías",
        visit: "Ver proyecto en vivo",
        before: "Antes",
        after: "Después",
        gallery: "Vista del proyecto",
        galleryAlt: "Pantalla del proyecto",
        notFound: "No se encontró este proyecto.",
      },
      skills: {
        heading: "Habilidades y Oficio",
        subheading: "Tecnologías y prácticas que domino y aplico activamente en producción.",
        filterAll: "Todas",
        filterLanguages: "Lenguajes",
        filterTools: "Herramientas",
        filterCraft: "Oficio",
        clickHint: "Haz clic en cualquier tarjeta para ver detalles y experiencia.",
        closeDetail: "Cerrar detalles",
        workshopTitle: "Herramientas del taller",
        workshopDescription: "Lenguajes, herramientas y prácticas que uso para diseñar y construir para la web.",
        categories: { languages: "Lenguajes", tools: "Herramientas", craft: "Oficio" },
      },
      services: {
        badge: "Lo que ofrezco",
        heading: "Servicios",
        subheading: "Soluciones web profesionales pensadas para resolver necesidades reales de negocio.",
        ctaNote: "¿Tienes un proyecto específico? Escríbeme y definimos un plan a tu medida.",
        quoteLabel: "Cotiza tu proyecto",
      },
      contact: {
        heading: "¿Necesitas una página web?",
        subheading: "Cuéntame sobre tu proyecto y lo que necesitas. Te responderé con una propuesta y presupuesto claro.",
        githubButton: "Ver en GitHub",
        discordButton: "Escribir en Discord",
        emailDirect: "Enviar correo directo",
        whatsappButton: "Escríbeme por WhatsApp",
        form: {
          nameLabel: "Tu Nombre",
          namePlaceholder: "Ej. María González",
          emailLabel: "Tu Correo Electrónico",
          emailPlaceholder: "maria@ejemplo.com",
          messageLabel: "Detalles del Proyecto",
          messagePlaceholder: "Cuéntame qué necesitas, fechas estimadas y objetivos...",
          submitButton: "Enviar mensaje",
          submitting: "Enviando mensaje...",
          successTitle: "¡Mensaje recibido!",
          successMessage: "Gracias por escribir. Revisaré tus detalles y te responderé en breve.",
          errorTitle: "Error al enviar",
          errorMessage: "No se pudo enviar el mensaje. Por favor intenta de nuevo o escríbeme por GitHub.",
          sendAnother: "Enviar otro mensaje",
        },
      },
      footer: {
        location: "Hecho en Guatemala",
        rights: "Todos los derechos reservados.",
        backToTop: "Volver arriba",
      },
    },
  },

  projects,

  // Certificates — empty for now; fill in when ready
  certificates: [],

  skills: [
    {
      id: "html",
      name: "HTML5",
      group: "languages",
      level: "Semantic & A11y",
      note: {
        en: "Accessible page structure, semantic landmarks, and SEO optimization.",
        es: "Estructura semántica, accesibilidad web (WCAG) y optimización SEO.",
      },
      details: {
        en: "Writing clean, semantic HTML ensures that screen readers, search engine crawlers, and modern browsers parse every page accurately without unnecessary bloat.",
        es: "El uso de HTML semántico y limpio garantiza accesibilidad para lectores de pantalla, indexación óptima en buscadores y compatibilidad universal.",
      },
    },
    {
      id: "css",
      name: "CSS / Tailwind",
      group: "languages",
      level: "Modern & Fluid",
      note: {
        en: "Tailwind CSS, fluid clamp() typography, CSS Grid, and custom animations.",
        es: "Tailwind CSS, tipografía fluida clamp(), CSS Grid y animaciones personalizadas.",
      },
      details: {
        en: "Specialized in crafting custom layouts with Tailwind CSS, leveraging modern CSS features like container queries, fluid clamp math, and dark mode theming.",
        es: "Especialista en interfaces modernas con Tailwind CSS, aprovechando tipografía fluida, variables CSS nativas y diseño adaptable para modo oscuro.",
      },
    },
    {
      id: "javascript",
      name: "JavaScript",
      group: "languages",
      level: "ESNext Modern",
      note: {
        en: "Interactive client logic, async APIs, and modular modern ES code.",
        es: "Lógica interactiva del cliente, APIs asíncronas y código ES moderno y modular.",
      },
      details: {
        en: "Proficient in modern ES6+ standards, event-driven programming, DOM manipulation, and asynchronous REST fetch workflows.",
        es: "Dominio de estándares modernos ES6+, programación orientada a eventos, manipulación del DOM y consumo eficiente de APIs.",
      },
    },
    {
      id: "typescript",
      name: "TypeScript",
      group: "languages",
      level: "Type-Safe Architecture",
      note: {
        en: "Strict type safety, self-documenting code, and clean refactoring.",
        es: "Tipado estricto, interfaces claras y código seguro para mantenimiento.",
      },
      details: {
        en: "Using TypeScript prevents runtime regressions, provides rich autocomplete, and guarantees reliable contracts between components and data sources.",
        es: "El tipado estricto evita errores en producción, acelera el desarrollo y asegura coherencia total en componentes y estructuras de datos.",
      },
    },
    {
      id: "react",
      name: "React & Vite",
      group: "languages",
      level: "Component Architecture",
      note: {
        en: "Composable UI components, hooks, high-speed HMR, and lean bundling.",
        es: "Componentes reutilizables, hooks, compilación ultrarrápida y empaquetado optimizado.",
      },
      details: {
        en: "Building modular component systems with React and Vite. Focused on minimal re-renders, fast initial load times, and intuitive UI state.",
        es: "Construcción de interfaces modulares con React y Vite, optimizando los ciclos de renderizado y tiempos de carga instantáneos.",
      },
    },
    {
      id: "git",
      name: "Git",
      group: "tools",
      level: "Version Control",
      note: {
        en: "Clean commit history, branch management, and safe rollbacks.",
        es: "Historial de cambios claro, gestión de ramas y respaldos seguros.",
      },
      details: {
        en: "Carefully structured commits and organized branches ensure every project milestone is tracked, tested, and safely deployable.",
        es: "Commits organizados y ramas de trabajo estructuradas que garantizan control total sobre cada avance y despliegue del proyecto.",
      },
    },
    {
      id: "github",
      name: "GitHub",
      group: "tools",
      level: "CI/CD & Collaboration",
      note: {
        en: "Repository hosting, automated actions, and production deployment.",
        es: "Alojamiento de código, automatizaciones y despliegues a producción.",
      },
      details: {
        en: "Automated continuous deployment via Netlify and GitHub Pages, paired with code reviews and issue tracking.",
        es: "Integración continua con plataformas como Netlify y GitHub Pages para publicar actualizaciones automáticamente sin caídas.",
      },
    },
    {
      id: "responsive",
      name: "Responsive Design",
      group: "craft",
      level: "Mobile First",
      note: {
        en: "Pixel-perfect adaptation across phones, tablets, and desktop displays.",
        es: "Adaptación milimétrica en teléfonos, tabletas y pantallas de escritorio.",
      },
      details: {
        en: "Every interface is built mobile-first, ensuring high usability, touch-friendly targets, and seamless readability regardless of screen dimensions.",
        es: "Diseño concebido primero para pantallas móviles, garantizando botones cómodos para el tacto y textos legibles en cualquier dispositivo.",
      },
    },
    {
      id: "restoration",
      name: "Website Restoration",
      group: "craft",
      level: "Rebuilding & Modernizing",
      note: {
        en: "Reviving legacy or broken sites while preserving existing SEO value.",
        es: "Modernización de sitios obsoletos o rotos conservando su posicionamiento.",
      },
      details: {
        en: "Rescuing outdated websites: replacing unmaintained libraries, fixing mobile display issues, and bringing Lighthouse scores to 95+.",
        es: "Rehabilitación de sitios antiguos: eliminación de dependencias pesadas, corrección de errores en móviles y optimización a más de 95 puntos en Lighthouse.",
      },
    },
    {
      id: "performance",
      name: "Core Web Vitals",
      group: "craft",
      level: "Performance & SEO",
      note: {
        en: "Sub-second load times, image compression, and zero layout shifts (CLS).",
        es: "Cargas en menos de un segundo, compresión de imágenes y estabilidad visual.",
      },
      details: {
        en: "Speed directly impacts conversions. Every asset is optimized, SVGs are minified, and layout shifts are eliminated for smooth 60fps scrolling.",
        es: "La velocidad influye directamente en las ventas. Optimizo recursos, comprimo gráficos y elimino saltos de página para una experiencia a 60fps.",
      },
    },
  ],

  services: [
    {
      id: "business-sites",
      num: "01",
      title: { en: "Business websites", es: "Páginas para negocios" },
      desc: {
        en: "A comprehensive digital presence for shops, restaurants, clinics, or service providers. Engineered to load instantly, look stunning on mobile phones, and make it effortless for customers to contact or visit you.",
        es: "Un sitio web completo para tiendas, restaurantes, clínicas o negocios de servicios. Creado para cargar al instante, verse impecable en celulares y facilitar que tus clientes te llamen o visiten.",
      },
      highlights: [
        { en: "Mobile-first responsive design", es: "Diseño adaptable pensado para celulares" },
        { en: "Local SEO & Google Maps integration", es: "SEO local e integración con Google Maps" },
        { en: "Direct WhatsApp contact buttons", es: "Botones de contacto directo a WhatsApp" },
      ],
    },
    {
      id: "landing-pages",
      num: "02",
      title: { en: "Landing pages", es: "Landing pages" },
      desc: {
        en: "One laser-focused page tailored for a product launch, seasonal offer, campaign, or event. Designed with clear visual hierarchy, persuasive copy structure, and prominent calls to action.",
        es: "Una página de alto impacto diseñada para el lanzamiento de un producto, oferta de temporada, campaña o evento, con una jerarquía visual clara y llamados a la acción efectivos.",
      },
      highlights: [
        { en: "Conversion rate focused structure", es: "Estructura enfocada en ventas y contactos" },
        { en: "Fluid scroll motion & storytelling", es: "Narrativa visual con animaciones sutiles" },
        { en: "Fast loading for ad traffic", es: "Carga inmediata para tráfico de publicidad" },
      ],
    },
    {
      id: "website-restoration",
      num: "03",
      title: { en: "Website restoration", es: "Restauración de páginas" },
      desc: {
        en: "If your current website is slow, broken on mobile devices, or difficult for clients to use, I rebuild its core with modern technologies while preserving your existing domain and valuable brand equity.",
        es: "Si tu página actual es lenta, no se abre bien en el celular o es confusa para los clientes, la reconstruyo desde la base con código moderno manteniendo lo que ya funciona y tu dominio.",
      },
      highlights: [
        { en: "Rescue legacy HTML/CSS/WP sites", es: "Rescate de sitios antiguos o desatendidos" },
        { en: "Fix mobile formatting and bugs", es: "Corrección de errores y formato en teléfonos" },
        { en: "Dramatic speed and security boost", es: "Mejora radical de velocidad y estabilidad" },
      ],
    },
    {
      id: "updates-fixes",
      num: "04",
      title: { en: "Updates and fixes", es: "Cambios y arreglos" },
      desc: {
        en: "Ongoing support after your website is live: content and price updates, new gallery or contact sections, bug diagnosis, and continuous performance improvements.",
        es: "Soporte y mantenimiento continuo para páginas ya publicadas: actualización de textos y precios, nuevas secciones, solución de errores y optimizaciones periódicas.",
      },
      highlights: [
        { en: "Fast turnaround on small tasks", es: "Atención rápida para ajustes pequeños" },
        { en: "Form and link testing", es: "Verificación de formularios y enlaces" },
        { en: "No monthly lock-in contracts", es: "Sin contratos forzosos mensuales" },
      ],
    },
  ],

  marqueeScreenshots: [],
};

export const getWhatsAppUrl = (): string | null => {
  const number = content.whatsapp.replace(/\D/g, '');
  return /^\d{8,15}$/.test(number) ? `https://wa.me/${number}` : null;
};
