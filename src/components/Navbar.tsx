import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { content } from '../content';

type Page = 'home' | 'about' | 'portfolio' | 'contact';

interface NavbarProps {
  currentPage: Page;
}

interface NavItem {
  id: Page;
  labelKey: keyof (typeof content.texts)['en']['nav'];
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', labelKey: 'home', href: '/' },
  { id: 'about', labelKey: 'about', href: '/about/' },
  { id: 'portfolio', labelKey: 'portfolio', href: '/portfolio/' },
  { id: 'contact', labelKey: 'contact', href: '/contact/' },
];

function isActive(itemHref: string, currentPage: Page): boolean {
  if (currentPage === 'home') return itemHref === '/';
  if (currentPage === 'about') return itemHref === '/about/';
  if (currentPage === 'portfolio') return itemHref === '/portfolio/';
  if (currentPage === 'contact') return itemHref === '/contact/';
  return false;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage }) => {
  const { lang, toggleLang, t } = useLanguage();

  const handleToggle = () => {
    const newLang = lang === 'en' ? 'es' : 'en';
    toggleLang();
    if (typeof window !== 'undefined' && typeof (window as unknown as { __updateMeta?: (l: string) => void }).__updateMeta === 'function') {
      (window as unknown as { __updateMeta: (l: string) => void }).__updateMeta(newLang);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4 pointer-events-none">
      <nav
        className="pointer-events-auto flex items-center gap-0.5 px-1.5 py-2 rounded-full sm:gap-1 sm:px-2"
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-surface-2)',
          maxWidth: '600px',
          width: '100%',
        }}
        aria-label="Main navigation"
      >
        {/* Logo — hidden on mobile */}
        <a
          href="/"
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full font-heading text-xs font-bold tracking-[0.08em] sm:mr-1 sm:h-9 sm:w-9 sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
          style={{ background: 'var(--color-accent)', color: 'var(--color-ink)' }}
          aria-label="Angel Chacón — Home"
        >
          AC
        </a>

        {/* Nav links */}
        <div className="flex min-w-0 flex-1 items-center justify-center gap-0.5 sm:justify-start sm:gap-1">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href, currentPage);
            const label = t.nav[item.labelKey];
            return (
              <a
                key={item.id}
                href={item.href}
                className="whitespace-nowrap rounded-full px-2 py-1.5 text-[0.7rem] font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] sm:px-3 sm:text-sm"
                style={
                  active
                    ? { background: 'var(--color-text)', color: 'var(--color-ink)' }
                    : { color: 'var(--color-soft)' }
                }
                aria-current={active ? 'page' : undefined}
              >
                {label}
              </a>
            );
          })}
        </div>

        {/* Language toggle */}
        <button
          onClick={handleToggle}
          className="ml-0.5 shrink-0 rounded-full px-2 py-1.5 text-xs font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] sm:ml-1 sm:px-3 sm:text-sm"
          style={{
            border: '1px solid var(--color-muted)',
            color: 'var(--color-soft)',
          }}
          aria-label={`Switch to ${lang === 'en' ? 'Spanish' : 'English'}`}
        >
          {lang === 'en' ? 'ES' : 'EN'}
        </button>
      </nav>
    </header>
  );
};
