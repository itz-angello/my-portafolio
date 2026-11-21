import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { content } from '../content';

type Page = 'home' | 'about' | 'portfolio' | 'skills' | 'certificates' | 'contact';

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
  { id: 'skills', labelKey: 'skills', href: '/skills/' },
  { id: 'certificates', labelKey: 'certificates', href: '/certificates/' },
  { id: 'contact', labelKey: 'contact', href: '/contact/' },
];

function isActive(itemHref: string, currentPage: Page): boolean {
  if (currentPage === 'home') return itemHref === '/';
  if (currentPage === 'about') return itemHref === '/about/';
  if (currentPage === 'portfolio') return itemHref === '/portfolio/';
  if (currentPage === 'skills') return itemHref === '/skills/';
  if (currentPage === 'certificates') return itemHref === '/certificates/';
  if (currentPage === 'contact') return itemHref === '/contact/';
  return false;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage }) => {
  const { lang, toggleLang, t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);

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
        className="pointer-events-auto relative flex w-full items-center gap-1 rounded-full px-2 py-2 sm:gap-1 sm:px-2"
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-surface-2)',
          maxWidth: '1040px',
          width: '100%',
        }}
        aria-label={t.nav.label}
      >
        {/* Logo */}
        <a
          href="/"
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full font-heading text-xs font-bold tracking-[0.08em] sm:mr-1 sm:h-9 sm:w-9 sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
          style={{ background: 'var(--color-accent)', color: 'var(--color-ink)' }}
          aria-label="AC — Angel Chacón — Home"
        >
          AC
        </a>

        {/* Nav links */}
        <div className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 sm:flex sm:justify-start sm:gap-1">
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
          className="ml-auto shrink-0 rounded-full px-2 py-1.5 text-xs font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] sm:ml-1 sm:px-3 sm:text-sm"
          style={{
            border: '1px solid var(--color-muted)',
            color: 'var(--color-soft)',
          }}
          aria-label={`${lang === 'en' ? 'ES' : 'EN'} — Switch to ${lang === 'en' ? 'Spanish' : 'English'}`}
        >
          {lang === 'en' ? 'ES' : 'EN'}
        </button>

        <div className="flex items-center gap-1 sm:hidden">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
            aria-label={menuOpen ? (lang === 'es' ? 'Cerrar menú' : 'Close menu') : (lang === 'es' ? 'Abrir menú' : 'Open menu')}
            aria-expanded={menuOpen}
            aria-controls="mobile-primary-menu"
          >
            {menuOpen ? <X size={19} aria-hidden="true" /> : <Menu size={19} aria-hidden="true" />}
          </button>
        </div>

        {menuOpen && (
          <div id="mobile-primary-menu" className="absolute left-0 right-0 top-full mt-2 grid grid-cols-2 gap-1 rounded-2xl p-2 shadow-2xl sm:hidden" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-surface-2)' }}>
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href, currentPage);
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl px-3 py-3 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
                  style={active ? { background: 'var(--color-text)', color: 'var(--color-ink)' } : { color: 'var(--color-soft)' }}
                  aria-current={active ? 'page' : undefined}
                >
                  {t.nav[item.labelKey]}
                </a>
              );
            })}
          </div>
        )}
      </nav>
    </header>
  );
};
