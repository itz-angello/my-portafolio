import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { content } from '../content';
import { ArrowUpRight } from 'lucide-react';
import { Skills } from '../components/Skills';

// ---- Curtain Transition ----
const CurtainTransition: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (prefersReducedMotion) {
      setShow(false);
      return;
    }
    // Skip if navigating from within portfolio
    const ref = document.referrer;
    if (ref && new URL(ref, location.href).pathname.startsWith('/portfolio')) {
      setShow(false);
      return;
    }
    const t = setTimeout(() => setShow(false), 1100);
    return () => clearTimeout(t);
  }, [prefersReducedMotion]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="curtain"
          className="fixed inset-0 z-[9990] flex items-center justify-center"
          style={{ background: 'var(--color-accent)' }}
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
        >
          <span
            className="text-6xl font-bold"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-ink)' }}
          >
            Work
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ---- What I Do Cards ----
interface WhatIDoCardProps {
  title: string;
  tags: string[];
}

const WhatIDoCard: React.FC<WhatIDoCardProps> = ({ title, tags }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <button
      type="button"
      className="corner-bracket w-full rounded-xl p-6 text-left transition-colors duration-200"
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-surface-2)',
      }}
      onClick={() => setExpanded((v) => !v)}
      aria-expanded={expanded}
    >
      <h3
        className="text-xl font-bold mb-3"
        style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
      >
        {title}
      </h3>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    background: 'var(--color-surface-2)',
                    color: 'var(--color-soft)',
                    border: '1px solid var(--color-muted)',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {!expanded && (
        <div className="flex flex-wrap gap-2">
          {tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{
                background: 'var(--color-surface-2)',
                color: 'var(--color-soft)',
              }}
            >
              {tag}
            </span>
          ))}
          {tags.length > 3 && (
            <span className="text-xs" style={{ color: 'var(--color-muted)' }}>
              +{tags.length - 3} more
            </span>
          )}
        </div>
      )}
    </button>
  );
};

// Project cards are data-driven. Adding fields to the project catalog never
// changes the section layout.
const FeaturedProjectBlock: React.FC<{
  project: (typeof content.projects)[number];
  index: number;
  portfolioT: (typeof content.texts)['en']['portfolio'];
}> = ({ project, index, portfolioT }) => {
  const { lang } = useLanguage();
  const reduceMotion = useReducedMotion();
  const category = project.category ? portfolioT.categories[project.category] : null;

  return (
    <motion.article
      className={`featured-project${index % 2 === 1 ? ' is-reversed' : ''}`}
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: reduceMotion ? 0 : 0.58, ease: [0.2, 0.7, 0.2, 1] }}
    >
      <div className="featured-project-copy">
        <span className="featured-project-number">{String(index + 1).padStart(2, '0')}</span>
        <div className="featured-project-heading">
          <h3>{project.name[lang]}</h3>
          {category && <span className="featured-project-category">{category}</span>}
        </div>
        <p className="featured-project-short">{project.shortDescription[lang]}</p>
        {project.longDescription && <p className="featured-project-description">{project.longDescription[lang]}</p>}
        {(project.role || project.year) && (
          <dl className="featured-project-meta">
            {project.role && <div><dt>{portfolioT.role}</dt><dd>{project.role[lang]}</dd></div>}
            {project.year && <div><dt>{portfolioT.year}</dt><dd>{project.year}</dd></div>}
          </dl>
        )}
        <ul className="featured-project-tech" aria-label={content.texts[lang].projectCase.tech}>
          {project.technologies.map((technology) => <li key={technology}>{technology}</li>)}
        </ul>
        <div className="featured-project-links">
          <a className="btn-outline" href={`/portfolio/${project.slug}/`}>{portfolioT.detailsLink}<ArrowUpRight size={16} aria-hidden="true" /></a>
          {project.url && <a className="btn-primary" href={project.url} target="_blank" rel="noopener noreferrer">{portfolioT.visitSite}<ArrowUpRight size={16} aria-hidden="true" /></a>}
          {project.repo && <a className="btn-outline" href={project.repo} target="_blank" rel="noopener noreferrer">{portfolioT.repository}<ArrowUpRight size={16} aria-hidden="true" /></a>}
        </div>
      </div>
      <div className="featured-project-media">
        {project.image ? (
          <img src={project.image} alt={project.imageAlt?.[lang] ?? `${project.name[lang]} — ${portfolioT.previewLabel}`} loading="lazy" width={1200} height={760} />
        ) : (
          <div className="featured-project-placeholder">
            <span className="featured-project-placeholder-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            <strong>{project.name[lang]}</strong>
            <span>{portfolioT.captureComing}</span>
          </div>
        )}
      </div>
    </motion.article>
  );
};

const ArchiveProjectCard: React.FC<{
  project: (typeof content.projects)[number];
  index: number;
  portfolioT: (typeof content.texts)['en']['portfolio'];
}> = ({ project, index, portfolioT }) => {
  const { lang } = useLanguage();
  const reduceMotion = useReducedMotion();
  const category = project.category ? portfolioT.categories[project.category] : null;

  return (
    <motion.article className="archive-project-card" layout={!reduceMotion}>
      <span className="archive-project-number">{String(index + 1).padStart(2, '0')}</span>
      {category && <span className="archive-project-category">{category}</span>}
      <h3><a href={`/portfolio/${project.slug}/`}>{project.name[lang]}</a></h3>
      <p>{project.shortDescription[lang]}</p>
      <ul className="archive-project-tech" aria-label={content.texts[lang].projectCase.tech}>
        {project.technologies.map((technology) => <li key={technology}>{technology}</li>)}
      </ul>
      <div className="archive-project-links">
        <a href={`/portfolio/${project.slug}/`}>{portfolioT.detailsLink}<ArrowUpRight size={14} aria-hidden="true" /></a>
        {project.url && <a href={project.url} target="_blank" rel="noopener noreferrer">{portfolioT.visitSite}<ArrowUpRight size={14} aria-hidden="true" /></a>}
        {project.repo && <a href={project.repo} target="_blank" rel="noopener noreferrer">{portfolioT.repository}<ArrowUpRight size={14} aria-hidden="true" /></a>}
      </div>
    </motion.article>
  );
};

// ---- Certificate Lightbox ----
interface CertificateLightboxProps {
  certs: typeof content.certificates;
  initialIndex: number;
  onClose: () => void;
}

const CertificateLightbox: React.FC<CertificateLightboxProps> = ({ certs, initialIndex, onClose }) => {
  const [index, setIndex] = useState(initialIndex);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setIndex((i) => Math.min(i + 1, certs.length - 1));
      if (e.key === 'ArrowLeft') setIndex((i) => Math.max(i - 1, 0));
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [certs.length, onClose]);

  const cert = certs[index];

  return (
    <div
      className="fixed inset-0 z-[9000] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.9)' }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Certificate viewer"
    >
      <div
        className="max-w-3xl w-full rounded-2xl p-6"
        style={{ background: 'var(--color-surface)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {cert.image && (
          <img
            src={cert.image}
            alt={cert.name}
            loading="lazy"
            width={800}
            height={560}
            className="w-full rounded-xl mb-4 object-contain"
          />
        )}
        <h3
          className="text-lg font-bold"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
        >
          {cert.name}
        </h3>
        <p className="text-sm" style={{ color: 'var(--color-soft)' }}>
          {cert.issuer} · {cert.date}
        </p>
        <div className="flex justify-between mt-4">
          <button
            onClick={() => setIndex((i) => Math.max(i - 1, 0))}
            disabled={index === 0}
            className="btn-outline text-sm py-2 px-4 disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
          >
            ←
          </button>
          <button
            onClick={onClose}
            className="btn-outline text-sm py-2 px-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
          >
            Close
          </button>
          <button
            onClick={() => setIndex((i) => Math.min(i + 1, certs.length - 1))}
            disabled={index === certs.length - 1}
            className="btn-outline text-sm py-2 px-4 disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
};

// ---- Tabs ----
type Tab = 'projects' | 'certificates' | 'skills';

// ---- Main Portfolio Page ----
export const PortfolioPage: React.FC = () => {
  const { lang } = useLanguage();
  const reduceMotion = useReducedMotion();
  const portfolioT = content.texts[lang].portfolio;
  const [activeTab, setActiveTab] = useState<Tab>('projects');
  const [activeCategory, setActiveCategory] = useState<'all' | 'personal' | 'client' | 'learning'>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const featuredProjects = content.projects.filter((project) => project.featured).slice(0, 3);
  const archiveProjects = content.projects.filter((project) => !project.featured);
  const visibleArchiveProjects = archiveProjects.filter((project) => activeCategory === 'all' || project.category === activeCategory);

  const tabs: { id: Tab; label: string }[] = [
    { id: 'projects', label: portfolioT.tabs.projects },
    { id: 'certificates', label: portfolioT.tabs.certificates },
    { id: 'skills', label: portfolioT.tabs.skills },
  ];

  return (
    <>
      <CurtainTransition />

      <div className="max-w-6xl mx-auto px-6 pt-28 pb-24">
        {/* WHAT I DO heading */}
        <motion.div className="mb-16" initial={reduceMotion ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.55, ease: [0.2, 0.7, 0.2, 1] }}>
          <h2
            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
          >
            {portfolioT.whatIDo.split(' ').slice(0, -1).join(' ')}{' '}
            <span style={{ color: 'var(--color-accent)' }}>
              {portfolioT.whatIDo.split(' ').slice(-1)[0]}
            </span>
          </h2>

          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl">
            <WhatIDoCard
              title={portfolioT.developCard.title}
              tags={portfolioT.developCard.tags}
            />
            <WhatIDoCard
              title={portfolioT.restoreCard.title}
              tags={portfolioT.restoreCard.tags}
            />
          </div>
        </motion.div>

        {/* Portfolio Showcase */}
        <h2
          className="text-3xl font-bold mb-6"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
        >
          {portfolioT.heading}
        </h2>

        {/* Tabs */}
        <div
          className="mb-8 flex w-fit max-w-full gap-0.5 overflow-x-auto rounded-full p-1 sm:gap-1"
          style={{ background: 'var(--color-surface)' }}
          role="tablist"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative shrink-0 rounded-full px-2.5 py-2 text-xs font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] sm:px-5 sm:text-sm"
              style={{
                color: activeTab === tab.id ? 'var(--color-ink)' : 'var(--color-soft)',
                background: activeTab === tab.id ? 'var(--color-text)' : 'transparent',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          {activeTab === 'projects' && (
            <motion.div
              key="projects"
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
              transition={{ duration: reduceMotion ? 0 : 0.2 }}
            >
              <section className="featured-projects-section" aria-labelledby="featured-projects-heading">
                <h2 id="featured-projects-heading" className="project-section-title">{portfolioT.featuredHeading}</h2>
                <div className="featured-projects-list">
                  {featuredProjects.map((project, index) => <FeaturedProjectBlock key={project.slug} project={project} index={index} portfolioT={portfolioT} />)}
                </div>
              </section>

              <section className="project-archive-section" aria-labelledby="project-archive-heading">
                <header className="project-archive-header">
                  <div>
                    <h2 id="project-archive-heading" className="project-section-title">{portfolioT.archiveHeading}</h2>
                    <p className="project-archive-count" aria-live="polite">{portfolioT.archiveCount.replace('{count}', String(visibleArchiveProjects.length))}</p>
                  </div>
                  <div className="project-archive-filters" role="group" aria-label={portfolioT.archiveHeading}>
                    {(['all', 'personal', 'client', 'learning'] as const).map((category) => (
                      <button
                        type="button"
                        key={category}
                        className={`project-archive-filter${activeCategory === category ? ' is-active' : ''}`}
                        aria-pressed={activeCategory === category}
                        onClick={() => setActiveCategory(category)}
                      >
                        {portfolioT.categories[category]}
                      </button>
                    ))}
                  </div>
                </header>
                <div className="project-archive-grid" aria-live="polite">
                  <AnimatePresence mode="popLayout">
                    {visibleArchiveProjects.map((project, index) => (
                      <ArchiveProjectCard key={project.slug} project={project} index={index + 1} portfolioT={portfolioT} />
                    ))}
                  </AnimatePresence>
                  {visibleArchiveProjects.length === 0 && <p className="project-archive-empty">{portfolioT.archiveEmpty}</p>}
                </div>
              </section>
            </motion.div>
          )}

          {activeTab === 'certificates' && (
            <motion.div
              key="certificates"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* TODO: replace grid with 3D ring component */}
              {content.certificates.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {content.certificates.map((cert, i) => (
                    <button
                      type="button"
                      key={cert.id}
                      className="card rounded-2xl p-5 cursor-pointer hover:-translate-y-1 transition-transform duration-200"
                      style={{
                        background: 'var(--color-surface-2)',
                        border: '1px solid var(--color-surface-2)',
                      }}
                      onClick={() => setLightboxIndex(i)}
                      aria-label={`View ${cert.name} certificate`}
                    >
                      <h3
                        className="font-bold mb-1"
                        style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
                      >
                        {cert.name}
                      </h3>
                      <p className="text-sm" style={{ color: 'var(--color-soft)' }}>
                        {cert.issuer}
                      </p>
                      <p className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>
                        {cert.date}
                      </p>
                    </button>
                  ))}
                </div>
              ) : (
                <div
                  className="text-center py-16"
                  style={{ color: 'var(--color-muted)' }}
                >
                  Certificates coming soon.
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'skills' && (
            <motion.div
              key="skills"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Skills />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Certificate Lightbox */}
        {lightboxIndex !== null && content.certificates.length > 0 && (
          <CertificateLightbox
            certs={content.certificates}
            initialIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </div>
    </>
  );
};
