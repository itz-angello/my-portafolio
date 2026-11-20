import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const NotFoundPage: React.FC = () => {
  const { lang } = useLanguage();
  const title = lang === 'es' ? 'Página no encontrada' : 'Page Not Found';
  const sub = lang === 'es'
    ? 'Lo sentimos, la página que buscas no existe.'
    : "Sorry, the page you're looking for doesn't exist.";
  const home = lang === 'es' ? 'Ir al inicio' : 'Go home';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <h1
        className="text-8xl font-bold mb-4"
        style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-accent)' }}
      >
        404
      </h1>
      <h2
        className="text-2xl font-bold mb-4"
        style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
      >
        {title}
      </h2>
      <p className="mb-8 text-sm" style={{ color: 'var(--color-soft)' }}>
        {sub}
      </p>
      <a
        href="/"
        className="btn-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
      >
        {home}
      </a>
    </div>
  );
};
