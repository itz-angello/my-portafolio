import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getWhatsAppUrl } from '../content';

interface FooterProps {
  githubUrl: string;
}

const FOOTER_ROUTES = [
  { key: 'home', href: '/' },
  { key: 'about', href: '/about/' },
  { key: 'portfolio', href: '/portfolio/' },
  { key: 'skills', href: '/skills/' },
  { key: 'certificates', href: '/certificates/' },
  { key: 'contact', href: '/contact/' },
] as const;

export const Footer: React.FC<FooterProps> = ({ githubUrl }) => {
  const { t } = useLanguage();
  const year = new Date().getFullYear();
  const whatsappUrl = getWhatsAppUrl();

  return (
    <footer className="site-footer">
      <div className="site-container">
        <div className="footer-columns">
          <nav aria-label={t.footer.journeyTitle}>
            <h2>{t.footer.journeyTitle}</h2>
            <ul>
              {FOOTER_ROUTES.map(({ key, href }) => (
                <li key={key}><a href={href}>{t.nav[key]}</a></li>
              ))}
            </ul>
          </nav>
          <div>
            <h2>{t.footer.contactTitle}</h2>
            <ul>
              {whatsappUrl && <li><a href={whatsappUrl} target="_blank" rel="noopener noreferrer">{t.footer.whatsappContact}<ArrowUpRight size={14} aria-hidden="true" /></a></li>}
              {githubUrl && <li><a href={githubUrl} target="_blank" rel="noopener noreferrer">{t.contact.githubButton}<ArrowUpRight size={14} aria-hidden="true" /></a></li>}
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="font-bold" style={{ color: 'var(--color-soft)', fontFamily: 'var(--font-heading)' }}>Angel Chacón</p>
          <p>{t.footer.location} · {year}</p>
          <p>{t.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
};
