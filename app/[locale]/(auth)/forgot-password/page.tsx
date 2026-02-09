import { setRequestLocale } from "next-intl/server";
import { ForgotPasswordForm } from "@/components/forms/forgot-password-form";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  title: "Mot de passe oublié | SANDJA",
  description: "Réinitialisez votre mot de passe SANDJA",
};

export default async function ForgotPasswordPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ForgotPasswordForm />;
}
