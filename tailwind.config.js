/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        space: ["'Space Grotesk'", 'sans-serif'],
        dmsans: ["'DM Sans'", 'sans-serif'],
        bricolage: ["'Bricolage Grotesque'", 'Inter', 'sans-serif'],
        sans: ["'DM Sans'", 'Inter', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', "'JetBrains Mono'", 'monospace'],
      },
      boxShadow: {
        'neo': '6px 6px 0px #0A0A12',
        'neo-sm': '3px 3px 0px #0A0A12',
        'neo-lg': '8px 8px 0px #0A0A12',
      },
      colors: {
        electric: '#2340FF',
        cyber: '#FFD84D',
        obsidian: '#0A0A12',
        lavender: '#E8ECFF',
        mint: '#7CFFB2',
        canvas: '#F3F4F8',
        folio: {
          bg: '#F3F4F8',
          secondary: '#E8ECFF',
          card: '#FFFFFF',
          border: '#0A0A12',
          primary: '#2340FF',
          bright: '#2340FF',
          accent: '#FFD84D',
          success: '#7CFFB2',
          text: '#0A0A12',
          muted: '#55586B',
          destructive: '#C0392B',
        },
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#0f0e26',
        }
      },
      animation: {
        'blob': 'blob 8s infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'gradient-x': 'gradient-x 12s ease infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'shake': 'shake 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97) both',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -40px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.95)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.98)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shake: {
          '10%, 90%': { transform: 'translateX(-1px)' },
          '20%, 80%': { transform: 'translateX(2px)' },
          '30%, 50%, 70%': { transform: 'translateX(-4px)' },
          '40%, 60%': { transform: 'translateX(4px)' },
        }
      }
    },
  },
  plugins: [],
}
