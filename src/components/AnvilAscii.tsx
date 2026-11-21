import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

const ANVIL_ART = [
  '                           _________',
  '                    ______/________/|',
  '                   /_______________/ |',
  '                                   | |',
  '                                   |/',
  '                         ||',
  '                         ||',
  '        ________________ || __________________',
  '       /_____________________________________/|',
  '       |____________________________________|/',
  '              |                    |',
  '              |____________________|',
];

interface Glyph {
  char: string;
  row: number;
  column: number;
  offsetX: number;
  offsetY: number;
}

export const AnvilAscii: React.FC<{ label: string }> = ({ label }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d', { alpha: true });
    if (!canvas || !context) return;

    let frameId: number | null = null;
    let pointer = { x: -1000, y: -1000, active: false };
    let cssWidth = 0;
    let cssHeight = 0;
    let fontSize = 14;
    let cellWidth = 9;
    let lineHeight = 18;
    const style = getComputedStyle(canvas);
    const accentColor = style.getPropertyValue('--color-accent').trim();
    const softColor = style.getPropertyValue('--color-soft').trim();
    const fontFamily = style.getPropertyValue('--font-mono').trim() || 'monospace';
    const noHover = window.matchMedia('(hover: none)');
    const coarsePointer = window.matchMedia('(pointer: coarse)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let motionDisabled = prefersReducedMotion || noHover.matches || coarsePointer.matches || reducedMotion.matches;
    const maxColumns = Math.max(...ANVIL_ART.map((row) => row.length));
    const glyphs: Glyph[] = ANVIL_ART.flatMap((row, rowIndex) =>
      Array.from(row).map((char, column) => ({ char, row: rowIndex, column, offsetX: 0, offsetY: 0 }))
    );

    const draw = (now = 0) => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, cssWidth, cssHeight);
      context.font = `600 ${fontSize}px ${fontFamily}`;
      context.textAlign = 'center';
      context.textBaseline = 'middle';

      let unsettled = false;
      for (const glyph of glyphs) {
        if (glyph.char !== ' ') {
          const rowLength = ANVIL_ART[glyph.row].length;
          const originX = (cssWidth - rowLength * cellWidth) / 2 + (glyph.column + 0.5) * cellWidth;
          const originY = (cssHeight - ANVIL_ART.length * lineHeight) / 2 + (glyph.row + 0.5) * lineHeight;
          let targetX = 0;
          let targetY = 0;

          if (pointer.active && !motionDisabled) {
            const dx = originX - pointer.x;
            const dy = originY - pointer.y;
            const distance = Math.hypot(dx, dy);
            const influence = Math.max(0, 1 - distance / 88);
            const force = influence * influence * fontSize * 1.3;
            if (distance > 0.1) {
              targetX = (dx / distance) * force;
              targetY = (dy / distance) * force + Math.sin(now * 0.014 - distance * 0.08) * force * 0.12;
            }
          }

          glyph.offsetX += (targetX - glyph.offsetX) * 0.22;
          glyph.offsetY += (targetY - glyph.offsetY) * 0.22;
          if (Math.abs(targetX - glyph.offsetX) > 0.12 || Math.abs(targetY - glyph.offsetY) > 0.12) unsettled = true;

          const character = '[]/\\_|'.includes(glyph.char);
          context.fillStyle = character ? accentColor : softColor;
          context.fillText(glyph.char, originX + glyph.offsetX, originY + glyph.offsetY);
        } else {
          glyph.offsetX *= 0.78;
          glyph.offsetY *= 0.78;
        }
      }

      if (unsettled) frameId = requestAnimationFrame(draw);
      else frameId = null;
    };

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      cssWidth = bounds.width;
      cssHeight = bounds.height;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(cssWidth * ratio);
      canvas.height = Math.round(cssHeight * ratio);
      fontSize = Math.max(9, Math.min(19, cssWidth / (maxColumns * 0.68)));
      cellWidth = fontSize * 0.68;
      lineHeight = fontSize * 1.35;
      draw();
    };

    const schedule = () => {
      if (frameId === null) frameId = requestAnimationFrame(draw);
    };
    const pointerMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || motionDisabled) return;
      const bounds = canvas.getBoundingClientRect();
      pointer = { x: event.clientX - bounds.left, y: event.clientY - bounds.top, active: true };
      schedule();
    };
    const pointerLeave = () => {
      pointer.active = false;
      schedule();
    };
    const handleMotionPreference = () => {
      motionDisabled = prefersReducedMotion || noHover.matches || coarsePointer.matches || reducedMotion.matches;
      pointer.active = false;
      if (motionDisabled && frameId !== null) {
        cancelAnimationFrame(frameId);
        frameId = null;
        glyphs.forEach((glyph) => { glyph.offsetX = 0; glyph.offsetY = 0; });
      }
      draw();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    canvas.addEventListener('pointermove', pointerMove, { passive: true });
    canvas.addEventListener('pointerleave', pointerLeave, { passive: true });
    noHover.addEventListener('change', handleMotionPreference);
    coarsePointer.addEventListener('change', handleMotionPreference);
    reducedMotion.addEventListener('change', handleMotionPreference);
    window.addEventListener('resize', resize, { passive: true });
    resize();

    return () => {
      resizeObserver.disconnect();
      canvas.removeEventListener('pointermove', pointerMove);
      canvas.removeEventListener('pointerleave', pointerLeave);
      noHover.removeEventListener('change', handleMotionPreference);
      coarsePointer.removeEventListener('change', handleMotionPreference);
      reducedMotion.removeEventListener('change', handleMotionPreference);
      window.removeEventListener('resize', resize);
      if (frameId !== null) cancelAnimationFrame(frameId);
    };
  }, [prefersReducedMotion]);

  return (
    <div className="anvil-ascii-zone site-container" data-cursor-cross>
      <canvas ref={canvasRef} className="anvil-ascii-canvas" role="img" aria-label={label} />
    </div>
  );
};
