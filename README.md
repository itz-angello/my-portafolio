# Portafolio de Angel Chacón

Portafolio bilingüe de **Angel Chacón, desarrollador web en Guatemala**. Presenta proyectos, servicios y formas de contacto en español e inglés.

## Tecnologías

React 19, TypeScript, Vite, Tailwind CSS 4, Framer Motion y Lucide React.

## Requisitos

- Node.js **22.12 o superior** (recomendado; cubre el requisito de Vite de Node 20.19+ o 22.12+ según sus [requisitos actuales](https://vite.dev/guide/)).
- npm, incluido con Node.js.

## Instalación y desarrollo

1. Clona el repositorio:

   ```bash
   git clone <URL-DEL-REPOSITORIO> angello-site
   ```

2. Entra en la carpeta e instala las dependencias:

   ```bash
   cd angello-site
   npm install
   ```

3. Inicia el servidor de desarrollo y abre la URL que indique la terminal (por defecto, `http://localhost:5173`):

   ```bash
   npm run dev
   ```

## Scripts

| Comando | Función |
| --- | --- |
| `npm run dev` | Inicia Vite para desarrollo local. |
| `npm run build` | Comprueba TypeScript y genera la versión de producción en `dist/`. |
| `npm run preview` | Sirve localmente la versión generada en `dist/`. Ejecuta primero `npm run build`. |

## Estructura

- `src/components/`: componentes compartidos de interfaz.
- `src/pages/`: páginas del sitio.
- `src/entries/`: entradas HTML y React para las rutas públicas.
- `src/content.ts`: textos ES/EN y contenido general.
- `src/content/projects.ts`: catálogo bilingüe de proyectos y datos de sus rutas.
- `src/content/certificates.ts`: catálogo bilingüe de certificados.
- `src/pages/SkillsPage.tsx` y `src/pages/CertificatesPage.tsx`: páginas propias de habilidades y certificados.
- `src/assets/`: imágenes y otros recursos del sitio.
- `public/`: archivos estáticos públicos, como el favicon.
- `dist/`: salida generada por el build; no se edita a mano.

Las rutas públicas incluyen `/`, `/about/`, `/portfolio/`, `/skills/`, `/certificates/` y `/contact/`. Vite también genera una ruta independiente para cada ficha `/portfolio/<slug>/`.

## Cambiar textos ES/EN

Edita `src/content.ts`. Los textos se organizan por idioma (`en` y `es`); por ejemplo:

```ts
texts: {
  en: { about: { heading: 'About' } },
  es: { about: { heading: 'Sobre mí' } },
  // ...resto del contenido
}
```

Los nombres y descripciones de proyectos se editan en `src/content/projects.ts`.

## Agregar un proyecto

Añade un objeto a `projects` en `src/content/projects.ts`. Los destacados se ordenan automáticamente y se muestran hasta tres. Los demás aparecen en el archivo con filtros por categoría. Los textos tienen versiones `en` y `es`; `category`, `role`, `year`, `image`, `imageAlt`, `url` y `repo` son opcionales. Usa una imagen importada desde `src/assets/` para que Vite la incluya en el build.

```ts
{
  slug: 'mi-proyecto', // crea /portfolio/mi-proyecto/
  name: { en: 'My project', es: 'Mi proyecto' },
  shortDescription: { en: 'Short summary.', es: 'Resumen breve.' },
  longDescription: { en: 'More detail.', es: 'Más detalles.' }, // opcional
  technologies: ['React', 'TypeScript'],
  featured: false,
  category: 'personal', // personal, client o learning
  role: { en: 'Frontend development', es: 'Desarrollo frontend' }, // opcional
  year: 2026, // opcional
  image: myProjectScreenshot, // opcional; importar desde src/assets/
  imageAlt: { en: 'Project dashboard', es: 'Panel del proyecto' }, // opcional
  url: 'https://example.com', // opcional; muestra “Ver sitio”
  repo: 'https://github.com/example/repo', // opcional; muestra “Ver repositorio”
}
```

Para añadir una captura, impórtala al inicio de `projects.ts`, por ejemplo `import myProjectScreenshot from '../assets/projects/mi-proyecto.webp';`, y asígnala a `image`. Sin captura, el destacado muestra un marco con el nombre y “Captura próximamente”. El archivo `projects.ts` incluye un ejemplo comentado. Las secciones, enlaces y fichas se generan desde el catálogo.

## Publicar

Ejecuta `npm run build` y publica el contenido de `dist/` en tu proveedor de hosting. Para revisar el resultado localmente, ejecuta `npm run preview`.
