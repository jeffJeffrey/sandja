import { setRequestLocale } from "next-intl/server";
import { HomeContent } from "@/components/home/home-content";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  title: "Accueil | SANDJA",
  description: "Votre espace personnel SANDJA - Explorez le patrimoine textile africain",
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HomeContent />;
}
