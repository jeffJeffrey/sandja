// src/config/patterns.ts
// Motifs africains SVG pour SANDJA

// Motif Zigzag africain
export const zigzagPattern = `
<svg width="40" height="20" viewBox="0 0 40 20" xmlns="http://www.w3.org/2000/svg">
  <path d="M0 10 L10 0 L20 10 L30 0 L40 10 L30 20 L20 10 L10 20 Z" 
        fill="currentColor" opacity="0.1"/>
</svg>
`;

// Motif Diamant/Losange
export const diamondPattern = `
<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
  <path d="M20 0 L40 20 L20 40 L0 20 Z" 
        fill="none" stroke="currentColor" stroke-width="1" opacity="0.15"/>
  <path d="M20 5 L35 20 L20 35 L5 20 Z" 
        fill="currentColor" opacity="0.05"/>
</svg>
`;

// Motif Triangle africain
export const trianglePattern = `
<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
  <polygon points="20,0 40,40 0,40" fill="currentColor" opacity="0.08"/>
  <polygon points="20,10 35,35 5,35" fill="none" stroke="currentColor" stroke-width="1" opacity="0.15"/>
</svg>
`;

// Motif inspiré du Ndop camerounais
export const ndopPattern = `
<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
  <!-- Fond -->
  <rect width="60" height="60" fill="none"/>
  <!-- Cercle central -->
  <circle cx="30" cy="30" r="12" fill="none" stroke="currentColor" stroke-width="2" opacity="0.2"/>
  <circle cx="30" cy="30" r="6" fill="currentColor" opacity="0.1"/>
  <!-- Croix -->
  <line x1="30" y1="0" x2="30" y2="60" stroke="currentColor" stroke-width="1" opacity="0.1"/>
  <line x1="0" y1="30" x2="60" y2="30" stroke="currentColor" stroke-width="1" opacity="0.1"/>
  <!-- Triangles aux coins -->
  <polygon points="0,0 15,0 0,15" fill="currentColor" opacity="0.08"/>
  <polygon points="60,0 45,0 60,15" fill="currentColor" opacity="0.08"/>
  <polygon points="0,60 15,60 0,45" fill="currentColor" opacity="0.08"/>
  <polygon points="60,60 45,60 60,45" fill="currentColor" opacity="0.08"/>
</svg>
`;

// Motif inspiré du Kente ghanéen
export const kentePattern = `
<svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <!-- Bandes horizontales -->
  <rect x="0" y="0" width="80" height="10" fill="currentColor" opacity="0.1"/>
  <rect x="0" y="20" width="80" height="10" fill="currentColor" opacity="0.15"/>
  <rect x="0" y="40" width="80" height="10" fill="currentColor" opacity="0.1"/>
  <rect x="0" y="60" width="80" height="10" fill="currentColor" opacity="0.15"/>
  <!-- Bandes verticales -->
  <rect x="0" y="0" width="10" height="80" fill="currentColor" opacity="0.08"/>
  <rect x="20" y="0" width="10" height="80" fill="currentColor" opacity="0.12"/>
  <rect x="40" y="0" width="10" height="80" fill="currentColor" opacity="0.08"/>
  <rect x="60" y="0" width="10" height="80" fill="currentColor" opacity="0.12"/>
</svg>
`;

// Motif Adinkra (symbole Sankofa - oiseau)
export const adinkraPattern = `
<svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
  <path d="M25 5 
           Q35 5 40 15 
           Q45 25 35 30 
           L35 40 
           Q35 45 30 45 
           L25 45 
           L25 35 
           Q20 35 15 30 
           Q5 25 10 15 
           Q15 5 25 5 Z" 
        fill="currentColor" opacity="0.1"/>
  <circle cx="30" cy="15" r="3" fill="currentColor" opacity="0.15"/>
</svg>
`;

// Motif Bogolan malien
export const bogolanPattern = `
<svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
  <!-- Fond texturé -->
  <rect width="50" height="50" fill="currentColor" opacity="0.03"/>
  <!-- Lignes organiques -->
  <path d="M0 25 Q12.5 20 25 25 Q37.5 30 50 25" 
        fill="none" stroke="currentColor" stroke-width="2" opacity="0.1"/>
  <path d="M0 12.5 Q12.5 7.5 25 12.5 Q37.5 17.5 50 12.5" 
        fill="none" stroke="currentColor" stroke-width="1" opacity="0.08"/>
  <path d="M0 37.5 Q12.5 32.5 25 37.5 Q37.5 42.5 50 37.5" 
        fill="none" stroke="currentColor" stroke-width="1" opacity="0.08"/>
  <!-- Points -->
  <circle cx="12.5" cy="12.5" r="2" fill="currentColor" opacity="0.1"/>
  <circle cx="37.5" cy="12.5" r="2" fill="currentColor" opacity="0.1"/>
  <circle cx="12.5" cy="37.5" r="2" fill="currentColor" opacity="0.1"/>
  <circle cx="37.5" cy="37.5" r="2" fill="currentColor" opacity="0.1"/>
</svg>
`;

// Bordure décorative africaine
export const africanBorder = `
<svg width="100" height="20" viewBox="0 0 100 20" xmlns="http://www.w3.org/2000/svg">
  <path d="M0 10 L5 0 L15 0 L20 10 L25 0 L35 0 L40 10 L45 0 L55 0 L60 10 L65 0 L75 0 L80 10 L85 0 L95 0 L100 10 L95 20 L85 20 L80 10 L75 20 L65 20 L60 10 L55 20 L45 20 L40 10 L35 20 L25 20 L20 10 L15 20 L5 20 Z" 
        fill="currentColor" opacity="0.15"/>
</svg>
`;

// Motif soleil africain
export const sunPattern = `
<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
  <circle cx="30" cy="30" r="10" fill="currentColor" opacity="0.15"/>
  <circle cx="30" cy="30" r="15" fill="none" stroke="currentColor" stroke-width="1" opacity="0.1"/>
  <!-- Rayons -->
  <g opacity="0.1" stroke="currentColor" stroke-width="2">
    <line x1="30" y1="0" x2="30" y2="12"/>
    <line x1="30" y1="48" x2="30" y2="60"/>
    <line x1="0" y1="30" x2="12" y2="30"/>
    <line x1="48" y1="30" x2="60" y2="30"/>
    <line x1="9" y1="9" x2="17" y2="17"/>
    <line x1="43" y1="43" x2="51" y2="51"/>
    <line x1="51" y1="9" x2="43" y2="17"/>
    <line x1="17" y1="43" x2="9" y2="51"/>
  </g>
</svg>
`;

// Configuration des patterns pour utilisation
export const patternsConfig = {
  zigzag: {
    name: "Zigzag",
    svg: zigzagPattern,
    origin: "Pan-africain",
    meaning: "Chemin de vie, hauts et bas"
  },
  diamond: {
    name: "Diamant",
    svg: diamondPattern,
    origin: "Afrique de l'Ouest",
    meaning: "Protection et fertilité"
  },
  triangle: {
    name: "Triangle",
    svg: trianglePattern,
    origin: "Pan-africain",
    meaning: "Montagne, stabilité, famille"
  },
  ndop: {
    name: "Ndop",
    svg: ndopPattern,
    origin: "Cameroun (Bamiléké)",
    meaning: "Royauté et prestige"
  },
  kente: {
    name: "Kente",
    svg: kentePattern,
    origin: "Ghana (Ashanti)",
    meaning: "Richesse et histoire"
  },
  adinkra: {
    name: "Adinkra",
    svg: adinkraPattern,
    origin: "Ghana",
    meaning: "Sagesse ancestrale"
  },
  bogolan: {
    name: "Bogolan",
    svg: bogolanPattern,
    origin: "Mali",
    meaning: "Connexion à la terre"
  },
  sun: {
    name: "Soleil",
    svg: sunPattern,
    origin: "Pan-africain",
    meaning: "Vie, énergie, divinité"
  },
  border: {
    name: "Bordure",
    svg: africanBorder,
    origin: "Pan-africain",
    meaning: "Décoration"
  }
} as const;

// Helper pour encoder en base64 pour CSS
export function patternToDataUri(svg: string): string {
  const encoded = Buffer.from(svg).toString('base64');
  return `data:image/svg+xml;base64,${encoded}`;
}

// Helper pour utiliser comme background CSS
export function getPatternBackground(patternKey: keyof typeof patternsConfig): string {
  const pattern = patternsConfig[patternKey];
  return `url("${patternToDataUri(pattern.svg)}")`;
}
