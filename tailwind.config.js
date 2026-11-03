/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#080808',
        charcoal: '#151515',
        coal: '#0D0D0D',
        orange: '#FF6B27',
        gold: '#FFB15C',
        bone: '#F2ECE3',
        smoke: '#91887F',
      },
      fontFamily: {
        sans: ['Inter Variable', 'Inter', 'sans-serif'],
        display: ['Poppins', 'Inter', 'sans-serif'],
        tamil: ['Noto Sans Tamil', 'sans-serif'],
        urdu: ['Noto Nastaliq Urdu', 'serif'],
      },
      letterSpacing: {
        widest: '0.18em',
      },
      opacity: {
        8: '0.08',
        12: '0.12',
        15: '0.15',
        18: '0.18',
        22: '0.22',
        28: '0.28',
        32: '0.32',
        35: '0.35',
        38: '0.38',
        42: '0.42',
        45: '0.45',
        48: '0.48',
        52: '0.52',
        55: '0.55',
        58: '0.58',
        62: '0.62',
        65: '0.65',
        68: '0.68',
        72: '0.72',
        78: '0.78',
        82: '0.82',
        85: '0.85',
        88: '0.88',
        92: '0.92',
      },
      transitionTimingFunction: {
        cinematic: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      screens: {
        xs: '420px',
      },
    },
  },
  plugins: [],
}
