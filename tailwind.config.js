/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.slate.300'),
            maxWidth: '65ch',
            a: {
              color: theme('colors.sky.400'),
              '&:hover': {
                color: theme('colors.sky.300'),
              },
              textDecoration: 'none',
              fontWeight: '500',
            },
            h1: {
              color: theme('colors.sky.300'),
              fontWeight: '800',
              marginBottom: '1.5rem',
            },
            h2: {
              color: theme('colors.sky.400'),
              fontWeight: '700',
              marginTop: '2.5rem',
              marginBottom: '1rem',
              scrollMarginTop: '5rem',
            },
            h3: {
              color: theme('colors.sky.500'),
              fontWeight: '600',
              marginTop: '2rem',
              marginBottom: '0.75rem',
            },
            h4: {
              color: theme('colors.slate.300'),
              fontWeight: '600',
              marginTop: '1.5rem',
              marginBottom: '0.5rem',
            },
            p: {
              marginTop: '1.25rem',
              marginBottom: '1.25rem',
              lineHeight: '1.7',
            },
            'ol, ul': {
              marginTop: '1.25rem',
              marginBottom: '1.25rem',
              paddingLeft: '1.5rem',
            },
            li: {
              marginTop: '0.5rem',
              marginBottom: '0.5rem',
              paddingLeft: '0.5rem',
            },
            'ol > li': {
              paddingLeft: '0.5rem',
            },
            'ul > li': {
              paddingLeft: '0.5rem',
            },
            'ul > li::before': {
              content: '""',
              width: '0.375rem',
              height: '0.375rem',
              backgroundColor: theme('colors.slate.500'),
              borderRadius: '50%',
              display: 'inline-block',
              position: 'absolute',
              left: '0',
              top: '0.75rem',
            },
            'ol > li::before': {
              color: theme('colors.slate.400'),
            },
            '> ul > li > *:last-child': {
              marginBottom: '0',
            },
            '> ul > li > *:first-child': {
              marginTop: '0',
            },
            '> ol > li > *:last-child': {
              marginBottom: '0',
            },
            '> ol > li > *:first-child': {
              marginTop: '0',
            },
            code: {
              color: theme('colors.emerald.300'),
              backgroundColor: theme('colors.slate.800'),
              padding: '0.2em 0.4em',
              borderRadius: '0.25rem',
              fontSize: '0.875rem',
              fontWeight: 'normal',
              '&::before, &::after': {
                content: '"`"',
                opacity: 0.5,
              },
            },
            pre: {
              backgroundColor: theme('colors.slate.900'),
              color: theme('colors.slate.200'),
              borderRadius: '0.375rem',
              padding: '1rem',
              overflowX: 'auto',
              marginTop: '1.5rem',
              marginBottom: '1.5rem',
              fontSize: '0.875rem',
              lineHeight: '1.5',
            },
            'pre code': {
              backgroundColor: 'transparent',
              padding: '0',
              '&::before, &::after': {
                content: 'none',
              },
            },
            blockquote: {
              color: theme('colors.slate.400'),
              borderLeftColor: theme('colors.slate.600'),
              borderLeftWidth: '0.25rem',
              paddingLeft: '1rem',
              fontStyle: 'normal',
              marginTop: '1.5rem',
              marginBottom: '1.5rem',
              '> :first-child': {
                marginTop: '0',
              },
              '> :last-child': {
                marginBottom: '0',
              },
            },
            hr: {
              borderColor: theme('colors.slate.700'),
              marginTop: '3rem',
              marginBottom: '3rem',
            },
            table: {
              width: '100%',
              marginTop: '1.5rem',
              marginBottom: '1.5rem',
              borderCollapse: 'collapse',
              fontSize: '0.875rem',
              lineHeight: '1.5',
            },
            'thead th': {
              color: theme('colors.slate.300'),
              fontWeight: '600',
              textAlign: 'left',
              backgroundColor: theme('colors.slate.800'),
              padding: '0.5rem 1rem',
              borderBottom: `1px solid ${theme('colors.slate.700')}`,
            },
            'tbody tr': {
              borderBottom: `1px solid ${theme('colors.slate.800')}`,
              '&:last-child': {
                borderBottom: 'none',
              },
            },
            'tbody td': {
              padding: '0.75rem 1rem',
              verticalAlign: 'top',
            },
            'tbody tr:nth-child(odd)': {
              backgroundColor: theme('colors.slate.900'),
            },
            'ul ul, ul ol, ol ul, ol ol': {
              marginTop: '0.5rem',
              marginBottom: '0.5rem',
            },
            'li > p': {
              marginTop: '0.75rem',
              marginBottom: '0.75rem',
            },
            'li > :first-child': {
              marginTop: '1rem',
            },
            'li > :last-child': {
              marginBottom: '1rem',
            },
            'h2 + *': {
              marginTop: '0',
            },
            'h3 + *': {
              marginTop: '0',
            },
            'h4 + *': {
              marginTop: '0',
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
};
