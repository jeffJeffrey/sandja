"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { loginSchema, type LoginFormValues } from "@/validators/auth.schema";
import { useAuth } from "@/hooks/useAuth";

export function LoginForm() {
  const t = useTranslations("auth");
  const tv = useTranslations("validation");
  const { login, loginWithGoogle, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    await login(data.email, data.password, data.rememberMe);
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
          {t("login.title")}
        </h1>
        <p className="mt-2 text-gray-500">{t("login.subtitle")}</p>
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
          {t("login.googleButton")}
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
          {t("login.orDivider")}
        </span>
      </motion.div>

      {/* Form */}
      <motion.form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
        {...fadeUp}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            {t("login.emailLabel")}
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder={t("login.emailPlaceholder")}
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
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
              {t("login.passwordLabel")}
            </Label>
            <Link
              href="/forgot-password"
              className="text-xs text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              {t("login.forgotPassword")}
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder={t("login.passwordPlaceholder")}
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
        </div>

        {/* Remember me */}
        <div className="flex items-center gap-2">
          <Checkbox
            id="rememberMe"
            checked={form.watch("rememberMe")}
            onCheckedChange={(checked) =>
              form.setValue("rememberMe", checked === true)
            }
            disabled={isLoading}
          />
          <Label htmlFor="rememberMe" className="text-sm text-gray-600 cursor-pointer">
            {t("login.rememberMe")}
          </Label>
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
              {t("login.loading")}
            </>
          ) : (
            <>
              {t("login.submitButton")}
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </motion.form>

      {/* Sign up link */}
      <motion.p
        className="text-center text-sm text-gray-500"
        {...fadeUp}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        {t("login.noAccount")}{" "}
        <Link
          href="/register"
          className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
        >
          {t("login.signUpLink")}
        </Link>
      </motion.p>
    </div>
  );
}
