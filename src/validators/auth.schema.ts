import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "validation.emailRequired" })
    .email({ message: "validation.emailInvalid" }),
  password: z
    .string()
    .min(6, { message: "validation.passwordMin" }),
  rememberMe: z.boolean().default(false),
});

export type LoginFormValues = z.input<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "validation.nameMin" })
      .max(50, { message: "validation.nameMax" }),
    email: z
      .string()
      .min(1, { message: "validation.emailRequired" })
      .email({ message: "validation.emailInvalid" }),
    password: z
      .string()
      .min(6, { message: "validation.passwordMin" })
      .max(100, { message: "validation.passwordMax" }),
    confirmPassword: z
      .string()
      .min(1, { message: "validation.confirmPasswordRequired" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "validation.passwordMismatch",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: "validation.emailRequired" })
    .email({ message: "validation.emailInvalid" }),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;