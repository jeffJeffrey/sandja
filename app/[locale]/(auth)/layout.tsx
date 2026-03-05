import { setRequestLocale } from "next-intl/server";
import { AuthLayoutClient } from "@/components/layout/auth-layout-client";
import { routing } from "@/i18n/routing";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function AuthLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AuthLayoutClient>{children}</AuthLayoutClient>;
}
