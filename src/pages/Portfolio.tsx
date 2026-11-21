import React, { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { content } from '../content';

type ProjectRecord = (typeof content.projects)[number];
type ArchiveFilter = 'all' | 'personal' | 'client' | 'learning';

const FeaturedProjectBlock: React.FC<{
  project: ProjectRecord;
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
          <h2>{project.name[lang]}</h2>
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
            <strong>{project.name[lang]}</strong>
            <span>{portfolioT.captureComing}</span>
          </div>
        )}
      </div>
    </motion.article>
  );
};

const ArchiveProjectCard: React.FC<{
  project: ProjectRecord;
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

export const PortfolioPage: React.FC = () => {
  const { lang } = useLanguage();
  const portfolioT = content.texts[lang].portfolio;
  const [activeCategory, setActiveCategory] = useState<ArchiveFilter>('all');
  const featuredProjects = content.projects.filter((project) => project.featured).slice(0, 3);
  const archiveProjects = content.projects.filter((project) => !project.featured);
  const visibleArchiveProjects = archiveProjects.filter((project) => activeCategory === 'all' || project.category === activeCategory);
  const filters: ArchiveFilter[] = ['all', 'personal', 'client', 'learning'];

  return (
    <div className="site-container site-page">
      <h1 className="project-section-title">{portfolioT.heading}</h1>
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
            {filters.map((category) => (
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
            {visibleArchiveProjects.map((project, index) => <ArchiveProjectCard key={project.slug} project={project} index={index + 1} portfolioT={portfolioT} />)}
          </AnimatePresence>
          {visibleArchiveProjects.length === 0 && <p className="project-archive-empty">{portfolioT.archiveEmpty}</p>}
        </div>
      </section>
    </div>
  );
};
