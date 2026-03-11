/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        gh: {
          bg:           '#07090f',
          card:         '#0e1422',
          border:       '#1a2035',
          'border-hover': '#2a3a6e',
          accent:       '#3b5fc0',
          light:        '#6389ff',
          muted:        '#4a5568',
          body:         '#e2e8f0',
          navy:         '#1e3a8a',
          pill:         '#111827',
        },
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans:    ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
