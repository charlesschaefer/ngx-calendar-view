/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}",
    "./projects/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      colors: {
        calendar: {
          primary: 'var(--calendar-primary, #2563eb)',
          secondary: 'var(--calendar-secondary, #64748b)',
          background: 'var(--calendar-background, #ffffff)',
          surface: 'var(--calendar-surface, #f8fafc)',
          border: 'var(--calendar-border, #e2e8f0)',
          text: 'var(--calendar-text, #1e293b)',
          'text-secondary': 'var(--calendar-text-secondary, #64748b)',
        }
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      minHeight: {
        'slot': '2rem',
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
      }
    },
  },
  plugins: [],
}
