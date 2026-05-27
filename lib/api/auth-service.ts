// lib/api/auth-service.ts (trecho ajustado)
import { API_ENDPOINTS, COOKIE_CONFIG } from "@/lib/constants/api";
import type { LoginResponse } from "@/lib/types/auth";
import { cookies } from "next/headers";

export async function loginService(email: string, password: string) {
  const response = await fetch(
    `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.LOGIN}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    },
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Email ou senha incorretos");
  }

  const data = (await response.json()) as LoginResponse;

  // 👇 Retornamos o JSON E a resposta bruta para o saveAuthCookies conseguir ler os Headers!
  return { data, response };
}

export async function saveAuthCookies(data: LoginResponse, response: Response) {
  const cookieStore = await cookies();

  // Salva o token
  cookieStore.set(COOKIE_CONFIG.TOKEN.name, data.token, {
    httpOnly: COOKIE_CONFIG.TOKEN.httpOnly,
    secure: COOKIE_CONFIG.TOKEN.secure,
    sameSite: COOKIE_CONFIG.TOKEN.sameSite,
    maxAge: COOKIE_CONFIG.TOKEN.maxAge,
  });

  // Extrai e salva o refreshToken do header
  const setCookies = response.headers.getSetCookie();
  const refreshTokenCookie = setCookies.find((c) =>
    c.includes(COOKIE_CONFIG.REFRESH_TOKEN.name),
  );

  if (refreshTokenCookie) {
    const refreshTokenValue = refreshTokenCookie
      .split(";")[0]
      .replace(`${COOKIE_CONFIG.REFRESH_TOKEN.name}=`, "");

    cookieStore.set(COOKIE_CONFIG.REFRESH_TOKEN.name, refreshTokenValue, {
      httpOnly: COOKIE_CONFIG.REFRESH_TOKEN.httpOnly,
      secure: COOKIE_CONFIG.REFRESH_TOKEN.secure,
      sameSite: COOKIE_CONFIG.REFRESH_TOKEN.sameSite,
      maxAge: COOKIE_CONFIG.REFRESH_TOKEN.maxAge,
    });
  }
}

export async function getAccessToken() {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_CONFIG.TOKEN.name)?.value;
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_CONFIG.TOKEN.name);
  cookieStore.delete(COOKIE_CONFIG.REFRESH_TOKEN.name);
}
