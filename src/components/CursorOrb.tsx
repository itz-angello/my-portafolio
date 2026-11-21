import React, { useEffect, useRef, useState } from 'react';

export const CursorOrb: React.FC = () => {
  const orbRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -100, y: -100 });
  const targetRef = useRef({ x: -100, y: -100 });
  const scaleRef = useRef(1);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    // Hide on touch-only devices or reduced motion
    if (
      window.matchMedia('(hover: none)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    setHidden(false);

    let rafId: number | null = null;
    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
      schedule();
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      const overClosingPiece = Boolean(target.closest('[data-cursor-cross]'));
      orbRef.current?.classList.toggle('is-cross', overClosingPiece);
      scaleRef.current = overClosingPiece ? 1 : target.closest('a, button, .card') ? 2.5 : 1;
      schedule();
    };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const schedule = () => {
      if (rafId === null) rafId = requestAnimationFrame(animate);
    };
    const animate = () => {
      rafId = null;
      posRef.current.x = lerp(posRef.current.x, targetRef.current.x, 0.12);
      posRef.current.y = lerp(posRef.current.y, targetRef.current.y, 0.12);

      if (orbRef.current) {
        orbRef.current.style.transform = `translate(${posRef.current.x - 9}px, ${posRef.current.y - 9}px) scale(${scaleRef.current})`;
      }

      const dx = targetRef.current.x - posRef.current.x;
      const dy = targetRef.current.y - posRef.current.y;
      if (Math.abs(dx) > 0.25 || Math.abs(dy) > 0.25) schedule();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  if (hidden) return null;

  return (
    <div
      ref={orbRef}
      className="custom-cursor fixed top-0 left-0 w-[18px] h-[18px] rounded-full pointer-events-none z-[9998]"
      style={{
        background: 'var(--color-accent)',
        transform: 'translate(-100px, -100px)',
        transition: 'transform 0.08s ease, scale 0.2s ease',
        mixBlendMode: 'screen',
      }}
      aria-hidden="true"
    />
  );
};
