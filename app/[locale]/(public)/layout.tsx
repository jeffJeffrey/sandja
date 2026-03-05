import { setRequestLocale } from "next-intl/server";
import { PublicLayoutClient } from "@/components/layout/public-layout-client";
import { routing } from "@/i18n/routing";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function PublicLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <PublicLayoutClient>{children}</PublicLayoutClient>;
}
