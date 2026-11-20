import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Check, PackageOpen } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { content, getWhatsAppUrl } from '../content';

export const Services: React.FC = () => {
  const { lang, t } = useLanguage();
  const reduceMotion = useReducedMotion();
  const whatsappUrl = getWhatsAppUrl();

  return (
    <section id="services" className="service-packages" aria-labelledby="services-title">
      <div className="service-packages-inner">
        <motion.header initial={reduceMotion ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5 }} className="service-packages-header">
          <span className="service-packages-stamp"><PackageOpen size={15} aria-hidden="true" />{t.services.badge}</span>
          <h2 id="services-title">{t.services.heading}</h2>
          <p>{t.services.subheading}</p>
        </motion.header>

        <div className="service-package-grid">
          {content.services.map((service, index) => (
            <motion.article key={service.id} initial={reduceMotion ? false : { opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.14 }} transition={{ duration: 0.5, delay: reduceMotion ? 0 : index * 0.07 }} className="service-package-card">
              <div className="service-package-topline"><span>{service.num}</span><PackageOpen size={18} aria-hidden="true" /></div>
              <h3>{service.title[lang]}</h3>
              <p className="service-package-description">{service.desc[lang]}</p>
              <ul>
                {service.highlights.map((highlight, highlightIndex) => <li key={`${service.id}-${highlightIndex}`}><Check size={15} aria-hidden="true" /><span>{highlight[lang]}</span></li>)}
              </ul>
              <a className="service-package-cta" href={whatsappUrl ?? '/contact/'} target={whatsappUrl ? '_blank' : undefined} rel={whatsappUrl ? 'noopener noreferrer' : undefined}>
                {t.services.quoteLabel}<ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </motion.article>
          ))}
        </div>

        <p className="service-packages-note">{t.services.ctaNote}</p>
      </div>
    </section>
  );
};
