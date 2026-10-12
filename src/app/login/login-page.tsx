"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/account";
  const urlError = searchParams.get("error");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setSuccess(false);

    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setSuccess(true);
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16 sm:px-6">
      <h1 className="text-3xl">Sign in</h1>
      <p className="mt-2 text-muted">
        Enter your email and we&apos;ll send you a one-time login link — no password needed.
      </p>

      {success ? (
        <div className="mt-8 rounded-2xl border border-agave-300 bg-agave-100/60 p-5">
          <p className="font-medium text-agave-700">Check your email</p>
          <p className="mt-2 text-sm text-muted">
            We sent a login link to <strong className="text-foreground">{email}</strong>.
            Click the link in the email to sign in.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-muted">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-card-border bg-card px-3 py-2 outline-none focus:border-accent"
            />
          </div>

          {(message || urlError) && (
            <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">
              {message ?? urlError}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-accent py-3 text-sm font-semibold text-paper transition hover:bg-accent-hover disabled:opacity-50"
          >
            {loading ? "Sending…" : "Send magic link"}
          </button>
        </form>
      )}

      <p className="mt-6 text-xs text-muted">
        First time? A new account is created automatically when you use the link.
      </p>
    </div>
  );
}
