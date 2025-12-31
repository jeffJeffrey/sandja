import { setRequestLocale } from "next-intl/server";
import { ExploreHero } from "@/components/explore";
import { ExploreFilters } from "@/components/explore";
import { SymbolsGrid } from "@/components/explore";
import { RegionsSection } from "@/components/explore";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;  
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export const metadata: Metadata = {
  title: "Explorer les Symboles",
  description: "Découvrez la richesse des symboles textiles africains - Ndop, Kente, Bogolan et bien plus",
};

export default async function ExplorePage({ params, searchParams }: Props) {
  const { locale } = await params;
  const search = await searchParams;
  setRequestLocale(locale);

  return (
    <main className="min-h-screen bg-gray-50">
      <ExploreHero />
      
      <div className="container mx-auto px-4 py-12">
        {/* Filtres */}
        <ExploreFilters />
        
        {/* Grille de symboles */}
        <SymbolsGrid />
        
        {/* Section régions */}
        <RegionsSection />
      </div>
    </main>
  );
}