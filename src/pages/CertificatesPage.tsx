import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { certificates } from '../content/certificates';
import { useLanguage } from '../context/LanguageContext';

export const CertificatesPage: React.FC = () => {
  const { lang, t } = useLanguage();

  return (
    <>
      <section className="site-container site-page" aria-labelledby="certificates-heading">
        <h1 id="certificates-heading" className="font-heading text-4xl font-bold text-[var(--color-text)] sm:text-6xl">{t.certificates.heading}</h1>
        {certificates.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-[var(--color-muted)]/40 bg-[var(--color-surface)] px-6 py-14 text-center text-lg text-[var(--color-muted)]">
            {t.certificates.empty}
          </div>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {certificates.map((certificate) => (
              <article key={certificate.id} className="overflow-hidden rounded-2xl border border-[var(--color-surface-2)] bg-[var(--color-surface)]">
                {certificate.image && <img src={certificate.image} alt={`${certificate.title[lang]} — ${lang === 'es' ? 'certificado' : 'certificate'}`} loading="lazy" className="aspect-[4/3] w-full object-cover" />}
                <div className="p-5">
                  <h2 className="font-heading text-xl font-bold text-[var(--color-text)]">{certificate.title[lang]}</h2>
                  <p className="mt-2 text-sm text-[var(--color-soft)]">{certificate.institution[lang]}</p>
                  <p className="mt-1 text-xs text-[var(--color-muted)]">{certificate.date[lang]}</p>
                  {certificate.verificationUrl && <a href={certificate.verificationUrl} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-accent)]">{t.certificates.verify}<ArrowUpRight size={15} aria-hidden="true" /></a>}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
};
