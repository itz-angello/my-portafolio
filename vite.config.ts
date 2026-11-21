import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';
import { mkdir, copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { projects } from './src/content/projects.ts';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const fixedRoutes: Record<string, string> = {
  '/about': '/src/entries/about.html',
  '/about/': '/src/entries/about.html',
  '/contact': '/src/entries/contact.html',
  '/contact/': '/src/entries/contact.html',
  '/portfolio': '/src/entries/portfolio.html',
  '/portfolio/': '/src/entries/portfolio.html',
  '/skills': '/src/entries/skills.html',
  '/skills/': '/src/entries/skills.html',
  '/certificates': '/src/entries/certificates.html',
  '/certificates/': '/src/entries/certificates.html',
};

const outputCopies: Array<[string, string]> = [
  ['src/entries/about.html', 'about/index.html'],
  ['src/entries/contact.html', 'contact/index.html'],
  ['src/entries/portfolio.html', 'portfolio/index.html'],
  ['src/entries/skills.html', 'skills/index.html'],
  ['src/entries/certificates.html', 'certificates/index.html'],
  ['src/entries/404.html', '404.html'],
  ...projects.map((project) => ['src/entries/project.html', `portfolio/${project.slug}/index.html`] as [string, string]),
];

function routePages() {
  return {
    name: 'portfolio-public-routes',
    configureServer(server: { middlewares: { use: (handler: (req: any, res: any, next: () => void) => void) => void } }) {
      server.middlewares.use((req, _res, next) => {
        if (req.method !== 'GET' && req.method !== 'HEAD') return next();
        const [pathname, query = ''] = (req.url ?? '/').split('?');
        if (pathname.startsWith('/@') || pathname.startsWith('/node_modules/') || /\.[a-z\d]+$/i.test(pathname)) return next();
        let entry = fixedRoutes[pathname];

        if (!entry && pathname === '/') return next();

        const projectMatch = pathname.match(/^\/portfolio\/([^/]+)\/?$/);
        if (projectMatch) {
          const slug = decodeURIComponent(projectMatch[1]);
          entry = projects.some((project) => project.slug === slug)
            ? '/src/entries/project.html'
            : '/src/entries/404.html';
        } else if (!entry && pathname !== '/' && !pathname.startsWith('/src/') && !pathname.startsWith('/assets/')) {
          entry = '/src/entries/404.html';
        }

        if (entry) req.url = `${entry}${query ? `?${query}` : ''}`;
        next();
      });
    },
    apply: 'serve' as const,
  };
}

function copyPublicRoutes() {
  return {
    name: 'copy-portfolio-public-routes',
    apply: 'build' as const,
    async writeBundle(options: { dir?: string }) {
      const outputDir = path.resolve(projectRoot, options.dir || 'dist');
      await Promise.all(outputCopies.map(async ([source, destination]) => {
        const target = path.resolve(outputDir, destination);
        await mkdir(path.dirname(target), { recursive: true });
        await copyFile(path.resolve(outputDir, source), target);
      }));
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), routePages(), copyPublicRoutes()],
  base: '/',
  build: {
    rollupOptions: {
      input: {
        home: path.resolve(projectRoot, 'index.html'),
        about: path.resolve(projectRoot, 'src/entries/about.html'),
        portfolio: path.resolve(projectRoot, 'src/entries/portfolio.html'),
        skills: path.resolve(projectRoot, 'src/entries/skills.html'),
        certificates: path.resolve(projectRoot, 'src/entries/certificates.html'),
        contact: path.resolve(projectRoot, 'src/entries/contact.html'),
        project: path.resolve(projectRoot, 'src/entries/project.html'),
        '404': path.resolve(projectRoot, 'src/entries/404.html'),
      },
    },
  },
  server: { port: 5173, host: true },
  preview: { port: 4173, host: true },
});
