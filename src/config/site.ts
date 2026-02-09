export const siteConfig = {
  name: "SANDJA",
  tagline: {
    fr: "Redonner sens et valeur au pagne africain",
    en: "Restoring meaning and value to African cloth",
  },
  description: {
    fr: "Plateforme culturelle et technologique pour la préservation et la valorisation du patrimoine textile africain",
    en: "Cultural and technological platform for the preservation and promotion of African textile heritage",
  },

  url: process.env.NEXT_PUBLIC_APP_URL || "https://sandja.app",

  contact: {
    email: "contact@sandja.app",
    phone: "+237 6XX XXX XXX",
    address: "Dschang, Cameroun",
  },

  social: [
    { label: "Twitter", href: "https://twitter.com/sandja_app" },
    { label: "Instagram", href: "https://instagram.com/sandja_app" },
    { label: "Facebook", href: "https://facebook.com/sandja_app" },
    { label: "LinkedIn", href: "https://linkedin.com/company/sandja" },
    { label: "TikTok", href: "https://tiktok.com/@sandja_app" },
  ],

  links: {
    docs: "https://docs.sandja.app",
    support: "https://support.sandja.app",
    privacy: "/privacy-policy",
    terms: "/terms-of-service",
  },

  seo: {
    title: "SANDJA - Le Pagne du Futur",
    titleTemplate: "%s | SANDJA",
    keywords: [
      "pagne africain",
      "textile africain",
      "patrimoine culturel",
      "NFT africain",
      "Cardano",
      "culture camerounaise",
      "Ndop",
      "Bamiléké",
    ],
  },

  blockchain: {
    network: process.env.NEXT_PUBLIC_CARDANO_NETWORK || "preview",
    tokenName: "SandjaCoin",
    tokenSymbol: "SNDJ",
  },

  gamification: {
    levels: [
      {
        level: 1,
        name: { fr: "Apprenti du Ndop", en: "Ndop Apprentice" },
        xpRequired: 0,
      },
      {
        level: 2,
        name: { fr: "Initiée aux Symboles", en: "Symbol Initiate" },
        xpRequired: 100,
      },
      {
        level: 3,
        name: { fr: "Tisserand Novice", en: "Novice Weaver" },
        xpRequired: 300,
      },
      {
        level: 4,
        name: { fr: "Conteur de Motifs", en: "Pattern Storyteller" },
        xpRequired: 600,
      },
      {
        level: 5,
        name: { fr: "Sage du Pagne", en: "Cloth Sage" },
        xpRequired: 1000,
      },
      {
        level: 6,
        name: { fr: "Maître Tisserand", en: "Master Weaver" },
        xpRequired: 1500,
      },
      {
        level: 7,
        name: { fr: "Gardien des Symboles", en: "Symbol Guardian" },
        xpRequired: 2500,
      },
      {
        level: 8,
        name: { fr: "Ancien du Village", en: "Village Elder" },
        xpRequired: 4000,
      },
      {
        level: 9,
        name: { fr: "Grand Initié", en: "Grand Initiate" },
        xpRequired: 6000,
      },
      {
        level: 10,
        name: { fr: "Légende Vivante", en: "Living Legend" },
        xpRequired: 10000,
      },
    ],
    xpRewards: {
      quizComplete: 50,
      symbolLearned: 10,
      pagneScanned: 25,
      purchaseMade: 100,
      reviewWritten: 30,
      dailyLogin: 5,
    },
  },

  currencies: {
    primary: "ADA",
    display: ["ADA", "XAF", "EUR", "USD"],
    rates: {
      ADA_XAF: 350,
      ADA_EUR: 0.58,
      ADA_USD: 0.63,
    },
  },

  ceremonies: [
    { id: "marriage", icon: "💍", key: "ceremonies.marriage" },
    { id: "funeral", icon: "🕯️", key: "ceremonies.funeral" },
    { id: "royalty", icon: "👑", key: "ceremonies.royalty" },
    { id: "initiation", icon: "🌱", key: "ceremonies.initiation" },
    { id: "birth", icon: "👶", key: "ceremonies.birth" },
    { id: "festival", icon: "🎉", key: "ceremonies.festival" },
    { id: "everyday", icon: "☀️", key: "ceremonies.everyday" },
  ],

  regions: [
    { id: "cameroon-west", country: "Cameroun", area: "Ouest" },
    { id: "cameroon-northwest", country: "Cameroun", area: "Nord-Ouest" },
    { id: "cameroon-center", country: "Cameroun", area: "Centre" },
    { id: "ghana", country: "Ghana", area: "Ashanti" },
    { id: "nigeria", country: "Nigeria", area: "Yoruba" },
    { id: "mali", country: "Mali", area: "Dogon" },
    { id: "senegal", country: "Sénégal", area: "Casamance" },
    { id: "cote-ivoire", country: "Côte d'Ivoire", area: "Baoulé" },
    { id: "drc", country: "RD Congo", area: "Kuba" },
    { id: "ethiopia", country: "Éthiopie", area: "Habesha" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
