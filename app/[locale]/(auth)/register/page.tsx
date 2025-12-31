import { setRequestLocale } from "next-intl/server";
import { RegisterForm } from "@/components/auth";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>
};

export const metadata: Metadata = {
  title: "Inscription",
  description: "Créez votre compte SANDJA et rejoignez la communauté",
};

export default async function RegisterPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <RegisterForm />;
}