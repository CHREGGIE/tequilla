"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

interface Props {
  slug: string;
  title: string;
  excerpt: string;
  children: React.ReactNode;
}

export function TooltipTrigger({ slug, title, excerpt, children }: Props) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const ref = useRef<HTMLSpanElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onPointer = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  // Small delay so the pointer can travel from the trigger into the popover.
  const show = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const hide = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  };

  return (
    <span ref={ref} className="relative inline-block" onMouseEnter={show} onMouseLeave={hide}>
      <button
        type="button"
        aria-describedby={open ? id : undefined}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onFocus={show}
        className="cursor-help underline decoration-oak-400 decoration-dotted underline-offset-4 hover:decoration-accent"
      >
        {children}
      </button>
      {open && (
        <span
          id={id}
          role="tooltip"
          className="absolute left-0 top-full z-40 mt-2 block w-72 rounded-xl border border-card-border bg-card p-4 text-left text-sm font-normal shadow-lg"
        >
          <span className="block font-display text-base font-semibold text-foreground">{title}</span>
          <span className="mt-1 block leading-relaxed text-muted">{excerpt}</span>
          <Link href={`/learn/${slug}`} className="mt-2 inline-block font-medium text-accent hover:underline">
            Read more →
          </Link>
        </span>
      )}
    </span>
  );
}
