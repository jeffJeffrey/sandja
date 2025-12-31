import { setRequestLocale } from "next-intl/server";
import { LoginForm } from "@/components/auth";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  title: "Connexion",
  description: "Connectez-vous à votre compte SANDJA",
};

export default async function LoginPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <LoginForm />;
}