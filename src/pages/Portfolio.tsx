import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { content } from '../content';
import { ArrowUpRight } from 'lucide-react';
import { Skills } from '../components/Skills';
import { projectLabels } from '../content/projects';

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
    <div
      className="corner-bracket p-6 rounded-xl cursor-pointer transition-colors duration-200"
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-surface-2)',
      }}
      onClick={() => setExpanded((v) => !v)}
      role="button"
      aria-expanded={expanded}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setExpanded((v) => !v); }}
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
    </div>
  );
};

// ---- Project Card ----
interface ProjectCardProps {
  project: typeof content.projects[0];
  index: number;
  detailsLabel: string;
  techLabel: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, detailsLabel, techLabel }) => {
  const { lang } = useLanguage();
  const reduceMotion = useReducedMotion();
  const tiltX = useSpring(useMotionValue(0), { stiffness: 180, damping: 20, mass: 0.6 });
  const tiltY = useSpring(useMotionValue(0), { stiffness: 180, damping: 20, mass: 0.6 });

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (reduceMotion || event.pointerType !== 'mouse') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    tiltX.set(-y * 7);
    tiltY.set(x * 9);
  };

  const resetTilt = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  return (
    <motion.article
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      style={{
        rotateX: reduceMotion ? 0 : tiltX,
        rotateY: reduceMotion ? 0 : tiltY,
        transformPerspective: 1100,
        transformStyle: 'preserve-3d',
      }}
      whileHover={reduceMotion ? undefined : { y: -5 }}
      transition={{ type: 'spring', stiffness: 220, damping: 22 }}
      className="project-card group relative overflow-hidden rounded-3xl"
    >
      <div className="flex h-full flex-col">
        <a href={`/portfolio/${project.slug}/`} className="flex flex-1 flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]" aria-label={`${project.name[lang]} — ${detailsLabel}`}>
        {project.screenshot && <div className="project-card-image relative aspect-[16/10] overflow-hidden">
          <img src={project.screenshot} alt={`${project.name[lang]} — ${lang === 'es' ? 'captura del proyecto' : 'project screenshot'}`} loading="lazy" width={800} height={500} className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]" />
          <div className="project-card-image-shade" />
          <span className="project-card-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
        </div>}
        <div className="project-card-body">
          <div className="mb-2 flex items-start justify-between gap-3">
            <h3 className="project-card-title">{project.name[lang]}</h3>
            <ArrowUpRight className="mt-1 shrink-0 text-[var(--color-accent)] transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" size={20} aria-hidden="true" />
          </div>
          <p className="project-card-description">{project.shortDescription[lang]}</p>
          <div className="project-card-tags" aria-label={techLabel}>
            {project.technologies.map((tag) => <span key={tag}>{tag}</span>)}
          </div>
          <span className="project-card-link">{detailsLabel}</span>
        </div>
        </a>
        {project.url && <a href={project.url} target="_blank" rel="noopener noreferrer" className="service-package-cta mx-5 mb-5">{projectLabels[lang].visitSite}<ArrowUpRight size={16} aria-hidden="true" /></a>}
        {project.repository && <a href={project.repository} target="_blank" rel="noopener noreferrer" className="service-package-cta mx-5 mb-5">{projectLabels[lang].repository}<ArrowUpRight size={16} aria-hidden="true" /></a>}
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
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

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
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {content.projects.length > 0 ? (
                <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
                  {content.projects.map((project, index) => (
                    <motion.div key={project.slug} initial={reduceMotion ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.16 }} transition={{ duration: 0.55, delay: reduceMotion ? 0 : index * 0.09, ease: [0.2, 0.7, 0.2, 1] }}>
                      <ProjectCard project={project} index={index} detailsLabel={portfolioT.detailsLink} techLabel={content.texts[lang].projectCase.tech} />
                    </motion.div>
                  ))}
                </div>
              ) : null}
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
                    <div
                      key={cert.id}
                      className="card rounded-2xl p-5 cursor-pointer hover:-translate-y-1 transition-transform duration-200"
                      style={{
                        background: 'var(--color-surface-2)',
                        border: '1px solid var(--color-surface-2)',
                      }}
                      onClick={() => setLightboxIndex(i)}
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === 'Enter') setLightboxIndex(i); }}
                      role="button"
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
                    </div>
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
