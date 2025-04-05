import defaultTheme from 'tailwindcss/defaultTheme';
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        black: {
          DEFAULT: '#000807',
          100: '#000202',
          200: '#000404',
          300: '#000605',
          400: '#000807',
          500: '#000807',
          600: '#006e61',
          700: '#00d2ba',
          800: '#37ffe8',
          900: '#9bfff3',
        },
        cool_gray: {
          DEFAULT: '#a2a3bb',
          100: '#1d1e28',
          200: '#3a3b50',
          300: '#575979',
          400: '#78799d',
          500: '#a2a3bb',
          600: '#b3b4c8',
          700: '#c6c7d6',
          800: '#d9d9e4',
          900: '#ececf1',
        },
        tropical_indigo: {
          DEFAULT: '#9395d3',
          100: '#151633',
          200: '#292b65',
          300: '#3e4198',
          400: '#6063be',
          500: '#9395d3',
          600: '#a8aadc',
          700: '#bebfe4',
          800: '#d4d4ed',
          900: '#e9eaf6',
        },
        periwinkle: {
          DEFAULT: '#b3b7ee',
          100: '#0f1344',
          200: '#1f2688',
          300: '#2e39cc',
          400: '#7077df',
          500: '#b3b7ee',
          600: '#c3c6f1',
          700: '#d2d4f5',
          800: '#e1e3f8',
          900: '#f0f1fc',
        },
        ghost_white: {
          DEFAULT: '#fbf9ff',
          100: '#220065',
          200: '#4300ca',
          300: '#7530ff',
          400: '#b895ff',
          500: '#fbf9ff',
          600: '#fcfbff',
          700: '#fdfcff',
          800: '#fefdff',
          900: '#fefeff',
        },
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};

export default config;