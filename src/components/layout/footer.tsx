import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { getLearnEntries } from "@/lib/learn";

const EXPLORE = [
  { href: "/tequilas", label: "All tequilas" },
  { href: "/tequilas?additive_free=true", label: "Additive-free" },
  { href: "/tequilas?organic=true", label: "Organic" },
  { href: "/recipes", label: "Cocktail recipes" },
];

export function Footer() {
  const guides = getLearnEntries().slice(0, 5);

  return (
    <footer className="mt-auto border-t border-card-border bg-cream-100/60">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-sm space-y-3">
          <Link href="/" className="text-2xl" aria-label="Tequillist home">
            <Logo />
          </Link>
          <p className="text-sm leading-relaxed text-muted">
            The world&apos;s tequila catalog. Who makes what, where, and how — so you can tell
            the real thing from the marketing.
          </p>
        </div>

        <FooterColumn title="Explore" links={EXPLORE} />
        <FooterColumn
          title="Learn"
          links={[
            ...guides.map((e) => ({ href: `/learn/${e.slug}`, label: e.title })),
            { href: "/learn", label: "Everything in Learn →" },
          ]}
        />
      </div>

      <div className="border-t border-card-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-muted sm:flex-row sm:justify-between sm:px-6">
          <p>
            Distillery and NOM data from the{" "}
            <a
              href="https://www.crt.org.mx/empresas-y-marcas-certificadas/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-bone underline-offset-2 hover:text-accent"
            >
              Consejo Regulador del Tequila
            </a>{" "}
            public registry.
          </p>
          <p>
            © {new Date().getFullYear()} Tequillist · For adults of legal drinking age. Sip
            responsibly.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h2 className="mb-3 font-sans text-xs font-semibold uppercase tracking-widest text-oak-700">
        {title}
      </h2>
      <ul className="space-y-2 text-sm">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-foreground/80 transition hover:text-accent">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
