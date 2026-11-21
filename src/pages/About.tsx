import React from 'react';
import { animate, motion, useInView, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion';
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

interface AboutIntroCopy {
  initialWord: string;
  phrase: string;
  words: { text: string; x: number; y: number; size: number; angle: number; depth: number; tone: 'ember' | 'slate'; tech?: boolean }[];
}

const GLITCH_GLYPHS = '01#<>/;{}';

const useDecodedText = (text: string, active: boolean, delay = 0, duration = 520) => {
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!active || !textRef.current) return;
    let frameId = 0;
    let startTime = 0;
    let lastUpdate = 0;
    const frame = (now: number) => {
      if (!startTime) startTime = now + delay;
      if (now < startTime) {
        frameId = requestAnimationFrame(frame);
        return;
      }
      const progress = Math.min(1, (now - startTime) / duration);
      const characters = Array.from(text);
      const resolved = Math.floor(progress * characters.length);
      const output = characters.map((character, index) => {
        if (index < resolved || character === ' ') return character;
        return GLITCH_GLYPHS[Math.floor(Math.random() * GLITCH_GLYPHS.length)];
      }).join('');
      if (now - lastUpdate >= 42 || progress === 1) {
        if (textRef.current) textRef.current.textContent = progress === 1 ? text : output;
        lastUpdate = now;
      }
      if (progress < 1) frameId = requestAnimationFrame(frame);
    };
    frameId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(frameId);
  }, [active, delay, duration, text]);

  return textRef;
};

const BlinkingCaret: React.FC = () => <span className="about-intro-caret" aria-hidden="true" />;

const ScrollingEmber: React.FC<{
  word: AboutIntroCopy['words'][number];
  index: number;
  progress: MotionValue<number>;
}> = ({ word, index, progress }) => {
  const x = useTransform(progress, [0.2, 0.6], [`${50 - word.x}vw`, '0vw']);
  const y = useTransform(progress, [0.2, 0.6], [`${50 - word.y}vh`, '0vh']);
  const opacity = useTransform(progress, [0, 0.2, 0.3, 0.54, 0.58, 0.61, 0.64, 0.68, 0.84, 1], [0, 0, 0.35 + word.depth * 0.65, 0.42 + word.depth * 0.58, 0.9, 0.48, 0.85, 0, 0, 0]);
  const scale = useTransform(progress, [0.2, 0.6, 0.84], [0.35, 1, 1]);
  const angle = Math.max(-4, Math.min(4, word.angle));
  const rotate = useTransform(progress, [0.2, 0.6], [-angle * 0.7, angle]);
  const blur = useTransform(progress, [0.64, 0.68, 0.70], [0, 8, 12 + (1 - word.depth) * 3]);
  const filter = useTransform(blur, (value) => `blur(${value}px)`);
  const glitchX = useTransform(progress, [0.58, 0.6, 0.62, 0.64, 0.66], ['0px', '1px', '-2px', '1px', '0px']);
  const glitchOpacity = useTransform(progress, [0.58, 0.6, 0.62, 0.64, 0.66], [1, 0.55, 0.95, 0.5, 1]);
  const [isDecoding, setIsDecoding] = React.useState(() => progress.get() >= 0.28 && progress.get() <= 0.62);
  useMotionValueEvent(progress, 'change', (value) => {
    const next = value >= 0.28 && value <= 0.62;
    setIsDecoding((current) => current === next ? current : next);
  });
  const decodedRef = useDecodedText(word.tech ? `<${word.text}>` : word.text, isDecoding, index * 7, 420 + (index % 5) * 55);

  return (
    <motion.span
      className={`about-intro-word about-intro-${word.tone}`}
      style={{ x, y, opacity, scale, rotate, filter, fontSize: `clamp(calc(.72rem * ${word.size}), calc(1.5vw * ${word.size}), calc(1.35rem * ${word.size}))`, fontWeight: word.size > 1.08 ? 600 : word.size < 0.9 ? 400 : 500 }}
    >
      <motion.span className="about-intro-decoded" style={{ x: glitchX, opacity: glitchOpacity }}><span ref={decodedRef} /></motion.span>
    </motion.span>
  );
};

const AnimatedAboutIntro: React.FC<{ intro: AboutIntroCopy }> = ({ intro }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const initialOpacity = useTransform(scrollYProgress, [0, 0.18, 0.28, 0.38], [1, 1, 0.7, 0]);
  const phraseOpacity = useTransform(scrollYProgress, [0.68, 0.73, 0.88, 0.97, 1], [0, 1, 1, 0.8, 0.25]);
  const [isPhraseActive, setIsPhraseActive] = React.useState(() => scrollYProgress.get() >= 0.69);
  useMotionValueEvent(scrollYProgress, 'change', (value) => setIsPhraseActive(value >= 0.69));
  const decodedPhraseRef = useDecodedText(intro.phrase, isPhraseActive, 0, 640);
  const initialWordRef = useDecodedText(intro.initialWord, true, 0, 560);

  return (
    <section ref={sectionRef} className="about-intro-scroll" aria-label={intro.phrase}>
      <div className="about-intro-sticky">
        <motion.h1
          className="about-intro-first"
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '17%',
            left: '8%',
            right: 'auto',
            bottom: 'auto',
            width: 'max-content',
            maxWidth: '84vw',
            margin: 0,
            fontSize: 'clamp(1.75rem, 4.5vw, 3.5rem)',
            textAlign: 'left',
            transformOrigin: 'left center',
            opacity: initialOpacity,
            rotate: -4,
          }}
        >
          <span ref={initialWordRef} /><BlinkingCaret />
        </motion.h1>
        <div className="about-intro-embers" aria-hidden="true">
          {intro.words.map((word, index) => (
            <span key={`${word.text}-${index}`} className="about-intro-word-position" style={{ left: `${word.x}%`, top: `${word.y}%` }}>
              <ScrollingEmber word={word} index={index} progress={scrollYProgress} />
            </span>
          ))}
        </div>
        <motion.p className="about-intro-phrase" aria-hidden="true" style={{ opacity: phraseOpacity }}>
          <span className="about-intro-prompt">&gt;</span> <span ref={decodedPhraseRef} /><BlinkingCaret />
        </motion.p>
        <span className="sr-only">{intro.phrase}</span>
      </div>
    </section>
  );
};

const StaticAboutIntro: React.FC<{ intro: AboutIntroCopy }> = ({ intro }) => (
  <section className="about-intro-static" aria-labelledby="about-intro-static-title">
    <h1 id="about-intro-static-title">{intro.phrase}</h1>
    <ul>{intro.words.map((word, index) => <li className={`about-intro-static-${word.tone}`} key={`${word.text}-${index}`}>{word.tech ? `<${word.text}>` : word.text}</li>)}</ul>
  </section>
);

const AboutScrollIntro: React.FC<{ intro: AboutIntroCopy }> = ({ intro }) => {
  const reduceMotion = useReducedMotion();
  return reduceMotion ? <StaticAboutIntro intro={intro} /> : <AnimatedAboutIntro intro={intro} />;
};

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
      <AboutScrollIntro intro={aboutT.intro} />
      <article className="about-profile site-container site-page">
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
