import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FDFCF7',
          100: '#FBF7EB',
          200: '#F5ECCF',
          300: '#EFDFAB',
          400: '#E7CE7F',
          500: '#D4AF37', // Primary warm classic gold
          600: '#BE9B2C',
          700: '#9B7D1D',
          800: '#755E14',
          900: '#4D3D0B',
          950: '#2A2105',
          accent: '#F3D279',
          light: '#F8E9C0',
          dark: '#9A7921',
        },
        dark: {
          950: '#07080A', // Deep obsidian canvas
          900: '#0C0E12', // Primary dark surface
          850: '#12151B', // Elevated card surface
          800: '#181C24', // Interactive hover surface
          750: '#1F242F', // Higher surface
          700: '#2A303F', // Elevated borders
          600: '#3D4559',
          500: '#5C667E',
          400: '#8C97B0',
          300: '#B8C0D4',
          200: '#DCE0EB',
          100: '#F0F2F7',
          border: '#202532',
          borderLight: 'rgba(255, 255, 255, 0.08)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'gold-sm': '0 2px 10px -2px rgba(212, 175, 55, 0.18)',
        'gold-md': '0 6px 24px -4px rgba(212, 175, 55, 0.28)',
        'gold-lg': '0 12px 36px -6px rgba(212, 175, 55, 0.35)',
        'gold-glow': '0 0 40px -5px rgba(212, 175, 55, 0.3)',
        'card-dark': '0 10px 30px -5px rgba(0, 0, 0, 0.7)',
        'card-hover': '0 18px 45px -8px rgba(0, 0, 0, 0.85), 0 0 25px -4px rgba(212, 175, 55, 0.15)',
      },
      backgroundImage: {
        'gold-metallic': 'linear-gradient(135deg, #ECC86A 0%, #D4AF37 40%, #B89326 75%, #8A6A12 100%)',
        'gold-shimmer': 'linear-gradient(90deg, #D4AF37 0%, #FFF0BA 50%, #D4AF37 100%)',
        'dark-mesh': 'radial-gradient(at 0% 0%, rgba(212, 175, 55, 0.08) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(30, 41, 59, 0.3) 0px, transparent 50%)',
      }
    },
  },
  plugins: [],
};

export default config;
