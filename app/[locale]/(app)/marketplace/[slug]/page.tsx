import { setRequestLocale } from "next-intl/server";
import { ProductDetail } from "@/components/marketplace";
import type { Metadata } from "next";

// Routes dynamiques : pas de liste statique de slugs connue au build
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `${slug} | Marketplace SANDJA`,
    description: `Découvrez et achetez ${slug} sur la marketplace SANDJA`,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  return (
    <main className="min-h-screen bg-white">
      <ProductDetail slug={slug} />
    </main>
  );
}
