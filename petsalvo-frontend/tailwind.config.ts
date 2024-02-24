import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        main: {
          DEFAULT: '#2EC4B6',
          variant: '#CBF3F0',
        },
        secondary: {
          DEFAULT: '#FF9F1C',
          variant: '#FFBF69',
        },
        purple: {
          DEFAULT: '#7283F6',
          variant: '#AEB8FE',
        },
        gray: {
          DEFAULT: '#9B9B9B',
          variant: '#CDCDCD',
        },
        deny: {
          DEFAULT: '#E76767',
          variant: '#E76767',
        },
        background: '#F9F7F3',
        error: '#FF0000',
      },
      flex: {
        '2': '2 2 0%'
      }
    },
  },
  plugins: [],
}
export default config
