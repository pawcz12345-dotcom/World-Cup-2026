/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── Dark FIFA navy — surface colours (from the ball's deep blue outlines)
        'wc-navy': {
          50:  '#EBF2FF',
          100: '#C6D8FF',
          200: '#90B3FF',
          300: '#5888E8',
          400: '#3065C8',
          500: '#1C4AA8',
          600: '#133484',
          700: '#0C2260',
          800: '#071540',
          900: '#040D28',
          950: '#02071A',
        },
        // ── FIFA sky blue — primary accent (the big cyan panel on the ball)
        'wc-blue': {
          50:  '#E5F8FF',
          100: '#BAEEFF',
          200: '#7CDFFF',
          300: '#36CCFF',
          400: '#00B8F5',
          500: '#009DDA',  // main
          600: '#0081B8',
          700: '#006290',
          800: '#004568',
          900: '#002A42',
          950: '#001626',
        },
        // ── Mexico / FIFA green — secondary accent
        'wc-green': {
          50:  '#E5FFF1',
          100: '#B8FFD9',
          200: '#74F5B3',
          300: '#30E488',
          400: '#00C963',
          500: '#00A648',  // main
          600: '#00843A',
          700: '#00632C',
          800: '#00421D',
          900: '#00230F',
          950: '#001208',
        },
        // ── USA / Canada red — tertiary accent
        'wc-red': {
          50:  '#FFF0F0',
          100: '#FFD6D8',
          200: '#FFAAAE',
          300: '#FF7A82',
          400: '#F5424E',
          500: '#E22030',  // main
          600: '#B51525',
          700: '#880F1B',
          800: '#5B0A12',
          900: '#30050A',
          950: '#180205',
        },
        // ── FIFA Trophy gold — points / prestige
        'wc-gold': {
          50:  '#FCF5E8',
          100: '#F7E3B8',
          200: '#EDCC7A',
          300: '#E0B040',
          400: '#CC9520',
          500: '#B07818',
          600: '#8C5E12',
          700: '#68450D',
          800: '#462F09',
          900: '#251905',
        },
      },
    },
  },
  plugins: [],
};
