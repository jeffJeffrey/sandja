// src/config/navigation.ts
// Configuration de la navigation SANDJA

import {
  Home,
  Search,
  Compass,
  Camera,
  BookOpen,
  Map,
  ShoppingBag,
  Wallet,
  Calendar,
  User,
  Settings,
  LayoutDashboard,
  Palette,
  BarChart3,
  Users,
  Package,
  MessageSquare,
  HelpCircle,
  LogOut,
  type LucideIcon
} from "lucide-react";

export interface NavItem {
  key: string; // Clé i18n
  href: string;
  icon: LucideIcon;
  badge?: number;
  isNew?: boolean;
  children?: NavItem[];
}

// Navigation principale mobile (Bottom Nav)
export const mobileNavItems: NavItem[] = [
  {
    key: "nav.home",
    href: "/",
    icon: Home
  },
  {
    key: "nav.explore",
    href: "/explore",
    icon: Compass
  },
  {
    key: "nav.scanner",
    href: "/scanner",
    icon: Camera
  },
  {
    key: "nav.marketplace",
    href: "/marketplace",
    icon: ShoppingBag
  },
  {
    key: "nav.profile",
    href: "/profile",
    icon: User
  }
];

// Navigation sidebar desktop (App)
export const appSidebarItems: NavItem[] = [
  {
    key: "nav.home",
    href: "/",
    icon: Home
  },
  {
    key: "nav.explore",
    href: "/explore",
    icon: Compass
  },
  {
    key: "nav.scanner",
    href: "/scanner",
    icon: Camera,
    isNew: true
  },
  {
    key: "nav.ceremony",
    href: "/ceremony",
    icon: Search
  },
  {
    key: "nav.learn",
    href: "/learn",
    icon: BookOpen,
    children: [
      { key: "nav.learn.quiz", href: "/learn/quiz", icon: BookOpen },
      { key: "nav.learn.stories", href: "/learn/stories", icon: BookOpen },
      { key: "nav.learn.puzzles", href: "/learn/puzzles", icon: BookOpen }
    ]
  },
  {
    key: "nav.map",
    href: "/map",
    icon: Map
  },
  {
    key: "nav.marketplace",
    href: "/marketplace",
    icon: ShoppingBag
  },
  {
    key: "nav.wallet",
    href: "/wallet",
    icon: Wallet
  },
  {
    key: "nav.events",
    href: "/events",
    icon: Calendar
  }
];

// Navigation profil utilisateur
export const profileNavItems: NavItem[] = [
  {
    key: "nav.profile.overview",
    href: "/profile",
    icon: User
  },
  {
    key: "nav.profile.orders",
    href: "/profile/orders",
    icon: Package
  },
  {
    key: "nav.profile.collection",
    href: "/profile/collection",
    icon: Palette
  },
  {
    key: "nav.profile.settings",
    href: "/profile/settings",
    icon: Settings
  }
];

// Navigation artisan
export const artisanNavItems: NavItem[] = [
  {
    key: "nav.artisan.dashboard",
    href: "/artisan/dashboard",
    icon: LayoutDashboard
  },
  {
    key: "nav.artisan.designs",
    href: "/artisan/designs",
    icon: Palette
  },
  {
    key: "nav.artisan.sales",
    href: "/artisan/sales",
    icon: BarChart3
  },
  {
    key: "nav.artisan.earnings",
    href: "/artisan/earnings",
    icon: Wallet
  }
];

// Navigation admin
export const adminNavItems: NavItem[] = [
  {
    key: "nav.admin.dashboard",
    href: "/admin",
    icon: LayoutDashboard
  },
  {
    key: "nav.admin.symbols",
    href: "/admin/symbols",
    icon: Compass
  },
  {
    key: "nav.admin.pagnes",
    href: "/admin/pagnes",
    icon: Palette
  },
  {
    key: "nav.admin.users",
    href: "/admin/users",
    icon: Users
  },
  {
    key: "nav.admin.orders",
    href: "/admin/orders",
    icon: Package
  },
  {
    key: "nav.admin.events",
    href: "/admin/events",
    icon: Calendar
  },
  {
    key: "nav.admin.analytics",
    href: "/admin/analytics",
    icon: BarChart3
  },
  {
    key: "nav.admin.messages",
    href: "/admin/messages",
    icon: MessageSquare
  },
  {
    key: "nav.admin.settings",
    href: "/admin/settings",
    icon: Settings
  }
];

// Liens du footer
export const footerLinks = {
  product: [
    { key: "footer.explore", href: "/explore" },
    { key: "footer.marketplace", href: "/marketplace" },
    { key: "footer.learn", href: "/learn" },
    { key: "footer.events", href: "/events" }
  ],
  company: [
    { key: "footer.about", href: "/about" },
    { key: "footer.team", href: "/team" },
    { key: "footer.careers", href: "/careers" },
    { key: "footer.press", href: "/press" }
  ],
  resources: [
    { key: "footer.docs", href: "/docs" },
    { key: "footer.blog", href: "/blog" },
    { key: "footer.faq", href: "/faq" },
    { key: "footer.support", href: "/support" }
  ],
  legal: [
    { key: "footer.privacy", href: "/privacy-policy" },
    { key: "footer.terms", href: "/terms-of-service" },
    { key: "footer.cookies", href: "/cookies" }
  ]
} as const;

// Actions utilisateur (dropdown)
export const userMenuItems = [
  { key: "user.profile", href: "/profile", icon: User },
  { key: "user.wallet", href: "/wallet", icon: Wallet },
  { key: "user.orders", href: "/profile/orders", icon: Package },
  { key: "user.settings", href: "/profile/settings", icon: Settings },
  { key: "user.help", href: "/support", icon: HelpCircle },
  { key: "user.logout", href: "/logout", icon: LogOut }
] as const;
