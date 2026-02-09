"use client";
import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe, ChevronDown, Bell, ShoppingCart, User, Settings, LogOut, Wallet, Award, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "../ui/button";
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

export function PublicHeader() {
  const t = useTranslations("nav");
  const tAuth = useTranslations("auth");
  const tProfile = useTranslations("profile");
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
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

  // Détecter le scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fermer le menu langue si on clique ailleurs
  useEffect(() => {
    const handleClickOutside = () => setIsLangMenuOpen(false);
    if (isLangMenuOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [isLangMenuOpen]);

  // Close profile dropdown when clicking outside
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
    { href: "/marketplace", label: t("marketplace") },
    { href: "/learn", label: t("learn") },
    { href: "/about", label: t("about") },
  ];

  const languages = [
    { code: "fr", label: "Français", flag: "🇫🇷" },
    { code: "en", label: "English", flag: "🇬🇧" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm py-2"
          : "bg-transparent py-4"
      )}
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <Image
                src="/images/logo/logo-icon.svg"
                alt="SANDJA"
                width={40}
                height={40}
                className="w-10 h-10"
              />
            </motion.div>
            <span className="font-heading text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
              SANDJA
            </span>
          </Link>

          {/* Navigation desktop */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative text-sm font-medium transition-colors hover:text-primary-600 py-2",
                  pathname === link.href
                    ? "text-primary-600"
                    : "text-gray-600"
                )}
              >
                {link.label}
                {pathname === link.href && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary-500 rounded-full"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Sélecteur de langue */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLangMenuOpen(!isLangMenuOpen);
                }}
                className="flex items-center gap-1 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Globe className="w-5 h-5 text-gray-600" />
                <ChevronDown className={cn(
                  "w-4 h-4 text-gray-400 transition-transform",
                  isLangMenuOpen && "rotate-180"
                )} />
              </button>
              <AnimatePresence>
                {isLangMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden min-w-37.5"
                  >
                    {languages.map((lang) => (
                      <Link
                        key={lang.code}
                        href={pathname}
                        locale={lang.code}
                        onClick={() => setIsLangMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <span className="text-sm font-medium">{lang.label}</span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Additional actions when logged in */}
            {user && (
              <>
                {/* Notifications */}
                <button
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative hidden md:block"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5 text-gray-500" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-red rounded-full ring-2 ring-white" />
                </button>

                {/* Cart */}
                <Link
                  href="/marketplace/cart"
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative hidden md:block"
                  aria-label="Cart"
                >
                  <ShoppingCart className="w-5 h-5 text-gray-500" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 bg-primary-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center px-1">
                      {cartItemsCount > 99 ? "99+" : cartItemsCount}
                    </span>
                  )}
                </Link>
              </>
            )}

            {/* Profile or Auth buttons */}
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
                      "w-4 h-4 text-gray-400 transition-transform hidden md:block",
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
                <div className="hidden md:flex items-center gap-2">
                  <Button asChild variant="ghost" size="sm">
                    <Link href="/login">{tAuth("loginTitle")}</Link>
                  </Button>
                  <Button asChild variant="african" size="sm">
                    <Link href="/register">{tAuth("registerTitle")}</Link>
                  </Button>
                </div>
              )
            )}

            {/* Menu burger - mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <motion.div
                animate={isMobileMenuOpen ? "open" : "closed"}
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </motion.div>
            </button>
          </div>
        </nav>
      </div>

      {/* Menu mobile */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col gap-2">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                        pathname === link.href
                          ? "bg-primary-50 text-primary-600"
                          : "text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <div className="border-t border-gray-100 my-2" />
                {user ? (
                  <>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Link
                        href="/profile"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        {tProfile("overview")}
                      </Link>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Link
                        href="/wallet"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        {tProfile("title").replace("Mon ", "")}
                      </Link>
                    </motion.div>
                    {/* Add more profile links if needed */}
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="flex items-center px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                      {tAuth("logout")}
                    </button>
                  </>
                ) : (
                  <>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Link
                        href="/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        {tAuth("loginTitle")}
                      </Link>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Button asChild variant="african" className="w-full mt-2">
                        <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                          {tAuth("registerTitle")}
                        </Link>
                      </Button>
                    </motion.div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}