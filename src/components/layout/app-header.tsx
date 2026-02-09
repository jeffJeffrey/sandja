"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Bell,
  ShoppingCart,
  User,
  Menu,
  X,
  Settings,
  LogOut,
  Wallet,
  Award,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";
import { useAuthStore } from "@/stores/auth-store";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner";

// XP thresholds for progress bar
const LEVEL_THRESHOLDS = [0, 100, 300, 600, 1000, 1500, 2500, 4000, 6000, 10000];

function getXpProgress(level: number, xp: number) {
  const currentThreshold = LEVEL_THRESHOLDS[level - 1] || 0;
  const nextThreshold = LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  const xpIntoLevel = xp - currentThreshold;
  const xpForLevel = nextThreshold - currentThreshold;
  return { xpIntoLevel, xpForLevel, percent: Math.min((xpIntoLevel / xpForLevel) * 100, 100) };
}

export function AppHeader() {
  const t = useTranslations("nav");
  const tAuth = useTranslations("auth");
  const tProfile = useTranslations("profile");
  const pathname = usePathname();
  const router = useRouter();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const cartItemsCount = useCartStore((state) => state.getTotalItems());

  // Better Auth session
  const { data: session, isPending } = useSession();
  const { user: storeUser, setUser } = useAuthStore();

  // Sync session to store
  useEffect(() => {
    if (session?.user) {
      setUser({
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image ?? null,
        role: ((session.user as any).role as any) || "USER",
        level: ((session.user as any).level as any) || 1,
        xp: ((session.user as any).xp as any) || 0,
        sandjaCoin: ((session.user as any).sandjaCoin as any) || 0,
        streak: 0,
        walletAddress: null,
        locale: ((session.user as any).locale as any) || "fr",
      });
    }
  }, [session, setUser]);

  const user = storeUser;
  const xpProgress = user ? getXpProgress(user.level, user.xp) : null;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setIsProfileMenuOpen(false);
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            useAuthStore.getState().clear();
            toast.success(tAuth("success.logoutSuccess"));
            router.push("/");
          },
        },
      });
    } catch {
      toast.error(tAuth("errors.logoutFailed"));
    } finally {
      setIsLoggingOut(false);
    }
  };

  const navLinks = [
    { href: "/home", label: t("home") },
    { href: "/explore", label: t("explore") },
    { href: "/ceremony", label: t("ceremonies") },
    { href: "/marketplace", label: t("marketplace") },
    { href: "/learn", label: t("learn") },
    { href: "/map", label: t("map") },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/home" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-primary-500 to-secondary-DEFAULT flex items-center justify-center">
              <span className="text-white font-heading font-bold text-lg">S</span>
            </div>
            <span className="font-heading text-lg font-bold text-gray-900 hidden sm:block">
              SANDJA
            </span>
          </Link>

          {/* Navigation desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary-50 text-primary-700 font-semibold"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1.5">
            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-gray-500" />
            </button>

            {/* Notifications */}
            <button
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-gray-500" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-red rounded-full ring-2 ring-white" />
            </button>

            {/* Cart */}
            <Link
              href="/marketplace/cart"
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
              aria-label="Cart"
            >
              <ShoppingCart className="w-5 h-5 text-gray-500" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 bg-primary-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center px-1">
                  {cartItemsCount > 99 ? "99+" : cartItemsCount}
                </span>
              )}
            </Link>

            {/* SandjaCoin balance */}
            {user && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200/50 rounded-full">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="shrink-0"
                >
                  <circle cx="12" cy="12" r="11" fill="#DAA520" />
                  <circle cx="12" cy="12" r="9" fill="#F5D060" />
                  <text
                    x="12"
                    y="16"
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="bold"
                    fill="#8B6914"
                    fontFamily="sans-serif"
                  >
                    S
                  </text>
                </svg>
                <span className="text-sm font-semibold text-amber-700">
                  {user.sandjaCoin.toFixed(0)}
                </span>
              </div>
            )}

            {/* Profile dropdown */}
            {user ? (
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className={cn(
                    "flex items-center gap-2 p-1.5 rounded-xl transition-colors",
                    isProfileMenuOpen
                      ? "bg-primary-50"
                      : "hover:bg-gray-100"
                  )}
                >
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary-500 to-secondary-DEFAULT flex items-center justify-center text-white font-semibold text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 text-gray-400 transition-transform hidden sm:block",
                      isProfileMenuOpen && "rotate-180"
                    )}
                  />
                </button>

                <AnimatePresence>
                  {isProfileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
                    >
                      {/* User info header */}
                      <div className="p-4 bg-linear-to-br from-primary-600 to-secondary-DEFAULT text-white">
                        <div className="flex items-center gap-3">
                          {user.image ? (
                            <img
                              src={user.image}
                              alt={user.name}
                              className="w-12 h-12 rounded-full object-cover ring-2 ring-white/30"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center font-bold text-lg">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold truncate">
                              {user.name}
                            </div>
                            <div className="text-sm text-white/70 truncate">
                              {user.email}
                            </div>
                          </div>
                        </div>

                        {/* Level & XP */}
                        {xpProgress && (
                          <div className="mt-3">
                            <div className="flex justify-between text-xs text-white/80 mb-1">
                              <span>
                                {tProfile("level")} {user.level} · {user.xp} XP
                              </span>
                              <span>{xpProgress.xpForLevel} XP</span>
                            </div>
                            <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-accent-gold rounded-full"
                                initial={{ width: 0 }}
                                animate={{
                                  width: `${xpProgress.percent}%`,
                                }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Menu items */}
                      <div className="p-2">
                        {[
                          {
                            href: "/profile",
                            icon: User,
                            label: tProfile("overview"),
                          },
                          {
                            href: "/wallet",
                            icon: Wallet,
                            label: tProfile("title").replace("Mon ", ""),
                          },
                          {
                            href: "/profile/collection",
                            icon: Award,
                            label: tProfile("badges"),
                          },
                          {
                            href: "/profile/settings",
                            icon: Settings,
                            label: tProfile("settings"),
                          },
                        ].map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsProfileMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors group"
                          >
                            <item.icon className="w-5 h-5 text-gray-400 group-hover:text-primary-500 transition-colors" />
                            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                              {item.label}
                            </span>
                          </Link>
                        ))}

                        <div className="border-t border-gray-100 my-2" />

                        <button
                          onClick={handleLogout}
                          disabled={isLoggingOut}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 transition-colors w-full text-left group"
                        >
                          {isLoggingOut ? (
                            <Loader2 className="w-5 h-5 text-red-400 animate-spin" />
                          ) : (
                            <LogOut className="w-5 h-5 text-red-400 group-hover:text-red-500 transition-colors" />
                          )}
                          <span className="text-sm font-medium text-red-600">
                            {tAuth("logout")}
                          </span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              !isPending && (
                <div className="flex items-center gap-2">
                  <Button asChild variant="ghost" size="sm">
                    <Link href="/login">{tAuth("loginTitle")}</Link>
                  </Button>
                  <Button asChild variant="african" size="sm">
                    <Link href="/register">{tAuth("registerTitle")}</Link>
                  </Button>
                </div>
              )
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-gray-100 bg-white"
          >
            <nav className="container mx-auto px-4 py-3 flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  pathname.startsWith(link.href + "/");
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary-50 text-primary-700"
                        : "text-gray-600 hover:bg-gray-50"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="container mx-auto px-4 pt-20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-2xl mx-auto">
                <div className="flex items-center gap-4 p-4 border-b border-gray-100">
                  <Search className="w-6 h-6 text-gray-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Rechercher des symboles, pagnes, régions..."
                    className="flex-1 text-lg outline-none bg-transparent"
                    autoFocus
                  />
                  <button
                    onClick={() => setIsSearchOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg shrink-0"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-4">
                  <p className="text-sm text-gray-500 mb-3">
                    Suggestions populaires
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Ndop",
                      "Kente",
                      "Araignée",
                      "Mariage",
                      "Cameroun",
                      "Ghana",
                    ].map((term) => (
                      <button
                        key={term}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-primary-50 hover:text-primary-600 rounded-full text-sm transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}