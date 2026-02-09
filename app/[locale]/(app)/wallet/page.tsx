import { setRequestLocale } from "next-intl/server";
import { WalletContent } from "@/components/wallet/wallet-content";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  title: "Wallet | SANDJA",
  description: "Gérez votre portefeuille Cardano et vos actifs SANDJA",
};

export default async function WalletPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <WalletContent />;
}