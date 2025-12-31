// src/components/layout/bottom-nav.tsx
"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Home, Compass, Camera, ShoppingBag, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const navItems = [
  { href: "/home", icon: Home, labelKey: "home" },
  { href: "/explore", icon: Compass, labelKey: "explore" },
  { href: "/scanner", icon: Camera, labelKey: "scanner", isMain: true },
  { href: "/marketplace", icon: ShoppingBag, labelKey: "marketplace" },
  { href: "/profile", icon: User, labelKey: "profile" },
];

export function BottomNav() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  return (
    <nav className="bottom-nav md:hidden">
      <div className="flex items-center justify-around px-2 py-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          if (item.isMain) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative -mt-6"
              >
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "w-14 h-14 rounded-full flex items-center justify-center shadow-lg",
                    "bg-gradient-to-br from-primary-500 to-secondary-500 text-white"
                  )}
                >
                  <Icon className="w-6 h-6" />
                </motion.div>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "bottom-nav-item flex-1",
                isActive && "active"
              )}
            >
              <motion.div
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center"
              >
                <Icon className="bottom-nav-item-icon" />
                <span className="bottom-nav-item-label">
                  {t(item.labelKey)}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="absolute -bottom-1 w-1 h-1 rounded-full bg-primary-500"
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
