import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { content } from '../content';
import { ArrowDownRight, ArrowUpRight, Code2, Sparkles } from 'lucide-react';
import { EmberCanvas } from '../components/EmberCanvas';

export const HomePage: React.FC = () => {
  const { lang } = useLanguage();
  const { hero, home } = content.texts[lang];
  const reduceMotion = useReducedMotion();
  const nameLetters = Array.from(content.name);

  return (
    <section className="forge-hero relative flex min-h-[calc(100svh-5rem)] items-center overflow-hidden px-5 py-14 sm:px-8 lg:px-12" aria-labelledby="home-title">
      <EmberCanvas />
      <div className="forge-vignette" aria-hidden="true" />
      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[1.08fr_.92fr] lg:gap-10">
        <div className="relative">
          <motion.p initial={reduceMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.12 }} className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-[var(--color-accent)]/30 bg-[var(--color-bg)]/85 px-4 py-2 text-xs font-semibold tracking-wide text-[var(--color-soft)] shadow-lg shadow-black/20 sm:text-sm">
            <span className="forge-status-dot" aria-hidden="true" />{hero.badge}
          </motion.p>

          <h1 id="home-title" aria-label={`${hero.headingLead} ${content.name}`} className="font-extrabold leading-[.78] tracking-[-.075em] text-[var(--color-text)]" style={{ fontFamily: 'var(--font-heading)' }}>
            <span className="block overflow-hidden pb-2 text-[clamp(2.5rem,6vw,5rem)] text-[var(--color-soft)]">
              {Array.from(hero.headingLead).map((letter, index) => <motion.span key={`${letter}-${index}`} aria-hidden="true" initial={reduceMotion ? false : { opacity: 0, y: '110%' }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.52, delay: reduceMotion ? 0 : 0.18 + index * 0.055, ease: [0.2, 0.8, 0.2, 1] }} className="inline-block">{letter === ' ' ? '\u00a0' : letter}</motion.span>)}
            </span>
            <span className="forge-name block whitespace-nowrap overflow-hidden pb-3 text-[clamp(4.5rem,12vw,10rem)] text-[var(--color-text)]">
              {nameLetters.map((letter, index) => <motion.span key={`${letter}-${index}`} aria-hidden="true" initial={reduceMotion ? false : { opacity: 0, y: '115%', rotateX: -35 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ duration: 0.7, delay: reduceMotion ? 0 : 0.34 + index * 0.075, ease: [0.16, 1, 0.3, 1] }} className="inline-block">{letter}</motion.span>)}
            </span>
          </h1>

          <motion.p initial={reduceMotion ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.72 }} className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--color-soft)] sm:mt-7 sm:text-lg lg:text-xl">
            {hero.tagline}
          </motion.p>

          <div className="woven-divider my-6 max-w-md sm:my-7" aria-hidden="true"><span /></div>

          <motion.div initial={reduceMotion ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.85 }} className="flex flex-col gap-3 sm:flex-row">
            <a href="/contact/" className="btn-primary min-h-12 gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]">{hero.cta}<ArrowUpRight size={17} aria-hidden="true" /></a>
            <a href="/portfolio/" className="btn-outline min-h-12 gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]">{home.viewProjects}<ArrowDownRight size={17} aria-hidden="true" /></a>
          </motion.div>

          <p className="mt-6 flex flex-wrap items-center gap-2 font-mono text-[10px] text-[var(--color-muted)] sm:mt-7 sm:text-xs"><Code2 size={15} aria-hidden="true" />{home.roles.join(' · ')}</p>
        </div>

        <motion.div initial={reduceMotion ? false : { opacity: 0, scale: 0.92, x: 18 }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.28, ease: [0.16, 1, 0.3, 1] }} className="forge-art relative mx-auto grid aspect-square w-full max-w-[27rem] place-items-center lg:ml-auto" aria-label={hero.visualCaption}>
          <div className="forge-orbit forge-orbit-one" aria-hidden="true" />
          <div className="forge-orbit forge-orbit-two" aria-hidden="true" />
          {content.projects[0]?.image
            ? <img className="forge-sun project-hero-capture" src={content.projects[0].image} alt={`${content.projects[0].name[lang]} — ${lang === 'es' ? 'captura del proyecto' : 'project screenshot'}`} loading="lazy" />
            : <div className="forge-sun" aria-hidden="true"><span>AC</span></div>}
          <Sparkles className="forge-spark forge-spark-one" size={22} aria-hidden="true" />
          <Sparkles className="forge-spark forge-spark-two" size={15} aria-hidden="true" />
          <span className="forge-art-caption">{hero.visualLabel}</span>
          <span className="forge-art-foot">{hero.visualCaption}</span>
        </motion.div>
      </div>
    </section>
  );
};
