// src/types/index.ts
// Types principaux pour SANDJA

// ============================================
// USER
// ============================================
export interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: UserRole;
  level: number;
  xp: number;
  sandjaCoin: number;
  streak: number;
  walletAddress?: string | null;
  locale: string;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = "USER" | "ARTISAN" | "ADMIN";

// ============================================
// SYMBOL
// ============================================
export interface Symbol {
  id: string;
  slug: string;
  nameKey: string;
  descriptionKey: string;
  meaningKey: string;
  historyKey?: string | null;
  images: string[];
  audioUrl?: string | null;
  videoUrl?: string | null;
  category: SymbolCategory;
  themes: SymbolTheme[];
  regionId: string;
  region?: Region;
  isPublished: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type SymbolCategory =
  | "GEOMETRIC"
  | "ANIMAL"
  | "PLANT"
  | "HUMAN"
  | "ABSTRACT"
  | "CELESTIAL"
  | "OBJECT";

export type SymbolTheme =
  | "MARRIAGE"
  | "FUNERAL"
  | "ROYALTY"
  | "INITIATION"
  | "FERTILITY"
  | "WISDOM"
  | "POWER"
  | "FRIENDSHIP"
  | "WAR"
  | "BIRTH"
  | "DEATH"
  | "FESTIVAL"
  | "PROTECTION"
  | "PROSPERITY"
  | "LOVE"
  | "UNITY";

// ============================================
// REGION
// ============================================
export interface Region {
  id: string;
  slug: string;
  nameKey: string;
  descriptionKey: string;
  country: string;
  area?: string | null;
  coordinates?: { lat: number; lng: number } | null;
  imageUrl?: string | null;
  flagUrl?: string | null;
  isPublished: boolean;
  symbols?: Symbol[];
  pagnes?: Pagne[];
}

// ============================================
// PAGNE
// ============================================
export interface Pagne {
  id: string;
  slug: string;
  nameKey: string;
  descriptionKey: string;
  storyKey?: string | null;
  images: string[];
  model3dUrl?: string | null;
  audioUrl?: string | null;
  ceremonies: SymbolTheme[];
  regionId: string;
  region?: Region;
  symbols?: PagneSymbol[];
  isPublished: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PagneSymbol {
  id: string;
  pagneId: string;
  symbolId: string;
  symbol?: Symbol;
  position?: { x: number; y: number } | null;
}

// ============================================
// PRODUCT
// ============================================
export interface Product {
  id: string;
  slug: string;
  nameKey: string;
  descriptionKey: string;
  price: number;
  currency: string;
  type: ProductType;
  images: string[];
  pagneId?: string | null;
  pagne?: Pagne | null;
  designId?: string | null;
  stock?: number | null;
  isAvailable: boolean;
  isFeatured: boolean;
  reviews?: Review[];
  createdAt: Date;
  updatedAt: Date;
}

export type ProductType = "PHYSICAL_PAGNE" | "DIGITAL_DESIGN" | "NFT" | "PRINT_LICENSE";

// ============================================
// ORDER
// ============================================
export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  user?: User;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  status: OrderStatus;
  shippingAddress?: ShippingAddress | null;
  paymentMethod?: string | null;
  paymentTxHash?: string | null;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product?: Product;
  quantity: number;
  price: number;
}

export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  region?: string;
  postalCode?: string;
  country: string;
}

// ============================================
// REVIEW
// ============================================
export interface Review {
  id: string;
  rating: number;
  comment?: string | null;
  userId: string;
  user?: User;
  productId: string;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// NFT
// ============================================
export interface NFT {
  id: string;
  name: string;
  description?: string | null;
  imageUrl: string;
  metadataUrl: string;
  policyId?: string | null;
  assetName?: string | null;
  txHash?: string | null;
  ownerId: string;
  owner?: User;
  pagneId?: string | null;
  pagne?: Pagne | null;
  designId?: string | null;
  isMinted: boolean;
  isListed: boolean;
  listingPrice?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// EVENT
// ============================================
export interface Event {
  id: string;
  slug: string;
  nameKey: string;
  descriptionKey: string;
  imageUrl?: string | null;
  location: string;
  coordinates?: { lat: number; lng: number } | null;
  startDate: Date;
  endDate?: Date | null;
  ticketPrice?: number | null;
  maxTickets?: number | null;
  isPublished: boolean;
  isFeatured: boolean;
  tickets?: Ticket[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Ticket {
  id: string;
  code: string;
  eventId: string;
  event?: Event;
  userId: string;
  user?: User;
  nftPolicyId?: string | null;
  nftAssetName?: string | null;
  isUsed: boolean;
  usedAt?: Date | null;
  createdAt: Date;
}

// ============================================
// QUIZ
// ============================================
export interface Quiz {
  id: string;
  slug: string;
  nameKey: string;
  descriptionKey: string;
  difficulty: QuizDifficulty;
  xpReward: number;
  coinReward: number;
  questions?: QuizQuestion[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type QuizDifficulty = "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";

export interface QuizQuestion {
  id: string;
  questionKey: string;
  options: string[];
  correctAnswer: number;
  explanationKey?: string | null;
  imageUrl?: string | null;
  quizId: string;
  symbolId?: string | null;
  symbol?: Symbol | null;
}

export interface QuizResult {
  id: string;
  score: number;
  totalQuestions: number;
  timeSpent: number;
  xpEarned: number;
  coinsEarned: number;
  userId: string;
  quizId: string;
  createdAt: Date;
}

// ============================================
// ACHIEVEMENT
// ============================================
export interface Achievement {
  id: string;
  nameKey: string;
  descriptionKey: string;
  iconUrl: string;
  type: AchievementType;
  requirement: number;
  xpReward: number;
  coinReward: number;
  rarity: AchievementRarity;
}

export type AchievementType =
  | "QUIZ_COMPLETED"
  | "SYMBOLS_LEARNED"
  | "PAGNES_SCANNED"
  | "PURCHASES_MADE"
  | "LEVEL_REACHED"
  | "STREAK_DAYS"
  | "REVIEWS_WRITTEN"
  | "NFTS_COLLECTED"
  | "EVENTS_ATTENDED";

export type AchievementRarity = "COMMON" | "RARE" | "EPIC" | "LEGENDARY";

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  achievement?: Achievement;
  unlockedAt: Date;
}

// ============================================
// DESIGN (Artisan)
// ============================================
export interface Design {
  id: string;
  name: string;
  description?: string | null;
  imageUrl: string;
  designFileUrl?: string | null;
  artisanId: string;
  artisan?: User;
  status: DesignStatus;
  rejectionReason?: string | null;
  nft?: NFT | null;
  products?: Product[];
  createdAt: Date;
  updatedAt: Date;
}

export type DesignStatus = "PENDING" | "APPROVED" | "REJECTED";

// ============================================
// CART
// ============================================
export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
}

// ============================================
// API RESPONSES
// ============================================
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasMore: boolean;
}

// ============================================
// FILTERS
// ============================================
export interface SymbolFilters {
  search?: string;
  category?: SymbolCategory | null;
  theme?: SymbolTheme | null;
  regionId?: string | null;
}

export interface ProductFilters {
  search?: string;
  type?: ProductType | null;
  regionId?: string | null;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// ============================================
// WALLET / BLOCKCHAIN
// ============================================
export interface WalletState {
  isConnected: boolean;
  address: string | null;
  balance: number;
  walletName: string | null;
  networkId: number | null;
}

export interface WalletAsset {
  unit: string;
  quantity: string;
  policyId: string;
  assetName: string;
  metadata?: NFTMetadata;
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  mediaType: string;
  attributes: {
    trait_type: string;
    value: string;
  }[];
  sandja?: {
    pagneId?: string;
    designId?: string;
    symbolIds?: string[];
    regionId?: string;
    ceremonyType?: string;
    artisanId?: string;
    createdAt: string;
    edition?: number;
    maxEdition?: number;
  };
}

// ============================================
// SCANNER
// ============================================
export interface ScanResult {
  success: boolean;
  pagne?: Pagne | null;
  confidence: number;
  suggestions?: Pagne[];
  imageUrl?: string;
}

// ============================================
// GAMIFICATION
// ============================================
export interface LevelInfo {
  level: number;
  nameKey: string;
  xpRequired: number;
  icon: string;
  color: string;
  benefits: string[];
}

export interface ProgressInfo {
  currentLevel: LevelInfo;
  nextLevel: LevelInfo | null;
  currentXp: number;
  xpIntoLevel: number;
  xpToNextLevel: number;
  progressPercent: number;
}

// ============================================
// FORM TYPES
// ============================================
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ReviewFormData {
  rating: number;
  comment?: string;
}

export interface CheckoutFormData {
  shippingAddress: ShippingAddress;
  paymentMethod: "ADA" | "SANDJA_COIN";
  notes?: string;
}

// ============================================
// UTILITY TYPES
// ============================================
export type Locale = "fr" | "en";

export type Theme = "light" | "dark" | "system";

export interface SelectOption {
  value: string;
  label: string;
  icon?: string;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface Tab {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  count?: number;
}

export interface MenuItem {
  key: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: number;
  isNew?: boolean;
  children?: MenuItem[];
}
