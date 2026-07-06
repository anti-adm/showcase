import type {Config} from 'tailwindcss';

export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      screens: {
        '3xl': '1600px'
      },
      borderRadius: {
        '4xl': '2rem'
      },
      maxWidth: {
        190: '760px',
        235: '940px'
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', 'Arial', 'Helvetica', 'sans-serif'],
        display: ['var(--font-display)', 'Georgia', 'serif']
      },
      opacity: {
        1: '0.01',
        6: '0.06',
        8: '0.08',
        10: '0.10',
        12: '0.12',
        14: '0.14',
        16: '0.16',
        18: '0.18',
        20: '0.20',
        22: '0.22',
        24: '0.24',
        26: '0.26',
        28: '0.28',
        30: '0.30',
        32: '0.32',
        34: '0.34',
        35: '0.35',
        36: '0.36',
        38: '0.38',
        40: '0.40',
        42: '0.42',
        44: '0.44',
        45: '0.45',
        46: '0.46',
        48: '0.48',
        52: '0.52',
        54: '0.54',
        55: '0.55',
        56: '0.56',
        58: '0.58',
        62: '0.62',
        65: '0.65',
        68: '0.68',
        72: '0.72',
        78: '0.78',
        82: '0.82',
        84: '0.84',
        85: '0.85',
        86: '0.86',
        88: '0.88'
      },
      transitionDuration: {
        400: '400ms',
        520: '520ms',
        620: '620ms',
        760: '760ms',
        820: '820ms',
        980: '980ms',
        2200: '2200ms'
      },
      zIndex: {
        9: '9',
        90: '90'
      }
    }
  },
  plugins: []
} satisfies Config;
