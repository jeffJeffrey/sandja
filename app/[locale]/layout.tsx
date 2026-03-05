// app/[locale]/layout.tsx
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { AppProviders } from "@/components/providers/app-providers";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // Valider la locale avec hasLocale (pattern next-intl v4)
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Activer le rendu statique AVANT tout appel next-intl
  setRequestLocale(locale);

  // Charger les messages
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <AppProviders>{children}</AppProviders>
    </NextIntlClientProvider>
  );
}
