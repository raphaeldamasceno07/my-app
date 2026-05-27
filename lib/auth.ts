// lib/types/auth.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Digite um email válido"),
  password: z.string().min(6, "A senha precisa ter pelo menos 6 caracteres"),
});

export type LoginState = {
  error?: string;
  success?: boolean;
  fieldErrors?: {
    email?: string[];
    password?: string[];
  };
};

export type LoginResponse = {
  token: string;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
};
