import { setRequestLocale } from "next-intl/server";
import { MarketplaceHero, MarketplaceFilters, ProductsGrid, FeaturedProducts } from "@/components/marketplace";
import type { Metadata } from "next";

// Page protégée par auth — rendu dynamique uniquement
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ locale: string }> };

export const metadata: Metadata = {
  title: "Marketplace | SANDJA",
  description: "Achetez des pagnes africains authentiques certifiés sur la blockchain Cardano",
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
