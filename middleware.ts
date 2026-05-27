// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const pathname = request.nextUrl.pathname;

  console.log(
    `[Middleware] ${request.method} ${pathname} | Token: ${!!token} | Refresh: ${!!refreshToken}`,
  );

  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      if (refreshToken) {
        console.log("[Middleware] Token expirado → Tentando refresh...");
        try {
          const res = await fetch("http://localhost:3333/api/token/refresh", {
            method: "PATCH",
            headers: {
              Cookie: `refreshToken=${refreshToken}`,
            },
          });

          console.log("[Middleware] Refresh response status:", res.status);

          if (res.ok) {
            const { token: newToken } = await res.json();

            const setCookies = res.headers.getSetCookie();
            const refreshTokenCookie = setCookies.find((c) =>
              c.includes("refreshToken="),
            );
            let refreshTokenValue = refreshToken;

            if (refreshTokenCookie) {
              refreshTokenValue = refreshTokenCookie
                .split(";")[0]
                .replace("refreshToken=", "");
            }

            // 👇 1. A MÁGICA OFICIAL DO NEXT.JS: Clonamos os headers e injetamos os novos cookies
            const requestHeaders = new Headers(request.headers);
            requestHeaders.set(
              "cookie",
              `token=${newToken}; refreshToken=${refreshTokenValue}`,
            );

            // Injetamos os headers atualizados para a requisição continuar
            const response = NextResponse.next({
              request: {
                headers: requestHeaders,
              },
            });

            // 👇 2. Salvamos no navegador (Note o sameSite: "lax" para evitar bloqueios do Chrome no localhost)
            response.cookies.set("token", newToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              maxAge: 60,
            });

            response.cookies.set("refreshToken", refreshTokenValue, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              maxAge: 120,
            });

            console.log(
              "[Middleware] Refresh realizado e injetado nos Server Components!",
            );
            return response;
          }
        } catch (err) {
          console.error("[Middleware] Erro no refresh:", err);
        }
      }

      console.log("[Middleware] Sem autenticação → Redirecionando para login");
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
