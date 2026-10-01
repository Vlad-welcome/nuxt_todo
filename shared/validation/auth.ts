import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string({ required_error: "Имя обязательно" })
    .min(2, "Имя должно быть не короче 2 символов")
    .max(20, "Имя слишком длинное"),
  email: z.string({ required_error: "Email обязателен" }).email("Введите корректный email"),
  password: z
    .string({ required_error: "Пароль обязателен" })
    .min(6, "Пароль должен быть не короче 6 символов"),
});

export const loginSchema = z.object({
  email: z.string({ required_error: "Email обязателен" }).email("Введите корректный email"),
  password: z
    .string({ required_error: "Пароль обязателен" })
    .min(6, "Пароль должен быть не короче 6 символов"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
