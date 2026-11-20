import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { content } from '../content';

export const Marquee: React.FC = () => {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Scroll-based parallax transform
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Opposite directional movement tied strictly to scroll position
  const x1 = useTransform(scrollYProgress, [0, 1], ['0%', '-25%']);
  const x2 = useTransform(scrollYProgress, [0, 1], ['-25%', '0%']);

  // Screenshots list
  const screens = content.marqueeScreenshots;
  const row1Screens = [...screens, ...screens];
  const row2Screens = [...screens.slice().reverse(), ...screens.slice().reverse()];

  return (
    <section
      ref={containerRef}
      aria-label="Work Previews Marquee"
      className="py-16 sm:py-24 overflow-hidden border-y border-[#2A302D] bg-[#0E1110] relative"
    >
      {/* Side flat feather masks */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-[#0E1110] to-transparent z-10 pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-[#0E1110] to-transparent z-10 pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-mono tracking-widest text-[#3DAA85] font-semibold">
            Showcase
          </span>
          <h2 className="text-xl sm:text-2xl font-heading tracking-tight uppercase text-[#E8EDE9] mt-1">
            {t.marqueeTitle}
          </h2>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap gap-2">
          {t.marqueePills.slice(0, 3).map((pill, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-full text-xs font-medium bg-[#151A18] border border-[#2A302D] text-[#8A948E]"
            >
              {pill}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Row 1: Slides Left on Scroll */}
        <div className="overflow-hidden flex">
          <motion.div
            style={
              shouldReduceMotion
                ? undefined
                : {
                    x: x1,
                    willChange: 'transform',
                  }
            }
            className="flex gap-4 sm:gap-6 shrink-0"
          >
            {row1Screens.map((item, idx) => (
              <div
                key={`row1-${idx}`}
                className="w-[280px] sm:w-[380px] h-[180px] sm:h-[230px] rounded-2xl bg-[#151A18] border-2 border-[#2A302D] overflow-hidden shrink-0 hover:border-[#3DAA85] transition-colors"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Row 2: Slides Right on Scroll */}
        <div className="overflow-hidden flex">
          <motion.div
            style={
              shouldReduceMotion
                ? undefined
                : {
                    x: x2,
                    willChange: 'transform',
                  }
            }
            className="flex gap-4 sm:gap-6 shrink-0"
          >
            {row2Screens.map((item, idx) => (
              <div
                key={`row2-${idx}`}
                className="w-[280px] sm:w-[380px] h-[180px] sm:h-[230px] rounded-2xl bg-[#151A18] border-2 border-[#2A302D] overflow-hidden shrink-0 hover:border-[#3DAA85] transition-colors"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
