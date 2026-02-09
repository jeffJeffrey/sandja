"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export function useAuth() {
  const router = useRouter();
  const t = useTranslations("auth");
  const [isLoading, setIsLoading] = useState(false);

  const session = authClient.useSession();

  const login = async (email: string, password: string, rememberMe?: boolean) => {
    setIsLoading(true);
    try {
      const result = await authClient.signIn.email({
        email,
        password,
        callbackURL: "/home",
      });

      if (result.error) {
        toast.error(t("errors.loginFailed"), {
          description: result.error.message || t("errors.invalidCredentials"),
        });
        return false;
      }

      toast.success(t("success.loginSuccess"), {
        description: t("success.welcome"),
      });

      router.push("/home");
      return true;
    } catch (error) {
      toast.error(t("errors.loginFailed"), {
        description: t("errors.unexpected"),
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await authClient.signUp.email({
        name,
        email,
        password,
        callbackURL: "/home",
      });

      if (result.error) {
        toast.error(t("errors.registerFailed"), {
          description: result.error.message || t("errors.emailExists"),
        });
        return false;
      }

      toast.success(t("success.registerSuccess"), {
        description: t("success.accountCreated"),
      });

      router.push("/home");
      return true;
    } catch (error) {
      toast.error(t("errors.registerFailed"), {
        description: t("errors.unexpected"),
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/home",
      });
    } catch (error) {
      toast.error(t("errors.socialLoginFailed"));
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success(t("success.logoutSuccess"));
            router.push("/");
          },
        },
      });
    } catch (error) {
      toast.error(t("errors.logoutFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    session: session.data,
    user: session.data?.user ?? null,
    isAuthenticated: !!session.data?.user,
    isPending: session.isPending,
    isLoading,
    login,
    register,
    loginWithGoogle,
    logout,
  };
}
