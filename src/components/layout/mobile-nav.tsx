"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { MenuIcon } from "@/components/brand/icons";

export function MobileNav({ links }: { links: { href: string; label: string }[] }) {
  const ref = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();

  // The header lives in the root layout and survives client navigation, so close explicitly.
  useEffect(() => {
    if (ref.current) ref.current.open = false;
  }, [pathname]);

  return (
    <details ref={ref} className="relative md:hidden">
      <summary
        className="flex cursor-pointer list-none items-center rounded-full border border-card-border p-2 text-foreground [&::-webkit-details-marker]:hidden"
        aria-label="Menu"
      >
        <MenuIcon className="h-5 w-5" />
      </summary>
      <nav className="absolute right-0 mt-2 flex w-48 flex-col rounded-2xl border border-card-border bg-card p-2 text-sm font-medium shadow-lg">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-xl px-3 py-2 hover:bg-cream-100 hover:text-accent"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </details>
  );
}
