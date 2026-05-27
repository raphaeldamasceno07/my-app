// app/(public)/login/actions.ts
"use server";

import { loginService, saveAuthCookies } from "@/lib/api/auth-service";
import type { LoginState } from "@/lib/types/auth";
import { loginSchema } from "@/lib/types/auth";
import { redirect } from "next/navigation";

export async function loginAction(
  _previousState: LoginState | null,
  formData: FormData,
): Promise<LoginState | null> {
  let isSuccess = false;

  try {
    // 1. Validação com Zod
    const rawData = Object.fromEntries(formData.entries());
    const validatedFields = loginSchema.safeParse(rawData);

    // Se falhar, devolve os erros específicos de cada input para o front
    if (!validatedFields.success) {
      return {
        fieldErrors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { email, password } = validatedFields.data;

    // 2. Faz a requisição usando o serviço (Clean Architecture)
    const { data, response } = await loginService(email, password);

    // 3. Salva os cookies delegando para a função utilitária
    await saveAuthCookies(data, response);

    // Flag de sucesso para o redirect
    isSuccess = true;
    console.log("✅ Login realizado e cookies salvos com sucesso!");
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Erro ao conectar com o servidor",
    };
  }

  // 4. Redirecionamento seguro (sempre fora do try...catch)
  if (isSuccess) {
    redirect("/dashboard");
  }

  return null;
}
