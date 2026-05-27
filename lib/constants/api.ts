export const API_ENDPOINTS = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333/api",
  LOGIN: "/sessions",
  LOGOUT: "/sessions",
  REFRESH: "/sessions/refresh",
} as const;

export const COOKIE_CONFIG = {
  TOKEN: {
    name: "token",
    maxAge: 60, // 1 minuto
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
  },
  REFRESH_TOKEN: {
    name: "refreshToken",
    maxAge: 120, // 2 minutos
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
  },
} as const;
