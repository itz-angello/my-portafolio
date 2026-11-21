import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { content } from '../content';
import { projectLabels } from '../content/projects';
import { PageMetadata } from '../components/PageMetadata';

interface ProjectPageProps {
  slug: string;
}

const revealTransition = { duration: 0.58, ease: [0.2, 0.7, 0.2, 1] as const };

export const ProjectPage: React.FC<ProjectPageProps> = ({ slug }) => {
  const { lang } = useLanguage();
  const reduceMotion = useReducedMotion();
  const caseT = content.texts[lang].projectCase;
  const project = content.projects.find((item) => item.slug === slug);
  const enter = reduceMotion ? false : { opacity: 0, y: 22 };

  if (!project) {
    return (
      <>
        <PageMetadata page="notFound" />
        <div className="project-case-wrap flex min-h-[55vh] flex-col items-center justify-center px-6 text-center">
          <h1 className="font-heading mb-6 text-4xl font-bold text-[var(--color-text)]">{caseT.notFound}</h1>
          <a href="/portfolio/" className="btn-outline"><ArrowLeft size={16} aria-hidden="true" />{caseT.back}</a>
        </div>
      </>
    );
  }

  return (
    <>
    <PageMetadata page="project" project={project} />
    <article className="project-case-wrap site-container site-page">
      <motion.header initial={enter} animate={{ opacity: 1, y: 0 }} transition={revealTransition} className="mb-9 sm:mb-12">
        <a href="/portfolio/" className="project-case-back"><ArrowLeft size={16} aria-hidden="true" />{caseT.back}</a>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <span className="project-case-kind">{project.technologies[0]}</span>
          <span className="project-case-number">{project.slug.toUpperCase()}</span>
        </div>
        <h1 className="project-case-title mt-4">{project.name[lang]}</h1>
        <p className="project-case-intro mt-5">{project.longDescription?.[lang] ?? project.shortDescription[lang]}</p>
        <div className="mt-6 flex flex-wrap gap-2.5" aria-label={caseT.tech}>
          {project.technologies.map((tag) => <span key={tag} className="project-case-tag">{tag}</span>)}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          {project.url && <a href={project.url} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex gap-2">{projectLabels[lang].visitSite}<ArrowUpRight size={16} aria-hidden="true" /></a>}
          {project.repo && <a href={project.repo} target="_blank" rel="noopener noreferrer" className="btn-outline inline-flex gap-2">{projectLabels[lang].repository}<ArrowUpRight size={16} aria-hidden="true" /></a>}
        </div>
      </motion.header>

      {project.image && <motion.figure initial={enter} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.16 }} transition={revealTransition} className="project-case-cover">
        <img src={project.image} alt={`${project.name[lang]} — ${caseT.galleryAlt}`} width={1200} height={750} loading="lazy" />
        <figcaption>{caseT.gallery} · 01</figcaption>
      </motion.figure>}

      {(project.caseStudy?.problem || project.caseStudy?.solution) && <section className="project-case-copy-grid" aria-label={`${caseT.problem} / ${caseT.solution}`}>
        {project.caseStudy?.problem && <motion.section initial={enter} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={revealTransition} className="project-case-copy">
          <span className="project-case-eyebrow">01</span>
          <h2>{caseT.problem}</h2>
          <p>{project.caseStudy.problem[lang]}</p>
        </motion.section>}
        {project.caseStudy?.solution && <motion.section initial={enter} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ ...revealTransition, delay: 0.08 }} className="project-case-copy">
          <span className="project-case-eyebrow">02</span>
          <h2>{caseT.solution}</h2>
          <p>{project.caseStudy.solution[lang]}</p>
        </motion.section>}
      </section>}

      {project.caseStudy?.result && <motion.section initial={enter} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={revealTransition} className="project-case-copy project-case-result">
        <span className="project-case-eyebrow">03</span>
        <h2>{caseT.after}</h2>
        <p>{project.caseStudy.result[lang]}</p>
      </motion.section>}

    </article>
    </>
  );
};
