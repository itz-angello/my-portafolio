/**
 * WorkIntro — pantalla de entrada para /portfolio/
 *
 * Se muestra cada vez que se carga /portfolio/ (recarga completa).
 * No se repite al cambiar ES/EN porque el componente no se desmonta
 * entre re-renders del LanguageContext — el estado `phase` persiste.
 *
 * Colores: leídos de los custom properties de src/tokens.css en tiempo
 * de ejecución (getComputedStyle), nunca hardcoded.
 */
import React, { useEffect, useRef, useState, useCallback } from 'react';

const CHARS = '01{};/<>=()?!_'.split('');

// ─── Tipos internos ───────────────────────────────────────────────────────────
interface Column {
  x: number;
  y: number;        // posición de la cabeza (en unidades de fila)
  speed: number;    // filas avanzadas por frame
  fontSize: number;
  isEmber: boolean; // usa el color naranja en la cabeza (~12 % de columnas)
  trail: number;    // longitud de la estela en caracteres
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function rand(min: number, max: number) { return min + Math.random() * (max - min); }
function randInt(min: number, max: number) { return Math.floor(rand(min, max + 1)); }

/** Lee un token CSS del :root y devuelve su valor como string trimmed. */
function token(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/**
 * Oscurece un color hex #RRGGBB o #RGB aplicando un factor [0,1].
 * factor=0 → negro, factor=1 → color original.
 * Se usa para generar la estela media y la cola a partir del mismo token.
 */
function dimHex(hex: string, factor: number): string {
  const full = hex.replace('#', '').replace(/^(.)(.)(.)$/, '$1$1$2$2$3$3');
  const r = Math.round(parseInt(full.slice(0, 2), 16) * factor);
  const g = Math.round(parseInt(full.slice(2, 4), 16) * factor);
  const b = Math.round(parseInt(full.slice(4, 6), 16) * factor);
  return `rgb(${r},${g},${b})`;
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface WorkIntroProps {
  label: string; // "WORK" o su traducción desde content.ts
}

export const WorkIntro: React.FC<WorkIntroProps> = ({ label }) => {
  const [phase, setPhase] = useState<'rain' | 'exit' | 'gone'>('rain');
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const rafRef     = useRef<number | null>(null);
  const columnsRef = useRef<Column[]>([]);

  // Detectar reduced-motion una sola vez al montar
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Iniciar salida ────────────────────────────────────────────────────────
  const triggerExit = useCallback(() => {
    setPhase((prev) => {
      if (prev !== 'rain') return prev;
      setTimeout(() => setPhase('gone'), 420);
      return 'exit';
    });
  }, []);

  // ── Temporizador automático + cierre por interacción ─────────────────────
  useEffect(() => {
    const timer = setTimeout(triggerExit, 1800);
    window.addEventListener('keydown',     triggerExit, { once: true, passive: true });
    window.addEventListener('pointerdown', triggerExit, { once: true, passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown',     triggerExit);
      window.removeEventListener('pointerdown', triggerExit);
    };
  }, [triggerExit]);

  // ── Canvas: lluvia de código ──────────────────────────────────────────────
  useEffect(() => {
    if (prefersReduced || phase === 'gone') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // ── Leer colores desde los tokens CSS ────────────────────────────────────
    const accent     = token('--color-accent');     // #9EC6DF  azul pizarra claro
    const emberHot   = token('--color-ember-hot');  // #F5BA7B  naranja caliente
    // Estela media y cola derivadas oscureciendo el accent con dimHex
    const slateHead  = accent;
    const slateMid   = dimHex(accent, 0.52);
    const slateTail  = dimHex(accent, 0.26);
    const emberHead  = emberHot;
    const monoFont   = token('--font-mono') || "'JetBrains Mono', monospace";

    const isMobile = window.innerWidth < 640;
    const dpr      = Math.min(window.devicePixelRatio || 1, 2);

    // ── Redimensionar ─────────────────────────────────────────────────────────
    const resize = () => {
      const W = window.innerWidth;
      const H = window.innerHeight;
      canvas.width  = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width  = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildColumns(W);
    };

    // ── Construir columnas ────────────────────────────────────────────────────
    const buildColumns = (W: number) => {
      const density = isMobile ? 0.45 : 0.75;
      const minFont = isMobile ? 10 : 11;
      const maxFont = isMobile ? 14 : 18;
      columnsRef.current = [];
      let x = 0;
      while (x < W) {
        const fontSize = randInt(minFont, maxFont);
        const colW     = fontSize * 0.75;
        if (Math.random() < density) {
          columnsRef.current.push({
            x,
            y:        rand(-30, 0),
            speed:    rand(0.08, 0.28),
            fontSize,
            isEmber:  Math.random() < 0.12,
            trail:    randInt(6, 22),
          });
        }
        x += colW;
      }
    };

    resize();

    // ── Loop de animación ─────────────────────────────────────────────────────
    const draw = () => {
      const H = window.innerHeight;
      ctx.clearRect(0, 0, window.innerWidth, H);

      for (const col of columnsRef.current) {
        const lineH = col.fontSize * 1.4;
        col.y += col.speed;

        for (let i = 0; i < col.trail; i++) {
          const fy = (col.y - i - 1) * lineH;
          if (fy < -lineH || fy > H + lineH) continue;

          const t     = 1 - i / col.trail;
          const alpha = t * t * 0.75;

          ctx.font      = `600 ${col.fontSize}px ${monoFont}`;
          ctx.textAlign = 'center';

          if (i === 0) {
            ctx.globalAlpha = 0.95;
            ctx.fillStyle   = col.isEmber ? emberHead : slateHead;
          } else {
            ctx.globalAlpha = alpha;
            ctx.fillStyle   = i < 3 ? slateMid : slateTail;
          }

          ctx.fillText(CHARS[randInt(0, CHARS.length - 1)], col.x, fy);
        }

        // Reiniciar columna al salir por abajo
        if ((col.y - col.trail) * col.fontSize * 1.4 > H) {
          col.y       = rand(-col.trail * 2, -col.trail);
          col.speed   = rand(0.08, 0.28);
          col.isEmber = Math.random() < 0.12;
          col.trail   = randInt(6, 22);
        }
      }

      ctx.globalAlpha = 1;
      rafRef.current  = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    window.addEventListener('resize', resize, { passive: true });
    return () => {
      window.removeEventListener('resize', resize);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  // phase sólo importa para el guard inicial; el loop se detiene en cleanup
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReduced]);

  if (phase === 'gone') return null;

  return (
    <div
      className={`work-intro-overlay${phase === 'exit' ? ' work-intro-exit' : ''}`}
      aria-hidden="true"
      role="presentation"
    >
      <canvas ref={canvasRef} className="work-intro-canvas" aria-hidden="true" />
      <div className="work-intro-veil" aria-hidden="true" />
      <p
        className={`work-intro-text${phase === 'rain' ? ' work-intro-text-in' : ''}`}
        aria-label={label}
      >
        {Array.from(label).map((letter, i) => (
          <span
            key={i}
            className="work-intro-letter"
            style={prefersReduced ? undefined : { animationDelay: `${i * 0.07}s` }}
          >
            {letter}
          </span>
        ))}
      </p>
    </div>
  );
};
