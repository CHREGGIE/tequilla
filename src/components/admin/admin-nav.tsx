import Link from "next/link";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/tequilas", label: "Tequilas" },
  { href: "/admin/recipes", label: "Recipes" },
];

export function AdminNav() {
  return (
    <nav className="flex flex-col gap-1">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="rounded-lg px-3 py-2 text-sm font-medium text-muted transition hover:bg-cream-100 hover:text-foreground"
        >
          {link.label}
        </Link>
      ))}
      <Link
        href="/"
        className="mt-4 rounded-lg px-3 py-2 text-sm text-muted transition hover:text-accent"
      >
        ← Back to site
      </Link>
    </nav>
  );
}
