import { setRequestLocale } from "next-intl/server";
import { AuthLayoutClient } from "@/components/layout/auth-layout-client";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function AuthLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AuthLayoutClient>{children}</AuthLayoutClient>;
}
