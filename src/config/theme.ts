// src/config/theme.ts
// Configuration du thème africain SANDJA

export const themeConfig = {
  // Palette de couleurs principale - inspirée des pagnes africains
  colors: {
    // Brun terre - Couleur principale
    primary: {
      50: "#FDF8F3",
      100: "#F5E6D3",
      200: "#E8C9A8",
      300: "#D4A574",
      400: "#C08040",
      500: "#8B4513", // Saddle Brown - couleur principale
      600: "#723A10",
      700: "#5A2E0D",
      800: "#42220A",
      900: "#2A1606",
      DEFAULT: "#8B4513"
    },
    
    // Orange chocolat - Couleur secondaire
    secondary: {
      50: "#FFF5EB",
      100: "#FFE5CC",
      200: "#FFCC99",
      300: "#E8A35C",
      400: "#D2691E", // Chocolate
      500: "#A85216",
      600: "#8B4513",
      700: "#6B3410",
      800: "#4A240B",
      900: "#2A1406",
      DEFAULT: "#D2691E"
    },
    
    // Couleurs d'accent africaines
    accent: {
      // Or africain - Richesse et royauté
      gold: {
        light: "#FFD700",
        DEFAULT: "#DAA520", // Goldenrod
        dark: "#B8860B"
      },
      // Rouge terre - Force et vitalité
      red: {
        light: "#CD5C5C",
        DEFAULT: "#B22222", // Firebrick
        dark: "#8B0000"
      },
      // Bleu Ndop - Sagesse et spiritualité
      blue: {
        light: "#6495ED",
        DEFAULT: "#4169E1", // Royal Blue
        dark: "#191970"
      },
      // Vert forêt - Nature et fertilité
      green: {
        light: "#90EE90",
        DEFAULT: "#228B22", // Forest Green
        dark: "#006400"
      },
      // Crème - Pureté
      cream: {
        light: "#FFFAF0",
        DEFAULT: "#FFF8DC", // Cornsilk
        dark: "#F5DEB3"
      },
      // Noir profond - Ancestralité
      black: {
        light: "#333333",
        DEFAULT: "#1A1A1A",
        dark: "#0D0D0D"
      }
    },
    
    // Arrière-plans
    background: {
      light: "#FDF8F3",
      cream: "#FFF8DC",
      dark: "#1A1A1A",
      pattern: "#F5E6D3"
    },
    
    // Texte
    text: {
      primary: "#1A1A1A",
      secondary: "#4A4A4A",
      muted: "#6B7280",
      light: "#FFFFFF",
      accent: "#8B4513"
    }
  },
  
  // Polices
  fonts: {
    // Police pour les titres - Style africain moderne
    heading: {
      family: "'Playfair Display', serif",
      weights: [400, 500, 600, 700, 800]
    },
    // Police pour le corps de texte
    body: {
      family: "'Inter', sans-serif",
      weights: [300, 400, 500, 600, 700]
    },
    // Police décorative africaine
    decorative: {
      family: "'Amatic SC', cursive",
      weights: [400, 700]
    }
  },
  
  // Espacements
  spacing: {
    section: "6rem",
    container: "1.5rem",
    card: "1.5rem"
  },
  
  // Border radius
  borderRadius: {
    sm: "0.375rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
    full: "9999px"
  },
  
  // Ombres
  shadows: {
    sm: "0 1px 2px 0 rgba(139, 69, 19, 0.05)",
    md: "0 4px 6px -1px rgba(139, 69, 19, 0.1), 0 2px 4px -1px rgba(139, 69, 19, 0.06)",
    lg: "0 10px 15px -3px rgba(139, 69, 19, 0.1), 0 4px 6px -2px rgba(139, 69, 19, 0.05)",
    xl: "0 20px 25px -5px rgba(139, 69, 19, 0.1), 0 10px 10px -5px rgba(139, 69, 19, 0.04)",
    glow: "0 0 20px rgba(218, 165, 32, 0.3)"
  },
  
  // Animations
  animations: {
    duration: {
      fast: "150ms",
      normal: "300ms",
      slow: "500ms"
    },
    easing: {
      default: "cubic-bezier(0.4, 0, 0.2, 1)",
      bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)"
    }
  },
  
  // Gradients africains
  gradients: {
    sunset: "linear-gradient(135deg, #D2691E 0%, #DAA520 50%, #8B4513 100%)",
    earth: "linear-gradient(135deg, #8B4513 0%, #A85216 50%, #D2691E 100%)",
    royal: "linear-gradient(135deg, #4169E1 0%, #191970 100%)",
    forest: "linear-gradient(135deg, #228B22 0%, #006400 100%)",
    savanna: "linear-gradient(180deg, #FDF8F3 0%, #F5E6D3 50%, #E8C9A8 100%)",
    night: "linear-gradient(180deg, #1A1A1A 0%, #2A1606 100%)"
  }
} as const;

// Symboles décoratifs africains (classes CSS)
export const africanPatterns = {
  // Motifs géométriques
  zigzag: "african-pattern-zigzag",
  diamond: "african-pattern-diamond",
  triangle: "african-pattern-triangle",
  circle: "african-pattern-circle",
  square: "african-pattern-square",
  
  // Motifs culturels
  ndop: "african-pattern-ndop",
  kente: "african-pattern-kente",
  adinkra: "african-pattern-adinkra",
  bogolan: "african-pattern-bogolan",
  
  // Bordures décoratives
  borderTop: "african-border-top",
  borderBottom: "african-border-bottom",
  borderFull: "african-border-full"
} as const;

// Icônes africaines (emojis et symboles)
export const africanIcons = {
  mask: "🎭",
  drum: "🪘",
  lion: "🦁",
  elephant: "🐘",
  sun: "☀️",
  moon: "🌙",
  star: "⭐",
  tree: "🌳",
  mountain: "🏔️",
  river: "🌊",
  fire: "🔥",
  earth: "🌍",
  crown: "👑",
  spear: "🔱",
  shield: "🛡️",
  calabash: "🏺",
  fabric: "🧵",
  diamond: "💎"
} as const;

export type ThemeConfig = typeof themeConfig;
