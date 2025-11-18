/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{ts,tsx,js,jsx}",
    "./src/components/**/*.{ts,tsx,js,jsx}",
    "./src/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-montserrat)', 'sans-serif'],
      },
      colors: {
        // Brand colors
        'brand': {
          'purple': '#322c4e',
          'dark-purple': '#1f1837',
          'gold': '#d0bf86',
        },

        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        primary: {
          DEFAULT: '#d0bf86',
          foreground: '#322c4e',
        },

        secondary: {
          DEFAULT: '#1f1837',
          foreground: '#ffffff',
        },

        destructive: "hsl(var(--destructive))",
        "destructive-foreground": "hsl(var(--destructive-foreground))",

        muted: {
          DEFAULT: 'rgba(255, 255, 255, 0.1)',
          foreground: 'rgba(255, 255, 255, 0.7)',
        },

        accent: {
          DEFAULT: 'rgba(208, 191, 134, 0.2)',
          foreground: '#d0bf86',
        },

        popover: "hsl(var(--popover))",
        "popover-foreground": "hsl(var(--popover-foreground))",

        card: {
          DEFAULT: 'rgba(31, 24, 55, 0.4)',
          foreground: '#ffffff',
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
      },
    },
  },
  plugins: [],
};
