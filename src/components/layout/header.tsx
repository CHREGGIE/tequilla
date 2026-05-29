import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/utils";

export async function Header() {
  let user = null;

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
  }

  return (
    <header className="border-b border-card-border bg-background/95 backdrop-blur sticky top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2">
          <span className="text-2xl font-bold tracking-tight">
            Tequ<span className="text-accent-light">illa</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-muted sm:flex">
          <Link href="/tequilas" className="transition hover:text-accent-light">
            Tequilas
          </Link>
          <Link href="/recipes" className="transition hover:text-accent-light">
            Recipes
          </Link>
          {user ? (
            <Link href="/account" className="transition hover:text-accent-light">
              Account
            </Link>
          ) : (
            <Link href="/login" className="transition hover:text-accent-light">
              Sign in
            </Link>
          )}
        </nav>

        <Link
          href="/tequilas?additive_free=true"
          className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-accent-light"
        >
          Additive-Free
        </Link>
      </div>
    </header>
  );
}
