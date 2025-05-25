/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./{App,index}.tsx",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./content/**/*.md", // Assuming markdown might contain classes eventually
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...require('tailwindcss/defaultTheme').fontFamily.sans],
      },
      typography: ({ theme }) => ({
        DEFAULT: { // This targets prose directly
          css: {
            'h1, h2, h3, h4, h5, h6': {
              'font-weight': 'bold', // Ensure all headings are bold by default
              'line-height': '1.3',
            },
            h1: {
              'font-size': theme('fontSize.3xl'), // Base size for mobile
              'margin-bottom': theme('spacing.4'),
              '@screen sm': { // Tablet and larger
                'font-size': theme('fontSize.4xl'),
              },
            },
            h2: {
              'font-size': theme('fontSize.2xl'), // Base size for mobile
              'margin-bottom': theme('spacing.3'),
              '@screen sm': { // Tablet and larger
                'font-size': theme('fontSize.3xl'),
              },
            },
            h3: {
              'font-size': theme('fontSize.xl'), // Base size for mobile
              'margin-bottom': theme('spacing.2'),
              '@screen sm': { // Tablet and larger
                'font-size': theme('fontSize.2xl'),
              },
            },
            p: {
              'margin-bottom': theme('spacing.4'), // Add space between paragraphs
              'line-height': '1.7', // Improve paragraph readability
            },
            'ul, ol': {
              'margin-bottom': theme('spacing.4'),
              'padding-left': theme('spacing.5'),
            },
            li: {
              'margin-bottom': theme('spacing.2'),
            },
            blockquote: {
              'font-style': 'normal',
              'padding-top': theme('spacing.3'),
              'padding-bottom': theme('spacing.3'),
              'padding-left': theme('spacing.4'),
              'padding-right': theme('spacing.4'),
              'background-color': theme('colors.slate[100]'), // Lighter background for light mode
              'border-left-width': theme('borderWidth.4'),
              'border-left-color': theme('colors.sky[600]'), // Sky color for border in light mode
              'border-radius': theme('borderRadius.md'),
              'margin-bottom': theme('spacing.6'),
              color: theme('colors.slate[700]'), // Text color for blockquotes in light mode
              p: {
                'margin-bottom': theme('spacing.3'),
              },
              'p:last-child': {
                'margin-bottom': '0',
              }
            },
          },
        },
        invert: { // This targets prose-invert
          css: {
            '--tw-prose-body': theme('colors.slate[300]'),
            '--tw-prose-headings': theme('colors.sky[300]'),
            '--tw-prose-lead': theme('colors.slate[400]'),
            '--tw-prose-links': theme('colors.sky[400]'),
            '--tw-prose-bold': theme('colors.sky[300]'),
            '--tw-prose-counters': theme('colors.slate[400]'),
            '--tw-prose-bullets': theme('colors.sky[500]'),
            '--tw-prose-hr': theme('colors.slate[700]'),
            '--tw-prose-quotes': theme('colors.slate[300]'), // Text color inside quotes
            '--tw-prose-quote-borders': 'var(--tw-prose-links)', // Border color for quotes, using link color
            '--tw-prose-captions': theme('colors.slate[400]'),
            '--tw-prose-code': theme('colors.emerald[300]'),
            '--tw-prose-pre-code': theme('colors.slate[300]'),
            '--tw-prose-pre-bg': theme('colors.slate[800]'),
            '--tw-prose-th-borders': theme('colors.slate[600]'),
            '--tw-prose-td-borders': theme('colors.slate[700]'),
            h1: {
              color: theme('colors.sky[300]'),
              'font-size': theme('fontSize.3xl'), // Base size for mobile
              'margin-bottom': theme('spacing.4'),
              '@screen sm': { // Tablet and larger
                'font-size': theme('fontSize.4xl'),
              },
            },
            h2: {
              color: theme('colors.sky[400]'),
              'font-size': theme('fontSize.2xl'), // Base size for mobile
              'margin-bottom': theme('spacing.3'),
              '@screen sm': { // Tablet and larger
                'font-size': theme('fontSize.3xl'),
              },
            },
            h3: {
              color: theme('colors.sky[500]'),
              'font-size': theme('fontSize.xl'), // Base size for mobile
              'margin-bottom': theme('spacing.2'),
              '@screen sm': { // Tablet and larger
                'font-size': theme('fontSize.2xl'),
              },
            },
            strong: { color: theme('colors.sky[300]') },
            code: {
              'background-color': theme('colors.slate[700]'),
              'padding': '0.2em 0.4em',
              'border-radius': theme('borderRadius.md'),
              'font-size': theme('fontSize.sm'),
            },
            pre: {
              'background-color': 'var(--tw-prose-pre-bg)',
              'padding': theme('spacing.4'),
              'border-radius': theme('borderRadius.md'),
            },
            blockquote: {
              'font-style': 'normal',
              'padding-top': theme('spacing.3'),
              'padding-bottom': theme('spacing.3'),
              'padding-left': theme('spacing.4'),
              'padding-right': theme('spacing.4'),
              'background-color': theme('colors.slate[700]'),
              'border-left-width': theme('borderWidth.4'),
              'border-left-color': 'var(--tw-prose-quote-borders)', // Use the variable for border color
              'border-radius': theme('borderRadius.md'),
              'margin-bottom': theme('spacing.6'),
              color: 'var(--tw-prose-quotes)', // Use the variable for text color
              p: {
                'margin-bottom': theme('spacing.3'),
              },
              'p:last-child': {
                'margin-bottom': '0',
              }
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
