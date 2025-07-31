import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary-red': '#ff1200',
        'primary-blue': '#0043ff',
        'dark-charcoal': '#232323',
        white: '#ffffff',
      },
      fontFamily: {
        montserrat: ['var(--font-montserrat)', 'sans-serif'],
        gotham: ['Gotham', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
