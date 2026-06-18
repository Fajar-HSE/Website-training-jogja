module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        // Navy biru — warna utama brand
        primary: {
          900: '#0B1F3A',
          800: '#0D2646',
          700: '#122E54',
          600: '#123458',   // alias halaman baru
          500: '#1a4d7a',
        },
        // Hijau — K3 / lingkungan
        secondary: {
          900: '#0F766E',   // teal (halaman lama)
          800: '#2F6B3B',   // hijau hutan (halaman baru)
          700: '#115E5A',
          600: '#25522e',
        },
        // Amber / gold — CTA & sertifikasi
        accent: {
          500: '#D4A017',
          600: '#AB7F12',
          400: '#F59E0B',   // amber lebih cerah untuk CTA
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
