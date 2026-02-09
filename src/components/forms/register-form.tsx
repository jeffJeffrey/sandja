"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Loader2,
  ArrowRight,
  Check,
  X,
} from "lucide-react";
import { useState, useMemo } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { registerSchema, type RegisterFormValues } from "@/validators/auth.schema";
import { useAuth } from "@/hooks/useAuth";

// Password strength checker
function getPasswordStrength(password: string) {
  const checks = {
    length: password.length >= 6,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const score = Object.values(checks).filter(Boolean).length;

  let level: "weak" | "fair" | "good" | "strong" = "weak";
  let color = "bg-red-500";

  if (score >= 4) {
    level = "strong";
    color = "bg-green-500";
  } else if (score >= 3) {
    level = "good";
    color = "bg-accent-gold";
  } else if (score >= 2) {
    level = "fair";
    color = "bg-orange-500";
  }

  return { checks, score, level, color };
}

export function RegisterForm() {
  const t = useTranslations("auth");
  const tv = useTranslations("validation");
  const { register: registerUser, loginWithGoogle, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const watchPassword = form.watch("password");
  const strength = useMemo(
    () => getPasswordStrength(watchPassword || ""),
    [watchPassword]
  );

  const onSubmit = async (data: RegisterFormValues) => {
    await registerUser(data.name, data.email, data.password);
  };

  const fadeUp = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div {...fadeUp} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-gray-900">
          {t("register.title")}
        </h1>
        <p className="mt-2 text-gray-500">{t("register.subtitle")}</p>
      </motion.div>

      {/* Google OAuth */}
      <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.1 }}>
        <Button
          type="button"
          variant="outline"
          className="w-full h-12 gap-3 text-sm font-medium border-2 hover:bg-gray-50 transition-colors"
          onClick={loginWithGoogle}
          disabled={isLoading}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          {t("register.googleButton")}
        </Button>
      </motion.div>

      {/* Divider */}
      <motion.div
        {...fadeUp}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="relative"
      >
        <Separator />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-xs text-gray-400 uppercase">
          {t("register.orDivider")}
        </span>
      </motion.div>

      {/* Form */}
      <motion.form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
        {...fadeUp}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium text-gray-700">
            {t("register.nameLabel")}
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="name"
              type="text"
              placeholder={t("register.namePlaceholder")}
              className="pl-10 h-12 border-2 focus:border-primary-500 focus:ring-primary-500/20"
              {...form.register("name")}
              disabled={isLoading}
            />
          </div>
          {form.formState.errors.name && (
            <p className="text-sm text-red-500">
              {tv(form.formState.errors.name.message as string)}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            {t("register.emailLabel")}
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder={t("register.emailPlaceholder")}
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

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-gray-700">
            {t("register.passwordLabel")}
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder={t("register.passwordPlaceholder")}
              className="pl-10 pr-12 h-12 border-2 focus:border-primary-500 focus:ring-primary-500/20"
              {...form.register("password")}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {form.formState.errors.password && (
            <p className="text-sm text-red-500">
              {tv(form.formState.errors.password.message as string)}
            </p>
          )}

          {/* Password strength indicator */}
          {watchPassword && watchPassword.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-2"
            >
              {/* Strength bar */}
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                      i <= strength.score ? strength.color : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500">
                {t(`register.strength.${strength.level}`)}
              </p>

              {/* Requirements checklist */}
              <div className="grid grid-cols-2 gap-1">
                {[
                  { key: "length", label: t("register.requirements.length") },
                  { key: "uppercase", label: t("register.requirements.uppercase") },
                  { key: "lowercase", label: t("register.requirements.lowercase") },
                  { key: "number", label: t("register.requirements.number") },
                ].map(({ key, label }) => (
                  <div
                    key={key}
                    className="flex items-center gap-1.5 text-xs"
                  >
                    {strength.checks[key as keyof typeof strength.checks] ? (
                      <Check className="w-3 h-3 text-green-500" />
                    ) : (
                      <X className="w-3 h-3 text-gray-300" />
                    )}
                    <span
                      className={
                        strength.checks[key as keyof typeof strength.checks]
                          ? "text-green-600"
                          : "text-gray-400"
                      }
                    >
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label
            htmlFor="confirmPassword"
            className="text-sm font-medium text-gray-700"
          >
            {t("register.confirmPasswordLabel")}
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder={t("register.confirmPasswordPlaceholder")}
              className="pl-10 pr-12 h-12 border-2 focus:border-primary-500 focus:ring-primary-500/20"
              {...form.register("confirmPassword")}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              tabIndex={-1}
            >
              {showConfirmPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {form.formState.errors.confirmPassword && (
            <p className="text-sm text-red-500">
              {tv(form.formState.errors.confirmPassword.message as string)}
            </p>
          )}
        </div>

        {/* Terms */}
        <p className="text-xs text-gray-400 leading-relaxed">
          {t("register.terms.prefix")}{" "}
          <Link
            href="/terms-of-service"
            className="text-primary-600 hover:underline"
          >
            {t("register.terms.termsLink")}
          </Link>{" "}
          {t("register.terms.and")}{" "}
          <Link
            href="/privacy-policy"
            className="text-primary-600 hover:underline"
          >
            {t("register.terms.privacyLink")}
          </Link>
        </p>

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
              {t("register.loading")}
            </>
          ) : (
            <>
              {t("register.submitButton")}
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </motion.form>

      {/* Login link */}
      <motion.p
        className="text-center text-sm text-gray-500"
        {...fadeUp}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        {t("register.hasAccount")}{" "}
        <Link
          href="/login"
          className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
        >
          {t("register.loginLink")}
        </Link>
      </motion.p>
    </div>
  );
}
