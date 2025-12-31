"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, Loader2, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function RegisterForm() {
  const t = useTranslations("auth");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validation du mot de passe
  const passwordRequirements = [
    { label: "Au moins 8 caractères", met: formData.password.length >= 8 },
    { label: "Une majuscule", met: /[A-Z]/.test(formData.password) },
    { label: "Une minuscule", met: /[a-z]/.test(formData.password) },
    { label: "Un chiffre", met: /[0-9]/.test(formData.password) },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Validation
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = t("errors.nameRequired");
    }
    
    if (!formData.email) {
      newErrors.email = t("errors.emailRequired");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t("errors.emailInvalid");
    }
    
    if (!formData.password) {
      newErrors.password = t("errors.passwordRequired");
    } else if (formData.password.length < 8) {
      newErrors.password = t("errors.passwordTooShort");
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t("errors.passwordMismatch");
    }
    
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = t("errors.acceptTermsRequired");
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    // TODO: Implémenter l'inscription avec Better Auth
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Register:", formData);
    } catch (error) {
      setErrors({ form: t("errors.registerFailed") });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Logo mobile */}
      <div className="lg:hidden flex justify-center mb-8">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/logo/logo-icon.svg"
            alt="SANDJA"
            width={40}
            height={40}
          />
          <span className="font-heading text-xl font-bold text-gray-900">SANDJA</span>
        </Link>
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="font-heading text-3xl font-bold text-gray-900 mb-2">
          {t("register.title")}
        </h1>
        <p className="text-gray-600">
          {t("register.subtitle")}
        </p>
      </div>

      {/* Erreur générale */}
      {errors.form && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm"
        >
          {errors.form}
        </motion.div>
      )}

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nom */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
            {t("register.name")}
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                errors.name 
                  ? "border-red-300 focus:border-red-500 focus:ring-red-200" 
                  : "border-gray-200 focus:border-primary-500 focus:ring-primary-200"
              } focus:ring-2 focus:outline-none transition-all`}
              placeholder="Votre nom complet"
            />
          </div>
          {errors.name && (
            <p className="mt-1.5 text-sm text-red-500">{errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
            {t("register.email")}
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                errors.email 
                  ? "border-red-300 focus:border-red-500 focus:ring-red-200" 
                  : "border-gray-200 focus:border-primary-500 focus:ring-primary-200"
              } focus:ring-2 focus:outline-none transition-all`}
              placeholder="vous@exemple.com"
            />
          </div>
          {errors.email && (
            <p className="mt-1.5 text-sm text-red-500">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
            {t("register.password")}
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full pl-10 pr-12 py-3 rounded-xl border ${
                errors.password 
                  ? "border-red-300 focus:border-red-500 focus:ring-red-200" 
                  : "border-gray-200 focus:border-primary-500 focus:ring-primary-200"
              } focus:ring-2 focus:outline-none transition-all`}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1.5 text-sm text-red-500">{errors.password}</p>
          )}
          
          {/* Password requirements */}
          {formData.password && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-3 grid grid-cols-2 gap-2"
            >
              {passwordRequirements.map((req, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-1.5 text-xs ${
                    req.met ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  <Check className={`w-3.5 h-3.5 ${req.met ? "opacity-100" : "opacity-30"}`} />
                  {req.label}
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
            {t("register.confirmPassword")}
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                errors.confirmPassword 
                  ? "border-red-300 focus:border-red-500 focus:ring-red-200" 
                  : "border-gray-200 focus:border-primary-500 focus:ring-primary-200"
              } focus:ring-2 focus:outline-none transition-all`}
              placeholder="••••••••"
            />
          </div>
          {errors.confirmPassword && (
            <p className="mt-1.5 text-sm text-red-500">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Accept terms */}
        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            id="acceptTerms"
            name="acceptTerms"
            checked={formData.acceptTerms}
            onChange={handleChange}
            className="w-4 h-4 mt-0.5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <label htmlFor="acceptTerms" className="text-sm text-gray-600">
            {t("register.acceptTerms")}{" "}
            <Link href="/terms-of-service" className="text-primary-600 hover:underline">
              {t("register.termsLink")}
            </Link>{" "}
            {t("register.and")}{" "}
            <Link href="/privacy-policy" className="text-primary-600 hover:underline">
              {t("register.privacyLink")}
            </Link>
          </label>
        </div>
        {errors.acceptTerms && (
          <p className="text-sm text-red-500">{errors.acceptTerms}</p>
        )}

        {/* Submit */}
        <Button
          type="submit"
          variant="african"
          size="lg"
          className="w-full group mt-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Création du compte...
            </>
          ) : (
            <>
              {t("register.submit")}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-gray-50 text-gray-500">{t("register.orContinueWith")}</span>
        </div>
      </div>

      {/* Social Login */}
      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" className="w-full" type="button">
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Google
        </Button>
        <Button variant="outline" className="w-full" type="button">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
          </svg>
          GitHub
        </Button>
      </div>

      {/* Login link */}
      <p className="mt-6 text-center text-sm text-gray-600">
        {t("register.haveAccount")}{" "}
        <Link href="/login" className="font-semibold text-primary-600 hover:text-primary-700">
          {t("register.signIn")}
        </Link>
      </p>
    </motion.div>
  );
}