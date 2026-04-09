"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Mode = "login" | "register";

export function AuthScreen() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch(`/api/auth/${mode === "login" ? "login" : "register"}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: mode === "register" ? name : undefined,
        email,
        password,
      }),
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      setError(result?.error ?? "Nao foi possivel autenticar.");
      setLoading(false);
      return;
    }

    router.refresh();
  };

  return (
    <main className="min-h-screen px-4 py-10 flex items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border-[3px] border-dnd-border bg-[linear-gradient(160deg,#f9f0d0_0%,#f4e8c1_40%,#ecddb0_100%)] p-6 shadow-[0_0_0_6px_#5a3e2b,0_0_0_9px_#d4bc7a,0_20px_60px_rgba(0,0,0,0.5)]">
        <div className="text-center mb-5">
          <div className="font-display text-[10px] tracking-[3px] uppercase text-dnd-red">D&D 5e</div>
          <h1 className="font-display text-[26px] text-ink mt-1">Conta e Fichas Salvas</h1>
          <p className="text-[13px] text-ink-light mt-2">
            Entre com email para salvar varias fichas diferentes na nuvem do projeto.
          </p>
        </div>

        <div className="flex gap-2 mb-4">
          {([
            ["login", "Entrar"],
            ["register", "Criar conta"],
          ] as const).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setMode(value);
                setError("");
              }}
              className={`flex-1 rounded border px-3 py-2 text-[12px] font-semibold transition-colors ${
                mode === value
                  ? "border-dnd-red bg-dnd-red/10 text-dnd-red"
                  : "border-dnd-border bg-parchment-100/60 text-ink"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="space-y-3">
          {mode === "register" && (
            <label className="block">
              <span className="block text-[9px] tracking-[2px] uppercase text-dnd-red font-semibold mb-1">Nome</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded border border-dnd-border bg-parchment-100/80 px-3 py-2 text-[14px] text-ink outline-none focus:border-dnd-red"
                placeholder="Seu nome"
              />
            </label>
          )}

          <label className="block">
            <span className="block text-[9px] tracking-[2px] uppercase text-dnd-red font-semibold mb-1">Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded border border-dnd-border bg-parchment-100/80 px-3 py-2 text-[14px] text-ink outline-none focus:border-dnd-red"
              placeholder="voce@email.com"
              required
            />
          </label>

          <label className="block">
            <span className="block text-[9px] tracking-[2px] uppercase text-dnd-red font-semibold mb-1">Senha</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded border border-dnd-border bg-parchment-100/80 px-3 py-2 text-[14px] text-ink outline-none focus:border-dnd-red"
              placeholder="Minimo de 6 caracteres"
              required
            />
          </label>

          {error && (
            <div className="rounded border border-dnd-red/40 bg-dnd-red/10 px-3 py-2 text-[12px] text-dnd-red">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded border border-dnd-red bg-dnd-red/10 px-3 py-2 text-[12px] font-semibold uppercase tracking-[2px] text-dnd-red transition-colors hover:bg-dnd-red/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Processando..." : mode === "login" ? "Entrar" : "Criar Conta"}
          </button>
        </form>
      </div>
    </main>
  );
}