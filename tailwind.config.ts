import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        black: 'var(--black)',
        white: 'var(--white)',
        'off-white': 'var(--off-white)',
        'grey-dim': 'var(--grey-dim)',
        line: 'var(--line)',
        'blue-void': 'var(--blue-void)',
        'blue-deep': 'var(--blue-deep)',
        'blue-tech': 'var(--blue-tech)',
        'blue-glow': 'var(--blue-glow)',
        'blue-ice': 'var(--blue-ice)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        mono: ['var(--font-geist-mono)', 'ui-monospace', 'monospace'],
      },
      transitionTimingFunction: {
        // salida rápida y frenado largo: se siente "pesado", como un objeto real
        out: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
