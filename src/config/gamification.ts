// src/config/gamification.ts
// Configuration du système de gamification SANDJA

export interface Level {
  level: number;
  nameKey: string;
  xpRequired: number;
  icon: string;
  color: string;
  benefits: string[];
}

export interface Achievement {
  id: string;
  nameKey: string;
  descriptionKey: string;
  icon: string;
  type: AchievementType;
  requirement: number;
  xpReward: number;
  coinReward: number;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export type AchievementType = 
  | "quiz_completed"
  | "symbols_learned"
  | "pagnes_scanned"
  | "purchases_made"
  | "level_reached"
  | "streak_days"
  | "reviews_written"
  | "nfts_collected"
  | "events_attended";

// Niveaux de progression
export const levels: Level[] = [
  {
    level: 1,
    nameKey: "levels.1.name", // "Apprenti du Ndop"
    xpRequired: 0,
    icon: "🌱",
    color: "#90EE90",
    benefits: ["access_basic_content"]
  },
  {
    level: 2,
    nameKey: "levels.2.name", // "Initié aux Symboles"
    xpRequired: 100,
    icon: "📖",
    color: "#87CEEB",
    benefits: ["unlock_quiz_intermediate", "daily_bonus_x1.1"]
  },
  {
    level: 3,
    nameKey: "levels.3.name", // "Tisserand Novice"
    xpRequired: 300,
    icon: "🧵",
    color: "#DDA0DD",
    benefits: ["scanner_access", "discount_5"]
  },
  {
    level: 4,
    nameKey: "levels.4.name", // "Conteur de Motifs"
    xpRequired: 600,
    icon: "📜",
    color: "#F0E68C",
    benefits: ["audio_stories_premium", "daily_bonus_x1.2"]
  },
  {
    level: 5,
    nameKey: "levels.5.name", // "Sage du Pagne"
    xpRequired: 1000,
    icon: "🦉",
    color: "#DAA520",
    benefits: ["ar_tryout", "discount_10", "badge_display"]
  },
  {
    level: 6,
    nameKey: "levels.6.name", // "Maître Tisserand"
    xpRequired: 1500,
    icon: "👘",
    color: "#CD853F",
    benefits: ["create_custom_designs", "daily_bonus_x1.3"]
  },
  {
    level: 7,
    nameKey: "levels.7.name", // "Gardien des Symboles"
    xpRequired: 2500,
    icon: "🛡️",
    color: "#4169E1",
    benefits: ["nft_minting", "discount_15", "exclusive_events"]
  },
  {
    level: 8,
    nameKey: "levels.8.name", // "Ancien du Village"
    xpRequired: 4000,
    icon: "🏛️",
    color: "#8B4513",
    benefits: ["community_moderator", "daily_bonus_x1.5"]
  },
  {
    level: 9,
    nameKey: "levels.9.name", // "Grand Initié"
    xpRequired: 6000,
    icon: "✨",
    color: "#9400D3",
    benefits: ["early_access", "discount_20", "vip_support"]
  },
  {
    level: 10,
    nameKey: "levels.10.name", // "Légende Vivante"
    xpRequired: 10000,
    icon: "👑",
    color: "#FFD700",
    benefits: ["all_premium_features", "ambassador_status", "discount_25"]
  }
];

// Badges/Achievements
export const achievements: Achievement[] = [
  // Quiz
  {
    id: "first_quiz",
    nameKey: "achievements.first_quiz.name",
    descriptionKey: "achievements.first_quiz.description",
    icon: "📝",
    type: "quiz_completed",
    requirement: 1,
    xpReward: 25,
    coinReward: 5,
    rarity: "common"
  },
  {
    id: "quiz_master",
    nameKey: "achievements.quiz_master.name",
    descriptionKey: "achievements.quiz_master.description",
    icon: "🎓",
    type: "quiz_completed",
    requirement: 50,
    xpReward: 500,
    coinReward: 100,
    rarity: "epic"
  },
  {
    id: "perfect_score",
    nameKey: "achievements.perfect_score.name",
    descriptionKey: "achievements.perfect_score.description",
    icon: "💯",
    type: "quiz_completed",
    requirement: 1, // Score parfait
    xpReward: 100,
    coinReward: 25,
    rarity: "rare"
  },
  
  // Symboles appris
  {
    id: "symbol_explorer",
    nameKey: "achievements.symbol_explorer.name",
    descriptionKey: "achievements.symbol_explorer.description",
    icon: "🔍",
    type: "symbols_learned",
    requirement: 10,
    xpReward: 50,
    coinReward: 10,
    rarity: "common"
  },
  {
    id: "symbol_scholar",
    nameKey: "achievements.symbol_scholar.name",
    descriptionKey: "achievements.symbol_scholar.description",
    icon: "📚",
    type: "symbols_learned",
    requirement: 50,
    xpReward: 250,
    coinReward: 50,
    rarity: "rare"
  },
  {
    id: "symbol_sage",
    nameKey: "achievements.symbol_sage.name",
    descriptionKey: "achievements.symbol_sage.description",
    icon: "🧙",
    type: "symbols_learned",
    requirement: 100,
    xpReward: 1000,
    coinReward: 200,
    rarity: "legendary"
  },
  
  // Scanner
  {
    id: "first_scan",
    nameKey: "achievements.first_scan.name",
    descriptionKey: "achievements.first_scan.description",
    icon: "📷",
    type: "pagnes_scanned",
    requirement: 1,
    xpReward: 30,
    coinReward: 5,
    rarity: "common"
  },
  {
    id: "scan_collector",
    nameKey: "achievements.scan_collector.name",
    descriptionKey: "achievements.scan_collector.description",
    icon: "🖼️",
    type: "pagnes_scanned",
    requirement: 25,
    xpReward: 200,
    coinReward: 40,
    rarity: "rare"
  },
  
  // Achats
  {
    id: "first_purchase",
    nameKey: "achievements.first_purchase.name",
    descriptionKey: "achievements.first_purchase.description",
    icon: "🛒",
    type: "purchases_made",
    requirement: 1,
    xpReward: 100,
    coinReward: 20,
    rarity: "common"
  },
  {
    id: "loyal_customer",
    nameKey: "achievements.loyal_customer.name",
    descriptionKey: "achievements.loyal_customer.description",
    icon: "💎",
    type: "purchases_made",
    requirement: 10,
    xpReward: 500,
    coinReward: 100,
    rarity: "epic"
  },
  
  // NFT
  {
    id: "first_nft",
    nameKey: "achievements.first_nft.name",
    descriptionKey: "achievements.first_nft.description",
    icon: "🎨",
    type: "nfts_collected",
    requirement: 1,
    xpReward: 150,
    coinReward: 30,
    rarity: "rare"
  },
  {
    id: "nft_collector",
    nameKey: "achievements.nft_collector.name",
    descriptionKey: "achievements.nft_collector.description",
    icon: "🏆",
    type: "nfts_collected",
    requirement: 10,
    xpReward: 750,
    coinReward: 150,
    rarity: "legendary"
  },
  
  // Streak
  {
    id: "week_streak",
    nameKey: "achievements.week_streak.name",
    descriptionKey: "achievements.week_streak.description",
    icon: "🔥",
    type: "streak_days",
    requirement: 7,
    xpReward: 100,
    coinReward: 20,
    rarity: "common"
  },
  {
    id: "month_streak",
    nameKey: "achievements.month_streak.name",
    descriptionKey: "achievements.month_streak.description",
    icon: "⚡",
    type: "streak_days",
    requirement: 30,
    xpReward: 500,
    coinReward: 100,
    rarity: "epic"
  },
  
  // Événements
  {
    id: "event_goer",
    nameKey: "achievements.event_goer.name",
    descriptionKey: "achievements.event_goer.description",
    icon: "🎪",
    type: "events_attended",
    requirement: 3,
    xpReward: 200,
    coinReward: 40,
    rarity: "rare"
  }
];

// Récompenses XP
export const xpRewards = {
  // Actions quotidiennes
  dailyLogin: 5,
  dailyQuizComplete: 10,
  
  // Apprentissage
  symbolViewed: 2,
  symbolLearned: 10,
  storyListened: 15,
  quizComplete: 50,
  quizPerfectScore: 100,
  puzzleComplete: 30,
  
  // Scanner
  pagneScanned: 25,
  newPagneDiscovered: 50,
  
  // Social
  reviewWritten: 30,
  reviewHelpful: 10,
  profileComplete: 50,
  
  // Commerce
  purchaseMade: 100,
  nftMinted: 150,
  nftSold: 200,
  
  // Événements
  eventAttended: 75,
  eventTicketPurchased: 50
} as const;

// Récompenses SandjaCoin
export const coinRewards = {
  dailyLogin: 1,
  quizComplete: 5,
  quizPerfectScore: 15,
  symbolLearned: 1,
  pagneScanned: 3,
  reviewWritten: 5,
  referralSuccess: 25,
  levelUp: 10,
  achievementUnlocked: 5 // Multiplicateur selon rareté
} as const;

// Multiplicateurs de rareté pour les achievements
export const rarityMultipliers = {
  common: 1,
  rare: 2,
  epic: 3,
  legendary: 5
} as const;

// Helper pour calculer le niveau à partir des XP
export function getLevelFromXp(xp: number): Level {
  let currentLevel = levels[0];
  
  for (const level of levels) {
    if (xp >= level.xpRequired) {
      currentLevel = level;
    } else {
      break;
    }
  }
  
  return currentLevel;
}

// Helper pour calculer la progression vers le niveau suivant
export function getProgressToNextLevel(xp: number): { current: number; next: number; progress: number } {
  const currentLevel = getLevelFromXp(xp);
  const currentLevelIndex = levels.findIndex(l => l.level === currentLevel.level);
  const nextLevel = levels[currentLevelIndex + 1];
  
  if (!nextLevel) {
    return { current: xp, next: xp, progress: 100 };
  }
  
  const xpIntoCurrentLevel = xp - currentLevel.xpRequired;
  const xpNeededForNext = nextLevel.xpRequired - currentLevel.xpRequired;
  const progress = Math.floor((xpIntoCurrentLevel / xpNeededForNext) * 100);
  
  return {
    current: xpIntoCurrentLevel,
    next: xpNeededForNext,
    progress: Math.min(progress, 100)
  };
}
