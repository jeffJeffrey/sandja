import { setRequestLocale } from "next-intl/server";
import { PublicLayoutClient } from "@/components/layout/public-layout-client";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function PublicLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <PublicLayoutClient>{children}</PublicLayoutClient>;
}
