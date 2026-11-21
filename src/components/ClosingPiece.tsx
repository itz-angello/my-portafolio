import React, { useEffect, useRef } from 'react';
import asciiArt from '../assets/ascii-art.txt?raw';
import asciiDigits from '../assets/ascii-digits.txt?raw';

interface ClosingPieceProps {
  label: string;
  owner: string;
  location: string;
}

interface Glyph {
  character: string;
  row: number;
  x: number;
  y: number;
  width: number;
  height: number;
  color: number[];
  alpha: number;
  dense: boolean;
  background: boolean;
  covered: boolean;
  entrance: number;
  hover: number;
  offsetX: number;
  offsetY: number;
}

const HOVER_RADIUS = 80;
const ENTRANCE_STAGGER = 560;
const ENTRANCE_FADE = 340;
const SOURCE_GAP_START = 42;
const SOURCE_GAP_END = 52;
const MASK_THRESHOLD = 0.15;
const MASK_INTENSITY: Record<string, number> = {
  '@': 1,
  '%': 0.93,
  '#': 0.87,
  '=': 0.68,
  '*': 0.64,
  '+': 0.58,
  ':': 0.43,
  '-': 0.37,
  '.': 0.31,
};

const SOURCE_LINES = asciiArt.replace(/\r/g, '').replace(/\n+$/, '').split('\n');
const ART_LINES = SOURCE_LINES.map((line) => line.slice(0, SOURCE_GAP_START) + line.slice(SOURCE_GAP_END));
const DIGIT_LINES = asciiDigits.replace(/\r/g, '').replace(/\n+$/, '').split('\n');
const ART_ROWS = ART_LINES.length;
const ART_COLUMNS = Math.max(...ART_LINES.map((line) => line.length));
const DIGIT_ROWS = DIGIT_LINES.length;
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
    let fontSize = 10;
    let maskCellSize = 0;
    let maskCellWidth = 0;
    let maskCellHeight = 0;
    let maskStartX = 0;
    let maskStartY = 0;
    let backgroundCellWidth = 7.5;
    let backgroundCellHeight = 10;
    let backgroundColumns = 0;
    let backgroundRows = 0;
    let pixelRatio = 1;
    let backgroundGrid: (Glyph | null)[][] = [];
    let maskGrid: (Glyph | null)[][] = [];
    let backgroundGlyphs: Glyph[] = [];
    let visibleBackgroundGlyphs: Glyph[] = [];
    let maskGlyphs: Glyph[] = [];
    let flickerGlyphs: Glyph[] = [];
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

    const sourceMask = ART_LINES.map((line) => Array.from({ length: ART_COLUMNS }, (_, column) => MASK_INTENSITY[line[column]] ?? 0));
    const sampleMask = (column: number, row: number, scale: number) => {
      const sourceX = Math.max(0, Math.min(ART_COLUMNS - 1, (column + 0.5) / scale - 0.5));
      const sourceY = Math.max(0, Math.min(ART_ROWS - 1, (row + 0.5) / scale - 0.5));
      const left = Math.floor(sourceX);
      const top = Math.floor(sourceY);
      const right = Math.min(ART_COLUMNS - 1, left + 1);
      const bottom = Math.min(ART_ROWS - 1, top + 1);
      const xBlend = sourceX - left;
      const yBlend = sourceY - top;
      const topValue = sourceMask[top][left] * (1 - xBlend) + sourceMask[top][right] * xBlend;
      const bottomValue = sourceMask[bottom][left] * (1 - xBlend) + sourceMask[bottom][right] * xBlend;
      return topValue * (1 - yBlend) + bottomValue * yBlend;
    };

    const setTextStyle = (glyph: Glyph) => {
      const accentMix = glyph.background ? 0 : glyph.hover * 0.82;
      const color = blend(glyph.color, emberRgb, accentMix);
      context.fillStyle = `rgb(${color.join(' ')})`;
      context.globalAlpha = glyph.background
        ? (0.14 + glyph.hover * 0.16) * glyph.entrance
        : glyph.alpha * glyph.entrance;
      context.shadowColor = !glyph.background && glyph.dense ? `rgba(${blueRgb.join(' ')}, 0.16)` : 'transparent';
      context.shadowBlur = !glyph.background && glyph.dense ? 1.4 : 0;
    };

    const intersects = (glyph: Glyph, left: number, top: number, right: number, bottom: number) =>
      glyph.x + glyph.width / 2 >= left && glyph.x - glyph.width / 2 <= right &&
      glyph.y + glyph.height / 2 >= top && glyph.y - glyph.height / 2 <= bottom;

    const stopFlicker = () => {
      if (flickerTimer !== null) window.clearInterval(flickerTimer);
      flickerTimer = null;
    };

    const rebuildGlyphs = () => {
      const bounds = canvas.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      width = bounds.width;
      height = bounds.height;
      fontSize = width < 640 ? 9 : 10;
      backgroundCellWidth = width < 640 ? 6.5 : 7.5;
      backgroundCellHeight = width < 640 ? 10 : 10;
      pixelRatio = window.devicePixelRatio || 1;
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      backgroundColumns = Math.ceil(width / backgroundCellWidth);
      backgroundRows = Math.ceil(height / backgroundCellHeight);
      backgroundGrid = Array.from({ length: backgroundRows }, () => Array<Glyph | null>(backgroundColumns).fill(null));
      maskGrid = [];
      backgroundGlyphs = [];
      maskGlyphs = [];
      flickerGlyphs = [];

      for (let row = 0; row < backgroundRows; row += 1) {
        for (let column = 0; column < backgroundColumns; column += 1) {
          const glyph: Glyph = {
            character: DIGIT_LINES[row % DIGIT_ROWS][column % DIGIT_COLUMNS],
            row,
            x: Math.min(width - backgroundCellWidth / 2, column * backgroundCellWidth + backgroundCellWidth / 2),
            y: Math.min(height - backgroundCellHeight / 2, row * backgroundCellHeight + backgroundCellHeight / 2),
            width: backgroundCellWidth,
            height: backgroundCellHeight,
            color: slateRgb,
            alpha: 0.14,
            dense: false,
            background: true,
            covered: false,
            entrance: motionDisabled ? 1 : 0,
            hover: 0,
            offsetX: 0,
            offsetY: 0,
          };
          backgroundGrid[row][column] = glyph;
          backgroundGlyphs.push(glyph);
        }
      }

      // Target roughly 6px mask cells while keeping the source proportions.
      const sourceCellWidth = width / ART_COLUMNS;
      const maskScale = width < 640 ? 1 : Math.min(2.5, Math.max(1, sourceCellWidth / 6));
      const maskRows = Math.round(ART_ROWS * maskScale);
      const maskColumns = Math.round(ART_COLUMNS * maskScale);
      maskCellSize = Math.min(width / maskColumns, height / maskRows);
      maskCellWidth = maskCellSize;
      maskCellHeight = maskCellSize;
      maskStartX = (width - maskColumns * maskCellSize) / 2;
      maskStartY = (height - maskRows * maskCellSize) / 2;
      maskGrid = Array.from({ length: maskRows }, () => Array<Glyph | null>(maskColumns).fill(null));

      for (let row = 0; row < maskRows; row += 1) {
        for (let column = 0; column < maskColumns; column += 1) {
          const intensity = sampleMask(column, row, maskScale);
          if (intensity < MASK_THRESHOLD) continue;
          const color = blend(slateRgb, blueRgb, Math.min(1, 0.35 + intensity * 0.65));
          const glyph: Glyph = {
            character: DIGIT_LINES[row % DIGIT_ROWS][column % DIGIT_COLUMNS],
            row,
            x: maskStartX + column * maskCellSize + maskCellSize / 2,
            y: maskStartY + row * maskCellSize + maskCellSize / 2,
            width: maskCellWidth,
            height: maskCellHeight,
            color,
            alpha: 0.6 + intensity * 0.4,
            dense: intensity >= 0.75,
            background: false,
            covered: true,
            entrance: motionDisabled ? 1 : 0,
            hover: 0,
            offsetX: 0,
            offsetY: 0,
          };
          maskGrid[row][column] = glyph;
          maskGlyphs.push(glyph);
        }
      }

      maskGlyphs.forEach((maskCell) => {
        const left = maskCell.x - maskCell.width / 2;
        const right = maskCell.x + maskCell.width / 2;
        const top = maskCell.y - maskCell.height / 2;
        const bottom = maskCell.y + maskCell.height / 2;
        const minColumn = Math.max(0, Math.floor(left / backgroundCellWidth));
        const maxColumn = Math.min(backgroundColumns - 1, Math.floor(right / backgroundCellWidth));
        const minRow = Math.max(0, Math.floor(top / backgroundCellHeight));
        const maxRow = Math.min(backgroundRows - 1, Math.floor(bottom / backgroundCellHeight));
        for (let row = minRow; row <= maxRow; row += 1) {
          for (let column = minColumn; column <= maxColumn; column += 1) {
            const bgCell = backgroundGrid[row][column];
            if (bgCell && intersects(maskCell, bgCell.x - bgCell.width / 2, bgCell.y - bgCell.height / 2, bgCell.x + bgCell.width / 2, bgCell.y + bgCell.height / 2)) {
              bgCell.covered = true;
            }
          }
        }
      });
      visibleBackgroundGlyphs = backgroundGlyphs.filter((glyph) => !glyph.covered);
      flickerGlyphs = [...backgroundGlyphs.filter((glyph) => !glyph.covered), ...maskGlyphs];
      if (hasEntered) scheduleFrame();
    };

    const updateGlyph = (glyph: Glyph, now: number) => {
      const rowProgress = glyph.y / Math.max(height, 1);
      const rowDelay = rowProgress * ENTRANCE_STAGGER;
      const elapsed = motionDisabled ? Number.POSITIVE_INFINITY : now - entranceStart;
      glyph.entrance = motionDisabled ? 1 : Math.max(0, Math.min(1, (elapsed - rowDelay) / ENTRANCE_FADE));
      const dx = glyph.x - pointer.x;
      const dy = glyph.y - pointer.y;
      const distance = Math.hypot(dx, dy);
      const influence = !motionDisabled && pointer.active ? Math.max(0, 1 - distance / HOVER_RADIUS) : 0;
      glyph.hover += (influence - glyph.hover) * 0.2;
      if (!glyph.background) {
        const travel = influence * influence * 3;
        const targetX = distance > 0.1 && influence > 0 ? (dx / distance) * travel : 0;
        const targetY = distance > 0.1 && influence > 0 ? (dy / distance) * travel : 0;
        glyph.offsetX += (targetX - glyph.offsetX) * 0.2;
        glyph.offsetY += (targetY - glyph.offsetY) * 0.2;
        return Math.abs(influence - glyph.hover) > 0.01 || Math.abs(targetX - glyph.offsetX) > 0.1 || Math.abs(targetY - glyph.offsetY) > 0.1;
      }
      return Math.abs(influence - glyph.hover) > 0.01;
    };

    const clearCanvas = () => {
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, canvas.width, canvas.height);
    };
    const drawLayer = (glyphs: Glyph[]) => {
      if (!glyphs.length) return;
      const cellHeight = glyphs[0].height;
      const verticalScale = cellHeight / fontSize;
      context.setTransform(pixelRatio, 0, 0, pixelRatio * verticalScale, 0, 0);
      context.font = `500 ${fontSize}px ${monoFont}`;
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      for (const glyph of glyphs) {
        setTextStyle(glyph);
        const entranceOffset = motionDisabled ? 0 : (1 - glyph.entrance) * 4;
        context.fillText(glyph.character, glyph.x + glyph.offsetX, (glyph.y + glyph.offsetY + entranceOffset) / verticalScale, Math.min(glyph.width, fontSize * 0.62));
      }
    };

    const draw = (now: number) => {
      frameId = null;
      if (!hasEntered) return;
      let settling = false;
      const allGlyphs = flickerGlyphs;
      for (const glyph of allGlyphs) {
        if (updateGlyph(glyph, now)) settling = true;
      }
      clearCanvas();
      drawLayer(visibleBackgroundGlyphs);
      drawLayer(maskGlyphs);
      context.globalAlpha = 1;
      context.shadowBlur = 0;
      const entering = !motionDisabled && now - entranceStart < ENTRANCE_STAGGER + ENTRANCE_FADE;
      if (entering || settling) scheduleFrame();
      else startFlicker();
    };

    const redrawChangedRegion = (changed: Glyph) => {
      const padding = 2;
      const left = changed.x - changed.width / 2 - padding;
      const top = changed.y - changed.height / 2 - padding;
      const right = changed.x + changed.width / 2 + padding;
      const bottom = changed.y + changed.height / 2 + padding;
      context.save();
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      context.beginPath();
      context.rect(left, top, right - left, bottom - top);
      context.clip();
      context.clearRect(left, top, right - left, bottom - top);
      const localBackground: Glyph[] = [];
      const bgLeft = Math.max(0, Math.floor(left / backgroundCellWidth));
      const bgRight = Math.min(backgroundColumns - 1, Math.floor(right / backgroundCellWidth));
      const bgTop = Math.max(0, Math.floor(top / backgroundCellHeight));
      const bgBottom = Math.min(backgroundRows - 1, Math.floor(bottom / backgroundCellHeight));
      for (let row = bgTop; row <= bgBottom; row += 1) {
        for (let column = bgLeft; column <= bgRight; column += 1) {
          const cell = backgroundGrid[row][column];
          if (cell && !cell.covered) localBackground.push(cell);
        }
      }
      const localMask: Glyph[] = [];
      const maskLeft = Math.max(0, Math.floor((left - maskStartX) / maskCellWidth));
      const maskRight = Math.min(maskGrid[0].length - 1, Math.floor((right - maskStartX) / maskCellWidth));
      const maskTop = Math.max(0, Math.floor((top - maskStartY) / maskCellHeight));
      const maskBottom = Math.min(maskGrid.length - 1, Math.floor((bottom - maskStartY) / maskCellHeight));
      for (let row = maskTop; row <= maskBottom; row += 1) {
        for (let column = maskLeft; column <= maskRight; column += 1) {
          const cell = maskGrid[row][column];
          if (cell) localMask.push(cell);
        }
      }
      drawLayer(localBackground);
      drawLayer(localMask);
      context.restore();
      context.globalAlpha = 1;
      context.shadowBlur = 0;
    };

    const scheduleFrame = () => {
      if (frameId === null) frameId = requestAnimationFrame(draw);
    };
    const startFlicker = () => {
      if (motionDisabled || !isVisible || flickerTimer !== null) return;
      flickerTimer = window.setInterval(() => {
        const visible = flickerGlyphs.filter((glyph) => glyph.entrance >= 1);
        if (!visible.length) return;
        const count = Math.min(visible.length, Math.max(1, Math.ceil(visible.length * (0.01 + Math.random() * 0.01))));
        const changed = new Set<Glyph>();
        while (changed.size < count) changed.add(visible[Math.floor(Math.random() * visible.length)]);
        changed.forEach((glyph) => {
          const choices = ['0', '1', '2'].filter((digit) => digit !== glyph.character);
          glyph.character = choices[Math.floor(Math.random() * choices.length)];
          redrawChangedRegion(glyph);
        });
      }, 150);
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
        flickerGlyphs.forEach((glyph) => { glyph.hover = 0; glyph.offsetX = 0; glyph.offsetY = 0; });
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
