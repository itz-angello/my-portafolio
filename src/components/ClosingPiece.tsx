import React, { useEffect, useRef } from 'react';

interface ClosingPieceProps {
  label: string;
  owner: string;
  location: string;
  imageSrc?: string;
}

interface CharacterCell {
  x: number;
  y: number;
  brightness: number;
  offsetX: number;
  offsetY: number;
}

const DENSITY_RAMP = ' .:-=+*#%@';
const CELL_SIZE = 10;
const INTERACTION_RADIUS = 90;

export const ClosingPiece: React.FC<ClosingPieceProps> = ({ label, owner, location, imageSrc }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sourceCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const sourceCanvas = sourceCanvasRef.current;
    const context = canvas?.getContext('2d', { alpha: true });
    const sourceContext = sourceCanvas?.getContext('2d', { willReadFrequently: true });
    if (!canvas || !sourceCanvas || !context || !sourceContext) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const coarsePointer = window.matchMedia('(pointer: coarse)');
    const compactViewport = window.matchMedia('(max-width: 639px)');
    const image = imageSrc ? new Image() : null;
    const cells: CharacterCell[] = [];
    const movingCells = new Set<CharacterCell>();
    let motionDisabled = reducedMotion.matches || coarsePointer.matches || compactViewport.matches;
    let frameId: number | null = null;
    let width = 0;
    let height = 0;
    let columns = 0;
    let rows = 0;
    let pixelRatio = 1;
    let baseFrame: ImageData | null = null;
    let pointer = { x: -1000, y: -1000, active: false };

    const accent = getComputedStyle(canvas).getPropertyValue('--color-accent').trim() || '#f18b45';
    const textColor = getComputedStyle(canvas).getPropertyValue('--color-soft').trim() || '#aab9bd';
    const headingFont = getComputedStyle(canvas).getPropertyValue('--font-heading').trim() || 'sans-serif';
    const monoFont = getComputedStyle(canvas).getPropertyValue('--font-mono').trim() || 'monospace';
    const background = '#101d25';

    const drawGeneratedMonogram = () => {
      sourceContext.fillStyle = background;
      sourceContext.fillRect(0, 0, width, height);

      const ambient = sourceContext.createRadialGradient(width * 0.5, height * 0.52, 0, width * 0.5, height * 0.52, width * 0.48);
      ambient.addColorStop(0, 'rgba(91, 129, 143, 0.22)');
      ambient.addColorStop(0.55, 'rgba(55, 83, 94, 0.12)');
      ambient.addColorStop(1, 'rgba(16, 29, 37, 0)');
      sourceContext.fillStyle = ambient;
      sourceContext.fillRect(0, 0, width, height);

      const fontSize = Math.min(height * 1.08, width * 0.72);
      sourceContext.font = `900 ${fontSize}px ${headingFont}`;
      sourceContext.textAlign = 'center';
      sourceContext.textBaseline = 'middle';
      sourceContext.shadowColor = accent;
      sourceContext.shadowBlur = height * 0.1;
      const volume = sourceContext.createLinearGradient(width * 0.28, height * 0.12, width * 0.73, height * 0.9);
      volume.addColorStop(0, '#ffe0b0');
      volume.addColorStop(0.3, '#ffab67');
      volume.addColorStop(0.68, '#c96239');
      volume.addColorStop(1, '#385461');
      sourceContext.fillStyle = volume;
      sourceContext.fillText('AC', width / 2, height * 0.51);
      sourceContext.shadowBlur = 0;
    };

    const drawImageSource = () => {
      if (!image?.complete || !image.naturalWidth || !image.naturalHeight) {
        drawGeneratedMonogram();
        return;
      }

      sourceContext.fillStyle = background;
      sourceContext.fillRect(0, 0, width, height);
      const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
      const drawWidth = image.naturalWidth * scale;
      const drawHeight = image.naturalHeight * scale;
      sourceContext.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
    };

    const rebuildCells = () => {
      const bounds = canvas.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      width = bounds.width;
      height = bounds.height;
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      sourceCanvas.width = Math.round(width);
      sourceCanvas.height = Math.round(height);
      drawImageSource();

      const pixels = sourceContext.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height).data;
      columns = Math.ceil(width / CELL_SIZE);
      rows = Math.ceil(height / CELL_SIZE);
      cells.length = 0;
      movingCells.clear();

      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          const x = Math.min(width - 1, (column + 0.5) * CELL_SIZE);
          const y = Math.min(height - 1, (row + 0.5) * CELL_SIZE);
          const pixelX = Math.floor(x);
          const pixelY = Math.floor(y);
          let red = 0;
          let green = 0;
          let blue = 0;
          let samples = 0;

          for (let sampleY = -1; sampleY <= 1; sampleY += 1) {
            for (let sampleX = -1; sampleX <= 1; sampleX += 1) {
              const sx = Math.max(0, Math.min(sourceCanvas.width - 1, pixelX + sampleX));
              const sy = Math.max(0, Math.min(sourceCanvas.height - 1, pixelY + sampleY));
              const offset = (sy * sourceCanvas.width + sx) * 4;
              red += pixels[offset];
              green += pixels[offset + 1];
              blue += pixels[offset + 2];
              samples += 1;
            }
          }

          const brightness = (0.2126 * red + 0.7152 * green + 0.0722 * blue) / (samples * 255);
          cells.push({ x, y, brightness, offsetX: 0, offsetY: 0 });
        }
      }
      renderBase();
      draw();
    };

    const drawCharacter = (_cell: CharacterCell, brightness: number, x: number, y: number, influence = 0) => {
      const rampIndex = Math.min(DENSITY_RAMP.length - 1, Math.floor(brightness * (DENSITY_RAMP.length - 1)));
      const character = DENSITY_RAMP[rampIndex];
      if (character === ' ' || brightness < 0.055) return;
      context.globalAlpha = Math.min(1, 0.18 + brightness * 0.82);
      context.fillStyle = influence > 0.12 || (brightness > 0.72 && rampIndex > 7) ? accent : textColor;
      context.fillText(character, x, y);
    };

    const renderBase = () => {
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      context.clearRect(0, 0, width, height);
      context.font = `600 ${CELL_SIZE * 1.12}px ${monoFont}`;
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.globalAlpha = 1;
      for (const cell of cells) drawCharacter(cell, cell.brightness, cell.x, cell.y);
      context.globalAlpha = 1;
      baseFrame = context.getImageData(0, 0, canvas.width, canvas.height);
    };

    const draw = () => {
      if (!baseFrame) return;
      let unsettled = false;
      const candidates = new Set(movingCells);
      if (pointer.active) {
        const minColumn = Math.max(0, Math.floor((pointer.x - INTERACTION_RADIUS) / CELL_SIZE));
        const maxColumn = Math.min(columns - 1, Math.ceil((pointer.x + INTERACTION_RADIUS) / CELL_SIZE));
        const minRow = Math.max(0, Math.floor((pointer.y - INTERACTION_RADIUS) / CELL_SIZE));
        const maxRow = Math.min(rows - 1, Math.ceil((pointer.y + INTERACTION_RADIUS) / CELL_SIZE));
        for (let row = minRow; row <= maxRow; row += 1) {
          for (let column = minColumn; column <= maxColumn; column += 1) candidates.add(cells[row * columns + column]);
        }
      }

      if (candidates.size === 0) {
        frameId = null;
        return;
      }

      let minX = width;
      let minY = height;
      let maxX = 0;
      let maxY = 0;
      for (const cell of candidates) {
        minX = Math.min(minX, cell.x);
        minY = Math.min(minY, cell.y);
        maxX = Math.max(maxX, cell.x);
        maxY = Math.max(maxY, cell.y);
      }
      const padding = CELL_SIZE * 2.5;
      const dirtyLeft = Math.max(0, Math.floor((minX - padding) * pixelRatio));
      const dirtyTop = Math.max(0, Math.floor((minY - padding) * pixelRatio));
      const dirtyRight = Math.min(canvas.width, Math.ceil((maxX + padding) * pixelRatio));
      const dirtyBottom = Math.min(canvas.height, Math.ceil((maxY + padding) * pixelRatio));
      context.putImageData(baseFrame, 0, 0, dirtyLeft, dirtyTop, dirtyRight - dirtyLeft, dirtyBottom - dirtyTop);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      context.font = `600 ${CELL_SIZE * 1.12}px ${monoFont}`;
      context.textAlign = 'center';
      context.textBaseline = 'middle';

      for (const cell of candidates) {
        if (!cell) continue;
        const hasOffset = Math.abs(cell.offsetX) > 0.1 || Math.abs(cell.offsetY) > 0.1;
        const dx = cell.x - pointer.x;
        const dy = cell.y - pointer.y;
        const distance = Math.hypot(dx, dy);
        const influence = pointer.active ? Math.max(0, 1 - distance / INTERACTION_RADIUS) : 0;
        const force = influence * influence * 9;
        const targetX = influence > 0 && distance > 0.1 ? (dx / distance) * force : 0;
        const targetY = influence > 0 && distance > 0.1 ? (dy / distance) * force : 0;
        cell.offsetX += (targetX - cell.offsetX) * 0.22;
        cell.offsetY += (targetY - cell.offsetY) * 0.22;
        const stillMoving = Math.abs(targetX - cell.offsetX) > 0.1 || Math.abs(targetY - cell.offsetY) > 0.1;
        if (stillMoving) {
          unsettled = true;
          movingCells.add(cell);
        } else {
          cell.offsetX = targetX;
          cell.offsetY = targetY;
          movingCells.delete(cell);
        }

        if (influence > 0.08 || hasOffset) {
          context.clearRect(cell.x - CELL_SIZE * 0.7, cell.y - CELL_SIZE * 0.7, CELL_SIZE * 1.4, CELL_SIZE * 1.4);
          drawCharacter(cell, Math.min(1, cell.brightness + influence * 0.38), cell.x + cell.offsetX, cell.y + cell.offsetY, influence);
        }
      }
      context.globalAlpha = 1;

      if (unsettled) frameId = requestAnimationFrame(draw);
      else frameId = null;
    };

    const schedule = () => {
      if (frameId === null) frameId = requestAnimationFrame(draw);
    };
    const handlePointerMove = (event: PointerEvent) => {
      if (motionDisabled || event.pointerType !== 'mouse') return;
      const bounds = canvas.getBoundingClientRect();
      pointer = { x: event.clientX - bounds.left, y: event.clientY - bounds.top, active: true };
      schedule();
    };
    const handlePointerLeave = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      pointer.active = false;
      schedule();
    };
    const updateMotionPreference = () => {
      motionDisabled = reducedMotion.matches || coarsePointer.matches || compactViewport.matches;
      pointer.active = false;
      if (motionDisabled && frameId !== null) {
        cancelAnimationFrame(frameId);
        frameId = null;
        cells.forEach((cell) => { cell.offsetX = 0; cell.offsetY = 0; });
        movingCells.clear();
        if (baseFrame) context.putImageData(baseFrame, 0, 0);
      }
    };

    if (image) {
      image.onload = rebuildCells;
      image.onerror = rebuildCells;
      image.src = imageSrc ?? '';
    }

    const resizeObserver = new ResizeObserver(rebuildCells);
    resizeObserver.observe(canvas);
    canvas.addEventListener('pointermove', handlePointerMove, { passive: true });
    canvas.addEventListener('pointerleave', handlePointerLeave, { passive: true });
    reducedMotion.addEventListener('change', updateMotionPreference);
    coarsePointer.addEventListener('change', updateMotionPreference);
    compactViewport.addEventListener('change', updateMotionPreference);
    rebuildCells();

    return () => {
      resizeObserver.disconnect();
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerleave', handlePointerLeave);
      reducedMotion.removeEventListener('change', updateMotionPreference);
      coarsePointer.removeEventListener('change', updateMotionPreference);
      compactViewport.removeEventListener('change', updateMotionPreference);
      if (frameId !== null) cancelAnimationFrame(frameId);
      if (image) {
        image.onload = null;
        image.onerror = null;
      }
    };
  }, [imageSrc]);

  return (
    <section className="closing-piece-zone site-container" aria-label={label}>
      <header className="closing-piece-heading">
        <span>{owner}</span>
        <span>{location}</span>
      </header>
      <canvas ref={canvasRef} className="closing-piece-canvas" role="img" aria-label={label} />
      <canvas ref={sourceCanvasRef} className="closing-piece-source" aria-hidden="true" />
    </section>
  );
};
