"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { Mail, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/validators/auth.schema";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export function ForgotPasswordForm() {
  const t = useTranslations("auth");
  const tv = useTranslations("validation");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true);
    try {
      await authClient.resetPassword({
        email: data.email,
        redirectTo: "/reset-password",
      } as any);
      setIsSuccess(true);
    } catch (error) {
      toast.error(t("errors.unexpected"));
    } finally {
      setIsLoading(false);
    }
  };

  const fadeUp = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
  };

  // Success state
  if (isSuccess) {
    return (
      <motion.div
        className="text-center space-y-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center"
        >
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </motion.div>

        <div>
          <h2 className="text-xl font-heading font-bold text-gray-900">
            {t("forgotPassword.successTitle")}
          </h2>
          <p className="mt-2 text-gray-500 text-sm">
            {t("forgotPassword.successMessage")}
          </p>
        </div>

        <Button asChild variant="outline" className="gap-2">
          <Link href="/login">
            <ArrowLeft className="w-4 h-4" />
            {t("forgotPassword.backToLogin")}
          </Link>
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div {...fadeUp} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-gray-900">
          {t("forgotPassword.title")}
        </h1>
        <p className="mt-2 text-gray-500">{t("forgotPassword.subtitle")}</p>
      </motion.div>

      {/* Form */}
      <motion.form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
        {...fadeUp}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            {t("forgotPassword.emailLabel")}
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder={t("forgotPassword.emailPlaceholder")}
              className="pl-10 h-12 border-2 focus:border-primary-500 focus:ring-primary-500/20"
              {...form.register("email")}
              disabled={isLoading}
            />
          </div>
          {form.formState.errors.email && (
            <p className="text-sm text-red-500">
              {tv(form.formState.errors.email.message as string)}
            </p>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          variant="african"
          size="lg"
          className="w-full h-12 gap-2 font-semibold"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {t("forgotPassword.loading")}
            </>
          ) : (
            t("forgotPassword.submitButton")
          )}
        </Button>
      </motion.form>

      {/* Back to login */}
      <motion.div
        className="text-center"
        {...fadeUp}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("forgotPassword.backToLogin")}
        </Link>
      </motion.div>
    </div>
  );
}