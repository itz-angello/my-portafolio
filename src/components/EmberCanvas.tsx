import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

interface Ember {
  x: number;
  y: number;
  vx: number;
  vy: number;
  sprite: HTMLCanvasElement;
  life: number;
  maxLife: number;
  color: string;
}

const MAX_EMBERS = 40;

export const EmberCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d', { alpha: true });
    if (!canvas || !context) return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobileQuery = window.matchMedia('(max-width: 767px), (pointer: coarse)');
    if (prefersReducedMotion || motionQuery.matches || mobileQuery.matches) return;

    let width = 0;
    let height = 0;
    let frame: number | null = null;
    let inViewport = false;
    let lastTime = 0;
    let pointer = { x: -1000, y: -1000 };
    const embers: Ember[] = [];
    const styles = getComputedStyle(document.documentElement);
    const emberColors = [styles.getPropertyValue('--color-ember').trim(), styles.getPropertyValue('--color-forge').trim()];
    const glowSprites = new Map<string, HTMLCanvasElement>();
    emberColors.forEach((color) => {
      for (let size = 8; size <= 32; size += 1) {
        const sprite = document.createElement('canvas');
        sprite.width = size;
        sprite.height = size;
        const spriteContext = sprite.getContext('2d');
        if (!spriteContext) continue;
        const center = size / 2;
        const glow = spriteContext.createRadialGradient(center, center, 0, center, center, center);
        glow.addColorStop(0, color);
        glow.addColorStop(0.16, color);
        glow.addColorStop(0.4, `${color}99`);
        glow.addColorStop(1, `${color}00`);
        spriteContext.fillStyle = glow;
        spriteContext.fillRect(0, 0, size, size);
        glowSprites.set(`${color}:${size}`, sprite);
      }
    });

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 0.85);
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      embers.length = 0;
    };

    const onPointerMove = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      pointer = { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
    };

    const makeEmber = (): Ember => {
      const color = emberColors[Math.random() > 0.28 ? 0 : 1];
      const size = 8 + Math.round(Math.random() * 24);
      const sprite = glowSprites.get(`${color}:${size}`);
      if (!sprite) throw new Error('Ember glow sprite is unavailable');
      return {
        x: Math.random() * width,
        y: height + Math.random() * height * 0.08,
        vx: (Math.random() - 0.5) * 34,
        vy: -(45 + Math.random() * 115),
        sprite,
        life: 0,
        maxLife: 3.2 + Math.random() * 3.2,
        color,
      };
    };

    const draw = (time: number) => {
      const delta = Math.min((time - (lastTime || time)) / 1000, 0.04);
      lastTime = time;
      context.clearRect(0, 0, width, height);

      while (embers.length < MAX_EMBERS) embers.push(makeEmber());
      for (let i = embers.length - 1; i >= 0; i -= 1) {
        const ember = embers[i];
        ember.life += delta;
        const distance = Math.hypot(pointer.x - ember.x, pointer.y - ember.y);
        if (distance < 150) {
          const force = (1 - distance / 150) * 42;
          ember.vx += ((ember.x - pointer.x) / (distance || 1)) * force * delta;
          ember.vy += ((ember.y - pointer.y) / (distance || 1)) * force * delta;
        }
        ember.vx *= 0.995;
        ember.x += ember.vx * delta;
        ember.y += ember.vy * delta;

        const fade = Math.min(ember.life * 2, (1 - ember.life / ember.maxLife) * 2, 1);
        context.globalAlpha = Math.max(0, fade);
        const glowSize = ember.sprite.width;
        context.drawImage(ember.sprite, ember.x - glowSize / 2, ember.y - glowSize / 2);

        if (ember.life >= ember.maxLife || ember.y < -20 || ember.x < -20 || ember.x > width + 20) {
          embers[i] = makeEmber();
        }
      }
      context.globalAlpha = 1;
      frame = inViewport ? requestAnimationFrame(draw) : null;
    };

    resize();
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      inViewport = entry.isIntersecting;
      if (inViewport && frame === null) {
        lastTime = 0;
        frame = requestAnimationFrame(draw);
      } else if (!inViewport && frame !== null) {
        cancelAnimationFrame(frame);
        frame = null;
      }
    });
    visibilityObserver.observe(canvas);
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      visibilityObserver.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, [prefersReducedMotion]);

  return <canvas ref={canvasRef} className="ember-canvas" aria-hidden="true" />;
};
