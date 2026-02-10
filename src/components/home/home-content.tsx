"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import {
  Compass,
  Camera,
  ShoppingBag,
  BookOpen,
  Map,
  Wallet,
  Calendar,
  Trophy,
  ArrowRight,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";

const LEVEL_THRESHOLDS = [0, 100, 300, 600, 1000, 1500, 2500, 4000, 6000, 10000];

function getXpProgress(level: number, xp: number) {
  const currentThreshold = LEVEL_THRESHOLDS[level - 1] || 0;
  const nextThreshold = LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  const xpIntoLevel = xp - currentThreshold;
  const xpForLevel = nextThreshold - currentThreshold;
  return {
    xpIntoLevel,
    xpForLevel,
    percent: Math.min((xpIntoLevel / xpForLevel) * 100, 100),
  };
}

export function HomeContent() {
  const t = useTranslations("home");
  const tNav = useTranslations("nav");
  const user = useAuthStore((s) => s.user);

  if (!user) return null;

  const xp = getXpProgress(user.level, user.xp);
  const levelName = t(`levels.${user.level}`);

  const quickActions = [
    { href: "/explore", icon: Compass, label: tNav("explore"), color: "from-blue-500 to-blue-600" },
    { href: "/scanner", icon: Camera, label: tNav("scanner"), color: "from-purple-500 to-purple-600" },
    { href: "/marketplace", icon: ShoppingBag, label: tNav("marketplace"), color: "from-primary-500 to-secondary-DEFAULT" },
    { href: "/learn/quiz", icon: BookOpen, label: t("quickActions.quiz"), color: "from-green-500 to-green-600" },
    { href: "/map", icon: Map, label: tNav("map"), color: "from-teal-500 to-teal-600" },
    { href: "/wallet", icon: Wallet, label: tNav("wallet"), color: "from-amber-500 to-amber-600" },
    { href: "/events", icon: Calendar, label: tNav("events"), color: "from-rose-500 to-rose-600" },
    { href: "/leaderboard", icon: Trophy, label: t("quickActions.leaderboard"), color: "from-indigo-500 to-indigo-600" },
  ];

  const featuredPagnes = [
    {
      id: "1",
      name: "Ndop Royal Bleu",
      region: t("featured.regions.cameroonWest"),
      image: "/images/pagnes/ndop-royal-bleu.jpg",
      slug: "ndop-royal-bleu",
    },
    {
      id: "2",
      name: "Kente Adweneasa",
      region: t("featured.regions.ghanaAshanti"),
      image: "/images/pagnes/kente-adweneasa.jpg",
      slug: "kente-adweneasa",
    },
    {
      id: "3",
      name: "Bogolan Chasseur",
      region: t("featured.regions.maliDogon"),
      image: "/images/pagnes/bogolan-chasseur.jpg",
      slug: "bogolan-chasseur",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      {/* Welcome banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-linear-to-br from-primary-600 via-primary-500 to-secondary-DEFAULT p-6 md:p-8 text-white"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-2xl md:text-3xl font-heading font-bold"
              >
                {t("welcome", { name: user.name.split(" ")[0] })}
              </motion.h1>
              <p className="mt-1 text-white/80 text-sm md:text-base">
                {t("subtitle")}
              </p>
            </div>

            {/* Level badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3"
            >
              <div className="w-10 h-10 rounded-full bg-accent-gold/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-accent-gold" />
              </div>
              <div>
                <div className="text-xs text-white/70">
                  {t("levelLabel", { level: user.level })}
                </div>
                <div className="text-sm font-semibold">{levelName}</div>
              </div>
            </motion.div>
          </div>

          {/* XP Progress */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6"
          >
            <div className="flex justify-between text-xs text-white/70 mb-2">
              <span className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {xp.xpIntoLevel} / {xp.xpForLevel} XP
              </span>
              <span>{t("levelLabel", { level: user.level + 1 })}</span>
            </div>
            <div className="h-2 bg-white/15 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-accent-gold rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${xp.percent}%` }}
                transition={{ duration: 0.8, delay: 0.4 }}
              />
            </div>
          </motion.div>

          {/* Quick stats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 flex gap-6"
          >
            {[
              { value: `${user.sandjaCoin}`, label: t("stats.coins"), icon: "🪙" },
              { value: `${user.streak}`, label: t("stats.streak"), icon: "🔥" },
              { value: `${user.xp}`, label: t("stats.totalXp"), icon: "⭐" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-lg font-bold flex items-center justify-center gap-1">
                  <span>{stat.icon}</span> {stat.value}
                </div>
                <div className="text-xs text-white/60">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Quick Actions Grid */}
      <section>
        <h2 className="text-lg font-heading font-bold text-gray-900 mb-4">
          {t("quickActions.title")}
        </h2>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {quickActions.map((action, i) => (
            <motion.div
              key={action.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
            >
              <Link
                href={action.href}
                className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-gray-50 transition-colors group"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-linear-to-br ${action.color} flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}
                >
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-medium text-gray-600 text-center">
                  {action.label}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Pagnes */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-heading font-bold text-gray-900">
            {t("featured.title")}
          </h2>
          <Button asChild variant="ghost" size="sm" className="gap-1 text-primary-600">
            <Link href="/explore">
              {t("featured.viewAll")} <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredPagnes.map((pagne, i) => (
            <motion.div
              key={pagne.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
            >
              <Link
                href={`/explore/${pagne.slug}`}
                className="group block rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="aspect-4/3 relative overflow-hidden">
                  <img
                    src={pagne.image}
                    alt={pagne.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-white font-semibold">{pagne.name}</h3>
                    <p className="text-white/70 text-sm">{pagne.region}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}