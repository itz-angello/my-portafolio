import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

const EMBERS = Array.from({ length: 24 }, (_, index) => ({
  left: `${(index * 43 + 7) % 100}%`,
  delay: `${(index % 8) * -0.37}s`,
  duration: `${2.1 + (index % 5) * 0.42}s`,
  drift: `${((index * 19) % 70) - 35}px`,
  size: `${2 + (index % 3)}px`,
}));

export const Loader: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    try {
      if (sessionStorage.getItem('loader-shown')) return;
    } catch {
      // The entrance still works when storage is unavailable.
    }

    setVisible(true);
    const start = performance.now();
    const duration = 1200;
    let frame = 0;
    let exitTimer = 0;

    const tick = (now: number) => {
      const next = Math.min((now - start) / duration, 1);
      setProgress(Math.round(next * 100));
      if (next < 1) frame = requestAnimationFrame(tick);
      else {
        try {
          sessionStorage.setItem('loader-shown', '1');
        } catch {
          // The loader can still finish when storage is unavailable.
        }
        exitTimer = window.setTimeout(() => setVisible(false), 160);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(exitTimer);
    };
  }, [prefersReducedMotion]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="forge-loader"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.035, filter: 'blur(12px)' }}
          transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
          className="forge-loader fixed inset-0 z-[9999] grid place-items-center overflow-hidden"
          aria-hidden="true"
        >
          <div className="forge-loader-glow" style={{ opacity: 0.12 + progress / 150, transform: `scale(${0.55 + progress / 220})` }} />
          <div className="forge-loader-embers">
            {EMBERS.map((ember, index) => (
              <i key={index} style={{ left: ember.left, animationDelay: ember.delay, animationDuration: ember.duration, '--ember-drift': ember.drift, '--ember-size': ember.size } as React.CSSProperties} />
            ))}
          </div>
          <div className="forge-loader-core">
            <div className="forge-loader-ring" style={{ boxShadow: `0 0 ${12 + progress * 0.52}px color-mix(in srgb, var(--color-ember) ${Math.min(25 + progress, 95)}%, transparent)` }}>
              <span className="font-mono text-4xl font-semibold tabular-nums text-[var(--color-text)] sm:text-6xl">{progress}<small className="ml-1 text-base text-[var(--color-ember)] sm:text-xl">%</small></span>
            </div>
            <div className="mt-8 h-1 w-40 overflow-hidden rounded-full bg-white/10 sm:w-56">
              <motion.div className="h-full rounded-full bg-[var(--color-ember)]" style={{ width: `${progress}%`, boxShadow: '0 0 16px var(--color-ember)' }} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
