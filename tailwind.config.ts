import type { Config } from 'tailwindcss';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const config: Config & { daisyui?: any } = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [ require ("daisyui") ],
  daisyui: {
    themes: ['light', 'dark'],
  },
};

export default config;
