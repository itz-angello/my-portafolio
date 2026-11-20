import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { content } from '../content';
import { Download } from 'lucide-react';

interface CharacterProps {
  char: string;
  progress: any;
  range: [number, number];
  reducedMotion: boolean | null;
}

const Character: React.FC<CharacterProps> = ({ char, progress, range, reducedMotion }) => {
  const opacity = useTransform(progress, range, [0.2, 1]);

  if (reducedMotion) {
    return <span className="opacity-100">{char}</span>;
  }

  return (
    <motion.span style={{ opacity }} className="transition-colors duration-75">
      {char}
    </motion.span>
  );
};

export const About: React.FC = () => {
  const { t } = useLanguage();
  const textRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Scroll tracking for character scrub reveal
  const { scrollYProgress } = useScroll({
    target: textRef,
    offset: ['start 85%', 'end 35%'],
  });

  const rawText = t.about.scrubText;
  const words = rawText.split(' ');
  const totalCharacters = rawText.length;

  let runningCharCount = 0;

  return (
    <section
      id="about"
      aria-label="About Angel"
      className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-6">
          <span className="w-8 h-0.5 bg-[#3DAA85]" />
          <h2 className="text-sm font-mono tracking-widest text-[#3DAA85] uppercase font-bold">
            {t.about.heading}
          </h2>
        </div>

        {/* Lead statement */}
        <p className="text-2xl sm:text-4xl font-heading tracking-tight uppercase text-[#E8EDE9] leading-snug mb-12 max-w-4xl">
          {t.about.lead}
        </p>

        {/* Character Opacity Scrub Reveal Paragraph */}
        <div
          ref={textRef}
          className="text-lg sm:text-2xl text-[#E8EDE9] leading-relaxed font-normal mb-12 tracking-wide"
        >
          {words.map((word, wordIdx) => {
            const wordChars = word.split('');
            return (
              <span key={`w-${wordIdx}`} className="inline-block whitespace-nowrap mr-[0.3em]">
                {wordChars.map((char, charIdx) => {
                  const charIndex = runningCharCount++;
                  const start = charIndex / totalCharacters;
                  const end = Math.min(1, start + 0.05);

                  return (
                    <Character
                      key={`c-${wordIdx}-${charIdx}`}
                      char={char}
                      progress={scrollYProgress}
                      range={[start, end]}
                      reducedMotion={shouldReduceMotion}
                    />
                  );
                })}
              </span>
            );
          })}
        </div>

        {/* Subnote */}
        <p className="text-base text-[#8A948E] mb-12 max-w-2xl leading-relaxed">
          {t.about.subnote}
        </p>

        {/* Key Stats Grid */}
        {t.about.stats.length > 0 && <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-8 border-t border-[#2A302D]">
          {t.about.stats.map((stat, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-[#151A18] border border-[#2A302D]"
            >
              <div className="text-2xl sm:text-3xl font-heading text-[#E8EDE9] tracking-tight">
                {stat.count}{stat.suffix ?? ''}
              </div>
              <div className="text-xs sm:text-sm text-[#8A948E] mt-1 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>}

        {/* Optional CV Download if configured */}
        {content.cv && (
          <div className="mt-8 flex justify-start">
            <a
              href={content.cv}
              download
              className="btn-outline inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold"
            >
              <Download className="w-4 h-4 text-[#3DAA85]" />
              <span>{t.about.cvDownload}</span>
            </a>
          </div>
        )}
      </motion.div>
    </section>
  );
};
