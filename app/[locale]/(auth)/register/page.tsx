import { setRequestLocale } from "next-intl/server";
import { RegisterForm } from "@/components/forms/register-form";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  title: "Inscription | SANDJA",
  description: "Créez votre compte SANDJA et explorez le patrimoine textile africain",
};

export default async function RegisterPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <RegisterForm />;
}
