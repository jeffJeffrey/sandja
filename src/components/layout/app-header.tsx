// src/components/layout/app-header.tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";

export function AppHeader() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const cartItemsCount = useCartStore((state) => state.getTotalItems());

  const navLinks = [
    { href: "/", label: t("home") },
    { href: "/explore", label: t("explore") },
    { href: "/ceremonies", label: t("ceremonies") },
    { href: "/marketplace", label: t("marketplace") },
    { href: "/learn", label: t("learn") },
    { href: "/map", label: t("map") },
  ];

  // Mock user data
  const user = {
    name: "Jeffrey",
    email: "jeffrey@example.com",
    avatar: null,
    level: 5,
    xp: 450,
    sandjaCoin: 120,
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/logo/logo-icon.svg"
              alt="SANDJA"
              width={36}
              height={36}
              className="w-9 h-9"
            />
            <span className="font-heading text-lg font-bold text-gray-900 hidden sm:block">
              SANDJA
            </span>
          </Link>

          {/* Navigation desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname.startsWith(link.href)
                    ? "bg-primary-50 text-primary-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Search className="w-5 h-5 text-gray-600" />
            </button>

            {/* Notifications */}
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent-red rounded-full" />
            </button>

            {/* Cart */}
            <Link
              href="/cart"
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
            >
              <ShoppingCart className="w-5 h-5 text-gray-600" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {/* SandjaCoin */}
            <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 bg-amber-50 rounded-full">
              <span className="text-lg">🪙</span>
              <span className="text-sm font-semibold text-amber-700">{user.sandjaCoin}</span>
            </div>

            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-semibold text-sm">
                  {user.name.charAt(0)}
                </div>
                <ChevronDown className={cn(
                  "w-4 h-4 text-gray-400 transition-transform hidden sm:block",
                  isProfileMenuOpen && "rotate-180"
                )} />
              </button>

              <AnimatePresence>
                {isProfileMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsProfileMenuOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50"
                    >
                      {/* User info */}
                      <div className="p-4 bg-linear-to-br from-primary-500 to-secondary-500 text-white">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold">{user.name}</div>
                            <div className="text-sm text-white/80">Niveau {user.level}</div>
                          </div>
                        </div>
                        {/* XP Bar */}
                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-white/80 mb-1">
                            <span>{user.xp} XP</span>
                            <span>500 XP</span>
                          </div>
                          <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-white rounded-full"
                              style={{ width: `${(user.xp / 500) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Menu items */}
                      <div className="p-2">
                        <Link
                          href="/profile"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <User className="w-5 h-5 text-gray-400" />
                          <span className="text-sm font-medium text-gray-700">Mon Profil</span>
                        </Link>
                        <Link
                          href="/wallet"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <Wallet className="w-5 h-5 text-gray-400" />
                          <span className="text-sm font-medium text-gray-700">Mon Wallet</span>
                        </Link>
                        <Link
                          href="/achievements"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <Award className="w-5 h-5 text-gray-400" />
                          <span className="text-sm font-medium text-gray-700">Mes Badges</span>
                        </Link>
                        <Link
                          href="/settings"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <Settings className="w-5 h-5 text-gray-400" />
                          <span className="text-sm font-medium text-gray-700">Paramètres</span>
                        </Link>
                        
                        <div className="border-t border-gray-100 my-2" />
                        
                        <button
                          onClick={() => {
                            setIsProfileMenuOpen(false);
                            // TODO: Logout
                          }}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50 transition-colors w-full text-left"
                        >
                          <LogOut className="w-5 h-5 text-red-400" />
                          <span className="text-sm font-medium text-red-600">Déconnexion</span>
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

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
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    pathname.startsWith(link.href)
                      ? "bg-primary-50 text-primary-600"
                      : "text-gray-600 hover:bg-gray-50"
                  )}
                >
                  {link.label}
                </Link>
              ))}
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
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
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
                  <Search className="w-6 h-6 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher des symboles, pagnes, régions..."
                    className="flex-1 text-lg outline-none"
                    autoFocus
                  />
                  <button
                    onClick={() => setIsSearchOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Quick suggestions */}
                <div className="p-4">
                  <p className="text-sm text-gray-500 mb-3">Suggestions populaires</p>
                  <div className="flex flex-wrap gap-2">
                    {["Ndop", "Kente", "Araignée", "Mariage", "Cameroun", "Ghana"].map((term) => (
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