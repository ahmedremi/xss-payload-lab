/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#070b10',
          900: '#0b1118',
          850: '#101821',
          800: '#14202b',
        },
        signal: {
          teal: '#2dd4bf',
          lime: '#a3e635',
          amber: '#f59e0b',
          red: '#fb7185',
          blue: '#60a5fa',
        },
      },
      boxShadow: {
        panel: '0 18px 48px rgba(0, 0, 0, 0.24)',
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
};
