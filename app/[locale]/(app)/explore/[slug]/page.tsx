import { setRequestLocale } from "next-intl/server";
import { SymbolDetail } from "@/components/explore";
import { RelatedSymbols } from "@/components/explore";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  // En production, récupérer les données du symbole
  return {
    title: `Symbole - ${slug}`,
    description: `Découvrez la signification et l'histoire du symbole ${slug}`,
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