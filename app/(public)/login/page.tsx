"use client";

import { LoginForm, LoginHeader } from "./components";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">
      <div className="w-full max-w-md p-8 bg-zinc-900 rounded-2xl border border-zinc-800">
        <LoginHeader />
        <LoginForm />
      </div>
    </div>
  );
}
