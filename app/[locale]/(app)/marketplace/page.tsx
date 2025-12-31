import { setRequestLocale } from "next-intl/server";
import { MarketplaceHero } from "@/components/marketplace";
import { MarketplaceFilters } from "@/components/marketplace";
import { ProductsGrid } from "@/components/marketplace";
import { FeaturedProducts } from "@/components/marketplace";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>
};

export const metadata: Metadata = {
  title: "Marketplace",
  description: "Achetez des pagnes africains authentiques certifiés sur la blockchain",
};

export default async function MarketplacePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="min-h-screen bg-gray-50">
      <MarketplaceHero />
      <FeaturedProducts />
      
      <div className="container mx-auto px-4 py-12">
        <MarketplaceFilters />
        <ProductsGrid />
      </div>
    </main>
  );
}