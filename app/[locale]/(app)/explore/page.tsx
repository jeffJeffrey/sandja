import { setRequestLocale, getTranslations } from "next-intl/server";
import { ExploreFilters, SymbolsGrid } from "@/components/explore";
import type { Metadata } from "next";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "explore" });

  return {
    title: `${t("hero.title")} | SANDJA`,
    description: t("hero.subtitle"),
  };
}

export default async function ExplorePage({ params }: Props) {
  const { locale } = await params;

  // setRequestLocale DOIT être appelé avant tout appel next-intl
  setRequestLocale(locale);

  const t = await getTranslations("explore");

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-linear-to-br from-primary-700 via-primary-800 to-secondary-DEFAULT py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0L40 20L20 40L0 20z' fill='%23ffffff' fill-opacity='.08'/%3E%3C/svg%3E")`,
        }} />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-3">
            {t("hero.title")}
          </h1>
          <p className="text-white/60 max-w-xl mx-auto">
            {t("hero.subtitle")}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <ExploreFilters />
        <SymbolsGrid />
      </div>
    </main>
  );
}
