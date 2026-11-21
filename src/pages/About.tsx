import React from 'react';
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { Download, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { content } from '../content';
import { Services } from '../components/Services';

interface AnimatedStatProps {
  count: number;
  suffix?: string;
  label: string;
}

const AnimatedStat: React.FC<AnimatedStatProps> = ({ count, suffix = '', label }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.7 });
  const reduceMotion = useReducedMotion();
  const value = useMotionValue(0);
  const display = useTransform(value, (current) => `${Math.round(current)}${suffix}`);

  useEffect(() => {
    if (!inView) return;
    if (reduceMotion) {
      value.set(count);
      return;
    }
    const controls = animate(value, count, { duration: 1.15, ease: 'easeOut' });
    return controls.stop;
  }, [count, inView, reduceMotion, value]);

  return <div ref={ref} className="about-real-stat"><motion.strong>{display}</motion.strong><span>{label}</span></div>;
};

export const AboutPage: React.FC = () => {
  const { lang } = useLanguage();
  const reduceMotion = useReducedMotion();
  const aboutT = content.texts[lang].about;
  const enter = reduceMotion ? false : { opacity: 0, y: 18 };

  return (
    <>
      <article className="about-profile site-container pb-16 pt-24">
        <motion.header initial={enter} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.18 }} transition={{ duration: 0.55 }} className="about-profile-heading">
          <span className="about-profile-eyebrow"><Sparkles size={15} aria-hidden="true" />{aboutT.heading}</span>
          <h1>{content.name}</h1>
          <p>{aboutT.lead}</p>
        </motion.header>

        <div className="about-profile-grid">
          {content.photo && <motion.figure initial={enter} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.18 }} transition={{ duration: 0.6, delay: 0.06 }} className="about-photo-frame">
            <img src={content.photo} alt={aboutT.photoAlt} width={720} height={900} loading="lazy" />
            <figcaption>{aboutT.photoAlt}</figcaption>
          </motion.figure>}

          <motion.div initial={enter} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.18 }} transition={{ duration: 0.6, delay: 0.12 }} className="about-story">
            <span className="about-story-index">01 / {aboutT.heading}</span>
            <h2>{aboutT.bio}</h2>
            <p>{aboutT.scrubText}</p>
            <p className="about-story-subnote">{aboutT.subnote}</p>

            <div className="about-now-using">
              <span>{aboutT.nowUsingTitle}</span>
              <div>{aboutT.nowUsingTools.map((tool) => <span key={tool}>{tool}</span>)}</div>
            </div>

            {content.cv && <a href={content.cv} download className="btn-outline mt-7 inline-flex gap-2"><Download size={16} aria-hidden="true" />{aboutT.cvDownload}</a>}
          </motion.div>
        </div>

        {aboutT.stats.length > 0 && <div className="about-real-stats">{aboutT.stats.map((stat) => <AnimatedStat key={stat.label} count={stat.count} suffix={stat.suffix} label={stat.label} />)}</div>}
      </article>
      <Services />
    </>
  );
};
