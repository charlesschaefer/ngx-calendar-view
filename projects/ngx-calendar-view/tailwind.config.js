/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./projects/**/*.{html,ts,css,scss}",
    ],
    theme: {
      extend: {
        colors: {
          calendar: {
            // Base Colors
            primary: 'var(--calendar-primary, #2563eb)',
            secondary: 'var(--calendar-secondary, #64748b)',
            background: 'var(--calendar-background, #ffffff)',
            surface: 'var(--calendar-surface, #f8fafc)',
            border: 'var(--calendar-border, #e2e8f0)',
            text: 'var(--calendar-text, #1e293b)',
            'text-secondary': 'var(--calendar-text-secondary, #64748b)',
            
            // Additional Colors
            success: 'var(--calendar-success, #10b981)',
            warning: 'var(--calendar-warning, #f59e0b)',
            error: 'var(--calendar-error, #ef4444)',
            info: 'var(--calendar-info, #3b82f6)',
            
            // Neutral Colors
            'gray-50': 'var(--calendar-gray-50, #f9fafb)',
            'gray-100': 'var(--calendar-gray-100, #f3f4f6)',
            'gray-200': 'var(--calendar-gray-200, #e5e7eb)',
            'gray-300': 'var(--calendar-gray-300, #d1d5db)',
            'gray-400': 'var(--calendar-gray-400, #9ca3af)',
            'gray-500': 'var(--calendar-gray-500, #6b7280)',
            'gray-600': 'var(--calendar-gray-600, #4b5563)',
            'gray-700': 'var(--calendar-gray-700, #374151)',
            'gray-800': 'var(--calendar-gray-800, #1f2937)',
            'gray-900': 'var(--calendar-gray-900, #111827)',
          }
        },
        boxShadow: {
          'calendar-sm': 'var(--calendar-shadow-sm, 0 1px 2px rgba(0, 0, 0, 0.05))',
          'calendar-md': 'var(--calendar-shadow-md, 0 2px 4px rgba(0, 0, 0, 0.1))',
          'calendar-lg': 'var(--calendar-shadow-lg, 0 2px 8px rgba(0, 0, 0, 0.15))',
          'calendar-xl': 'var(--calendar-shadow-xl, 0 4px 12px rgba(0, 0, 0, 0.15))',
          'calendar-2xl': 'var(--calendar-shadow-2xl, 0 8px 25px rgba(0, 0, 0, 0.25))',
          'calendar-primary': 'var(--calendar-shadow-primary, 0 2px 4px rgba(37, 99, 235, 0.3))',
          'calendar-primary-lg': 'var(--calendar-shadow-primary-lg, 0 4px 12px rgba(37, 99, 235, 0.3))',
          'calendar-inset': 'var(--calendar-shadow-inset, inset 0 0 0 2px rgba(59, 130, 246, 0.3))',
          'calendar-inset-hover': 'var(--calendar-shadow-inset-hover, inset 0 0 0 2px rgba(59, 130, 246, 0.5))',
        },
        borderRadius: {
          'calendar-sm': 'var(--calendar-radius-sm, 0.25rem)',
          'calendar-md': 'var(--calendar-radius-md, 0.375rem)',
          'calendar-lg': 'var(--calendar-radius-lg, 0.5rem)',
          'calendar-xl': 'var(--calendar-radius-xl, 0.75rem)',
        },
        spacing: {
          'calendar-xs': 'var(--calendar-spacing-xs, 0.125rem)',
          'calendar-sm': 'var(--calendar-spacing-sm, 0.25rem)',
          'calendar-md': 'var(--calendar-spacing-md, 0.5rem)',
          'calendar-lg': 'var(--calendar-spacing-lg, 0.75rem)',
          'calendar-xl': 'var(--calendar-spacing-xl, 1rem)',
          'calendar-2xl': 'var(--calendar-spacing-2xl, 1.5rem)',
          'calendar-3xl': 'var(--calendar-spacing-3xl, 2rem)',
          '18': '4.5rem',
          '88': '22rem',
        },
        fontSize: {
          'calendar-xs': ['var(--calendar-font-size-xs, 0.6875rem)', { lineHeight: 'var(--calendar-line-height-tight, 1.2)' }],
          'calendar-sm': ['var(--calendar-font-size-sm, 0.75rem)', { lineHeight: 'var(--calendar-line-height-normal, 1.3)' }],
          'calendar-base': ['var(--calendar-font-size-base, 0.875rem)', { lineHeight: 'var(--calendar-line-height-normal, 1.3)' }],
          'calendar-lg': ['var(--calendar-font-size-lg, 1rem)', { lineHeight: 'var(--calendar-line-height-tight, 1.2)' }],
          'calendar-xl': ['var(--calendar-font-size-xl, 1.125rem)', { lineHeight: 'var(--calendar-line-height-tight, 1.2)' }],
          'calendar-2xl': ['var(--calendar-font-size-2xl, 1.25rem)', { lineHeight: 'var(--calendar-line-height-tight, 1.2)' }],
          'xs': ['0.75rem', { lineHeight: '1rem' }],
        },
        fontWeight: {
          'calendar-normal': 'var(--calendar-font-weight-normal, 400)',
          'calendar-medium': 'var(--calendar-font-weight-medium, 500)',
          'calendar-semibold': 'var(--calendar-font-weight-semibold, 600)',
          'calendar-bold': 'var(--calendar-font-weight-bold, 700)',
        },
        transitionDuration: {
          'calendar-fast': 'var(--calendar-transition-fast, 0.15s)',
          'calendar-normal': 'var(--calendar-transition-normal, 0.2s)',
          'calendar-slow': 'var(--calendar-transition-slow, 0.3s)',
        },
        zIndex: {
          'calendar-dropdown': 'var(--calendar-z-dropdown, 10)',
          'calendar-sticky': 'var(--calendar-z-sticky, 20)',
          'calendar-modal': 'var(--calendar-z-modal, 1000)',
          'calendar-popover': 'var(--calendar-z-popover, 9999)',
        },
        minHeight: {
          'slot': '2rem',
        }
      },
    },
    plugins: [],
    prefix: 'ncv-'
  }
  