import React, { useEffect, useRef } from 'react';
import asciiArt from '../assets/ascii-art.txt?raw';
import asciiDigits from '../assets/ascii-digits.txt?raw';

interface ClosingPieceProps {
  label: string;
  owner: string;
  location: string;
}

interface ArtGlyph {
  character: string;
  row: number;
  x: number;
  y: number;
  alpha: number;
  color: number[];
  dense: boolean;
  entrance: number;
  hover: number;
  offsetX: number;
  offsetY: number;
}

const HOVER_RADIUS = 80;
const ENTRANCE_STAGGER = 560;
const ENTRANCE_FADE = 340;
const DENSITY: Record<string, { alpha: number; level: number }> = {
  '@': { alpha: 1, level: 1 },
  '%': { alpha: 0.94, level: 1 },
  '#': { alpha: 0.9, level: 1 },
  '=': { alpha: 0.68, level: 0.55 },
  '*': { alpha: 0.72, level: 0.55 },
  '+': { alpha: 0.64, level: 0.55 },
  ':': { alpha: 0.46, level: 0 },
  '-': { alpha: 0.4, level: 0 },
  '.': { alpha: 0.34, level: 0 },
};

const ART_LINES = asciiArt.replace(/\r/g, '').replace(/\n+$/, '').split('\n');
const DIGIT_LINES = asciiDigits.replace(/\r/g, '').replace(/\n+$/, '').split('\n');
const ART_COLUMNS = Math.max(...ART_LINES.map((line) => line.length));
const DIGIT_COLUMNS = Math.max(...DIGIT_LINES.map((line) => line.length));

export const ClosingPiece: React.FC<ClosingPieceProps> = ({ label, owner, location }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d', { alpha: true });
    if (!canvas || !context) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const coarsePointer = window.matchMedia('(pointer: coarse)');
    const compactViewport = window.matchMedia('(max-width: 639px)');
    let motionDisabled = reducedMotion.matches || coarsePointer.matches || compactViewport.matches;
    let width = 0;
    let height = 0;
    let fontSize = 0;
    let cellWidth = 0;
    let pixelRatio = 1;
    let glyphs: ArtGlyph[] = [];
    let frameId: number | null = null;
    let flickerTimer: number | null = null;
    let hasEntered = false;
    let isVisible = false;
    let entranceStart = 0;
    const pointer = { x: -1000, y: -1000, active: false };

    const readRgb = (property: string, fallback: string) => {
      const color = getComputedStyle(canvas).getPropertyValue(property).trim() || fallback;
      const hex = color.match(/^#([\da-f]{3}|[\da-f]{6})$/i)?.[1] ?? fallback.slice(1);
      const value = hex.length === 3 ? [...hex].map((digit) => digit + digit).join('') : hex;
      return [0, 2, 4].map((index) => Number.parseInt(value.slice(index, index + 2), 16));
    };
    const slateRgb = readRgb('--color-textile', '#719a9a');
    const blueRgb = readRgb('--color-accent', '#9ec6df');
    const emberRgb = readRgb('--color-ember-hot', '#f5ba7b').map((channel) => Math.min(255, Math.round(channel * 1.25)));
    const blend = (from: number[], to: number[], amount: number) => from.map((channel, index) => Math.round(channel + (to[index] - channel) * amount));
    const monoFont = getComputedStyle(canvas).getPropertyValue('--font-mono').trim() || 'monospace';

    const drawGlyph = (glyph: ArtGlyph) => {
      const rgb = blend(glyph.color, emberRgb, glyph.hover * 0.82);
      context.fillStyle = `rgb(${rgb.join(' ')})`;
      context.globalAlpha = glyph.alpha * glyph.entrance;
      context.shadowColor = glyph.dense ? `rgba(${blueRgb.join(' ')}, 0.18)` : 'transparent';
      context.shadowBlur = glyph.dense ? 1.5 : 0;
      const enterOffset = motionDisabled ? 0 : (1 - glyph.entrance) * 5;
      context.fillText(glyph.character, glyph.x + glyph.offsetX, glyph.y + glyph.offsetY + enterOffset, cellWidth);
    };

    const clearGlyph = (glyph: ArtGlyph) => {
      const enterOffset = motionDisabled ? 0 : (1 - glyph.entrance) * 5;
      const x = glyph.x + glyph.offsetX;
      const y = glyph.y + glyph.offsetY + enterOffset;
      context.clearRect(x - cellWidth / 2 - 3, y - fontSize / 2 - 3, cellWidth + 6, fontSize + 6);
    };

    const drawChangedGlyph = (glyph: ArtGlyph) => {
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      context.font = `500 ${fontSize}px ${monoFont}`;
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      clearGlyph(glyph);
      drawGlyph(glyph);
      context.globalAlpha = 1;
      context.shadowBlur = 0;
    };

    const startFlicker = () => {
      if (motionDisabled || !isVisible || flickerTimer !== null) return;
      flickerTimer = window.setInterval(() => {
        const visibleGlyphs = glyphs.filter((glyph) => glyph.entrance >= 1);
        if (!visibleGlyphs.length) return;
        const amount = Math.max(1, Math.ceil(visibleGlyphs.length * (0.01 + Math.random() * 0.01)));
        const selected = new Set<ArtGlyph>();
        while (selected.size < amount) selected.add(visibleGlyphs[Math.floor(Math.random() * visibleGlyphs.length)]);
        selected.forEach((glyph) => {
          const options = ['0', '1', '2'].filter((digit) => digit !== glyph.character);
          glyph.character = options[Math.floor(Math.random() * options.length)];
          drawChangedGlyph(glyph);
        });
      }, 150);
    };
    const stopFlicker = () => {
      if (flickerTimer !== null) window.clearInterval(flickerTimer);
      flickerTimer = null;
    };

    const rebuildGlyphs = () => {
      const bounds = canvas.getBoundingClientRect();
      if (!bounds.width) return;
      width = bounds.width;
      fontSize = width / (ART_COLUMNS * 0.55);
      cellWidth = fontSize * 0.55;
      height = ART_LINES.length * fontSize;
      canvas.style.height = `${height}px`;
      pixelRatio = window.devicePixelRatio || 1;
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      glyphs = [];

      ART_LINES.forEach((line, row) => {
        Array.from(line).forEach((maskCharacter, column) => {
          if (maskCharacter === ' ') return;
          const density = DENSITY[maskCharacter] ?? { alpha: 0.34, level: 0 };
          const digit = DIGIT_LINES[row % DIGIT_LINES.length]?.[column % DIGIT_COLUMNS] ?? '0';
          glyphs.push({
            character: digit,
            row,
            x: column * cellWidth + cellWidth / 2,
            y: row * fontSize + fontSize / 2,
            alpha: density.alpha,
            color: density.level === 1 ? blueRgb : density.level === 0.55 ? blend(slateRgb, blueRgb, 0.55) : slateRgb,
            dense: density.level === 1,
            entrance: motionDisabled ? 1 : 0,
            hover: 0,
            offsetX: 0,
            offsetY: 0,
          });
        });
      });
      if (hasEntered) scheduleFrame();
    };

    const draw = (now: number) => {
      frameId = null;
      if (!hasEntered) return;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      context.clearRect(0, 0, width, height);
      context.font = `500 ${fontSize}px ${monoFont}`;
      context.textAlign = 'center';
      context.textBaseline = 'middle';

      const entranceElapsed = motionDisabled ? Number.POSITIVE_INFINITY : now - entranceStart;
      const entranceDuration = ENTRANCE_STAGGER + ENTRANCE_FADE;
      let animating = entranceElapsed < entranceDuration;
      let settling = false;

      for (const glyph of glyphs) {
        const rowDelay = ART_LINES.length > 1 ? (glyph.row / (ART_LINES.length - 1)) * ENTRANCE_STAGGER : 0;
        glyph.entrance = motionDisabled ? 1 : Math.max(0, Math.min(1, (entranceElapsed - rowDelay) / ENTRANCE_FADE));
        const dx = glyph.x - pointer.x;
        const dy = glyph.y - pointer.y;
        const distance = Math.hypot(dx, dy);
        const influence = !motionDisabled && pointer.active ? Math.max(0, 1 - distance / HOVER_RADIUS) : 0;
        glyph.hover += (influence - glyph.hover) * 0.2;
        const travel = influence * influence * 3;
        const targetX = distance > 0.1 && influence > 0 ? (dx / distance) * travel : 0;
        const targetY = distance > 0.1 && influence > 0 ? (dy / distance) * travel : 0;
        glyph.offsetX += (targetX - glyph.offsetX) * 0.2;
        glyph.offsetY += (targetY - glyph.offsetY) * 0.2;
        if (Math.abs(influence - glyph.hover) > 0.01 || Math.abs(targetX - glyph.offsetX) > 0.1 || Math.abs(targetY - glyph.offsetY) > 0.1) settling = true;
        drawGlyph(glyph);
      }
      context.globalAlpha = 1;
      context.shadowBlur = 0;

      if (animating || settling) scheduleFrame();
      else startFlicker();
    };

    const scheduleFrame = () => {
      if (frameId === null) frameId = requestAnimationFrame(draw);
    };
    const enter = () => {
      if (!hasEntered) {
        hasEntered = true;
        entranceStart = performance.now();
      }
      if (motionDisabled) draw(performance.now());
      else scheduleFrame();
    };
    const handlePointerMove = (event: PointerEvent) => {
      if (motionDisabled || event.pointerType !== 'mouse') return;
      const bounds = canvas.getBoundingClientRect();
      pointer.x = event.clientX - bounds.left;
      pointer.y = event.clientY - bounds.top;
      pointer.active = true;
      scheduleFrame();
    };
    const handlePointerLeave = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      pointer.active = false;
      scheduleFrame();
    };
    const updateMotionPreference = () => {
      motionDisabled = reducedMotion.matches || coarsePointer.matches || compactViewport.matches;
      if (motionDisabled) {
        stopFlicker();
        pointer.active = false;
        if (frameId !== null) cancelAnimationFrame(frameId);
        frameId = null;
        glyphs.forEach((glyph) => { glyph.hover = 0; glyph.offsetX = 0; glyph.offsetY = 0; });
        if (hasEntered) draw(performance.now());
      } else if (isVisible) {
        startFlicker();
      }
    };

    rebuildGlyphs();
    const resizeObserver = new ResizeObserver(rebuildGlyphs);
    resizeObserver.observe(canvas);
    const intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          enter();
          startFlicker();
        } else {
          stopFlicker();
        }
      });
    }, { threshold: 0.05 });
    intersectionObserver.observe(canvas);
    canvas.addEventListener('pointermove', handlePointerMove, { passive: true });
    canvas.addEventListener('pointerleave', handlePointerLeave, { passive: true });
    reducedMotion.addEventListener('change', updateMotionPreference);
    coarsePointer.addEventListener('change', updateMotionPreference);
    compactViewport.addEventListener('change', updateMotionPreference);

    return () => {
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerleave', handlePointerLeave);
      reducedMotion.removeEventListener('change', updateMotionPreference);
      coarsePointer.removeEventListener('change', updateMotionPreference);
      compactViewport.removeEventListener('change', updateMotionPreference);
      stopFlicker();
      if (frameId !== null) cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <section className="closing-piece-zone site-container" aria-label={label}>
      <header className="closing-piece-heading">
        <span>{owner}</span>
        <span>{location}</span>
      </header>
      <canvas ref={canvasRef} className="closing-piece-canvas" role="img" aria-label="Monograma AC" />
    </section>
  );
};
