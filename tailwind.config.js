const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1.5rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        // Structural / drafting-table palette — grounded in the subject,
        // not a generic SaaS or "warm ed-tech" default.
        structural: {
          950: '#0B1420', // deepest — near-black but blue-grounded (drafting table at night)
          900: '#0F1A2E', // primary dark surface
          800: '#16263F',
          700: '#1F3350',
          600: '#2C4468',
        },
        vellum: {
          50: '#FBFAF6',
          100: '#F7F5EF', // primary light surface — cool paper, not cream-cliché
          200: '#E8E2D0', // card surface tint
          300: '#D9D1B8',
        },
        oxide: {
          // rebar-rust accent — used sparingly, the platform's one warm note
          400: '#D97B4F',
          500: '#C4632F',
          600: '#A54F24',
        },
        steel: {
          // secondary structural accent — hatching, diagrams, links
          300: '#8FB8BD',
          400: '#6B9CA2',
          500: '#4A7C82',
          600: '#38636A',
        },
        concrete: {
          // muted greys for borders, secondary text — reads as "material" not "grey-400"
          300: '#C9C4B8',
          400: '#A9A296',
          500: '#8B8478',
          600: '#6B655B',
          700: '#4D473F',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      fontFamily: {
        // Display: condensed geometric grotesk — drafting-stencil character for headlines
        display: ['var(--font-display)', 'Arial Narrow', ...fontFamily.sans],
        // Body: humanist sans — carries Bengali + English mixed content cleanly
        sans: ['var(--font-body)', ...fontFamily.sans],
        // Mono: for specs, units, BNBC clause refs, coordinates — functional, not decorative
        mono: ['var(--font-mono)', ...fontFamily.mono],
        bengali: ['var(--font-bengali)', ...fontFamily.sans],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      backgroundImage: {
        // Grid-paper texture — structural, not decorative (echoes drafting sheets)
        'grid-paper':
          'linear-gradient(hsl(var(--grid-line)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--grid-line)) 1px, transparent 1px)',
        'blueprint-fade':
          'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(74,124,130,0.15), transparent)',
      },
      backgroundSize: {
        'grid-sm': '24px 24px',
        'grid-lg': '64px 64px',
      },
      keyframes: {
        'draw-line': {
          from: { strokeDashoffset: '1000' },
          to: { strokeDashoffset: '0' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'draw-line': 'draw-line 1.8s ease-out forwards',
        'fade-up': 'fade-up 0.6s ease-out forwards',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
