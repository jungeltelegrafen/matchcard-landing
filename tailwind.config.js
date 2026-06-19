/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        accent:  { DEFAULT: '#C97B4B', light: '#F5E6D8', soft: '#F0E0CE' },
        primary: '#1A1A2E',
        bg:      '#F5EFE6',
        surface: '#FDFAF6',
        card:    '#FFFFFF',
        border:  '#E8DFD0',
        tx:      { DEFAULT: '#2B1E10', muted: '#7A6452' },
      },
      fontFamily: {
        sans: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '18px',
      },
      boxShadow: {
        card: '0 2px 8px rgba(80,50,20,0.07), 0 8px 24px rgba(80,50,20,0.05)',
        'card-hover': '0 4px 16px rgba(80,50,20,0.12), 0 16px 40px rgba(80,50,20,0.09)',
      },
      animation: {
        gradient: 'gradient 6s linear infinite',
        shimmer:  'shimmer 2.5s linear infinite',
        'border-beam': 'border-beam 4s linear infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':      { backgroundPosition: '100% 50%' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'border-beam': {
          '0%':   { offsetDistance: '0%' },
          '100%': { offsetDistance: '100%' },
        },
      },
    },
  },
  plugins: [],
}
