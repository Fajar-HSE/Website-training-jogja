module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          900: '#0B1F3A',
          800: '#0D2646',
          700: '#122E54'
        },
        secondary: {
          900: '#0F766E',
          700: '#115E5A'
        },
        accent: {
          500: '#D4A017',
          600: '#AB7F12'
        },
        neutral: {
          50: '#FFFFFF',
          100: '#FAFAF9',
          200: '#F4F6F8',
          500: '#64748B'
        }
      },
      fontFamily: {
        heading: ['Plus Jakarta Sans', 'Manrope', 'Inter', 'ui-sans-serif', 'system-ui'],
        body: ['Inter', 'ui-sans-serif', 'system-ui']
      },
      lineHeight: {
        relaxed: '1.8'
      }
    }
  },
  plugins: []
}
