import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { SymbolDetail, RelatedSymbols } from "@/components/explore";
import type { Metadata } from "next";

// Routes dynamiques : pas de liste statique de slugs connue au build
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "symbolDetail" });

  return {
    title: `${t("title")} - ${slug} | SANDJA`,
    description: t("description", { symbol: slug }),
  };
}

export default async function SymbolDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  return (
    <main className="min-h-screen bg-gray-50">
      <SymbolDetail slug={slug} />
      <RelatedSymbols currentSlug={slug} />
    </main>
  );
}
