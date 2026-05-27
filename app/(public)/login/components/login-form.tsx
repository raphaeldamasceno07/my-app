"use client";

import type { LoginState } from "@/lib/types/auth";
import { useActionState } from "react";
import { loginAction } from "../actions";

export function LoginForm() {
  const [state, action, isPending] = useActionState<
    LoginState | null,
    FormData
  >(loginAction, null);

  return (
    <form action={action} className="space-y-6">
      <div>
        <label className="block text-sm text-zinc-400 mb-1">Email</label>
        <input
          className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition"
          name="email"
          type="email"
          required
          placeholder="seu@email.com"
          disabled={isPending}
        />
      </div>

      <div>
        <label className="block text-sm text-zinc-400 mb-1">Senha</label>
        <input
          className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition"
          name="password"
          type="password"
          required
          placeholder="••••••••"
          disabled={isPending}
        />
      </div>

      {state?.error && (
        <div className="bg-red-950/50 border border-red-900 text-red-400 text-sm p-3 rounded-lg">
          {state.error}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-600 py-3 rounded-lg font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {isPending ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
