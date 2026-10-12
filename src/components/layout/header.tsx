import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { checkIsAdmin } from "@/lib/admin/auth";
import { isSupabaseConfigured } from "@/lib/utils";
import { Logo } from "@/components/brand/logo";
import { PureDropIcon } from "@/components/brand/icons";
import { MobileNav } from "@/components/layout/mobile-nav";

const NAV = [
  { href: "/tequilas", label: "Tequilas" },
  { href: "/learn", label: "Learn" },
  { href: "/recipes", label: "Recipes" },
];

export async function Header() {
  let user = null;
  let isAdmin = false;

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
    isAdmin = await checkIsAdmin();
  }

  const links = [
    ...NAV,
    ...(isAdmin ? [{ href: "/admin", label: "Admin" }] : []),
    user ? { href: "/account", label: "Account" } : { href: "/login", label: "Sign in" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-card-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="text-2xl" aria-label="Tequillist home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-muted md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-accent">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/tequilas?additive_free=true"
            className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-paper transition hover:bg-accent-hover"
          >
            <PureDropIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Additive-free</span>
            <span className="sm:hidden">AF</span>
          </Link>

          <MobileNav links={links} />
        </div>
      </div>
    </header>
  );
}
