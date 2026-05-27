// lib/types/auth.ts
import { z } from "zod";

// 1. O Esquema Zod
export const loginSchema = z.object({
  email: z.string().email("Por favor, digite um email válido."),
  password: z.string().min(6, "A senha precisa ter pelo menos 6 caracteres."),
});

// 2. Extraímos o tipo do TypeScript direto do Zod!
export type LoginCredentials = z.infer<typeof loginSchema>;

// 3. Atualizamos o estado da Action
export type LoginState = {
  error?: string;
  success?: boolean;
  // O Zod devolve os erros num formato de objeto onde as chaves são os campos
  fieldErrors?: {
    email?: string[];
    password?: string[];
  };
};
