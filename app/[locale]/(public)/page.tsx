// app/[locale]/(public)/page.tsx
import { setRequestLocale } from "next-intl/server";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingProblem } from "@/components/landing/landing-problem";
import { LandingSolution } from "@/components/landing/landing-solution";
import { LandingFeatures } from "@/components/landing/landing-features";
import { LandingStats } from "@/components/landing/landing-stats";
import { LandingCTA } from "@/components/landing/landing-cta";
import { PublicHeader } from "@/components/layout/public-header";
import { Footer } from "@/components/layout/footer";
import { routing } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      
      <main className="flex-1">
        <LandingHero />
        <LandingProblem />
        <LandingSolution />
        <LandingFeatures />
        <LandingStats />
        <LandingCTA />
      </main>
      
      <Footer />
    </div>
  );
}
