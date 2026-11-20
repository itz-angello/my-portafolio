/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
    './src/entries/**/*.html',
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        'surface-2': 'var(--color-surface-2)',
        text: 'var(--color-text)',
        soft: 'var(--color-soft)',
        muted: 'var(--color-muted)',
        accent: 'var(--color-accent)',
        ink: 'var(--color-ink)',
      },
      fontFamily: {
        heading: ['var(--font-heading)'],
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
      },
    },
  },
  plugins: [],
};
