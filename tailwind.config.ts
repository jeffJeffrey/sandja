// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Couleurs SANDJA - Thème africain
      colors: {
        // Couleur principale - Brun terre
        primary: {
          50: "#FDF8F3",
          100: "#F5E6D3",
          200: "#E8C9A8",
          300: "#D4A574",
          400: "#C08040",
          500: "#8B4513",
          600: "#723A10",
          700: "#5A2E0D",
          800: "#42220A",
          900: "#2A1606",
          DEFAULT: "#8B4513",
        },
        // Couleur secondaire - Orange chocolat
        secondary: {
          50: "#FFF5EB",
          100: "#FFE5CC",
          200: "#FFCC99",
          300: "#E8A35C",
          400: "#D2691E",
          500: "#A85216",
          600: "#8B4513",
          700: "#6B3410",
          800: "#4A240B",
          900: "#2A1406",
          DEFAULT: "#D2691E",
        },
        // Accents africains
        accent: {
          gold: "#DAA520",
          "gold-light": "#FFD700",
          "gold-dark": "#B8860B",
          red: "#B22222",
          "red-light": "#CD5C5C",
          "red-dark": "#8B0000",
          blue: "#4169E1",
          "blue-light": "#6495ED",
          "blue-dark": "#191970",
          green: "#228B22",
          "green-light": "#90EE90",
          "green-dark": "#006400",
        },
        // Arrière-plans
        cream: {
          50: "#FFFAF0",
          100: "#FFF8DC",
          200: "#F5DEB3",
          DEFAULT: "#FFF8DC",
        },
        earth: {
          50: "#FDF8F3",
          100: "#F5E6D3",
          200: "#E8C9A8",
          DEFAULT: "#F5E6D3",
        },
      },
      
      // Polices
      fontFamily: {
        heading: ["var(--font-playfair)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
        decorative: ["var(--font-amatic)", "cursive"],
      },
      
      // Animations
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "fade-up": "fadeUp 0.5s ease-out",
        "slide-in-right": "slideInRight 0.3s ease-out",
        "slide-in-left": "slideInLeft 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
        "spin-slow": "spin 3s linear infinite",
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "bounce-slow": "bounce 2s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      
      // Espacements
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "128": "32rem",
      },
      
      // Border radius
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      
      // Ombres
      boxShadow: {
        "african": "0 4px 20px rgba(139, 69, 19, 0.15)",
        "african-lg": "0 10px 40px rgba(139, 69, 19, 0.2)",
        "gold": "0 0 20px rgba(218, 165, 32, 0.3)",
        "inner-african": "inset 0 2px 4px rgba(139, 69, 19, 0.1)",
      },
      
      // Gradients (via classes utilitaires)
      backgroundImage: {
        "gradient-african": "linear-gradient(135deg, #D2691E 0%, #DAA520 50%, #8B4513 100%)",
        "gradient-earth": "linear-gradient(135deg, #8B4513 0%, #A85216 50%, #D2691E 100%)",
        "gradient-royal": "linear-gradient(135deg, #4169E1 0%, #191970 100%)",
        "gradient-savanna": "linear-gradient(180deg, #FDF8F3 0%, #F5E6D3 50%, #E8C9A8 100%)",
        "gradient-night": "linear-gradient(180deg, #1A1A1A 0%, #2A1606 100%)",
        "pattern-zigzag": "url('/images/patterns/zigzag.svg')",
        "pattern-ndop": "url('/images/patterns/ndop.svg')",
        "pattern-kente": "url('/images/patterns/kente.svg')",
      },
      
      // Transitions
      transitionDuration: {
        "400": "400ms",
      },
      
      // Z-index
      zIndex: {
        "60": "60",
        "70": "70",
        "80": "80",
        "90": "90",
        "100": "100",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
};

export default config;
