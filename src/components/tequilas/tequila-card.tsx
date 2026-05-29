import { formatTequilaType, formatPriceRange, getInitials } from "@/lib/utils";
import type { TequilaWithProducer } from "@/types/database";
import Link from "next/link";

function BottlePlaceholder({ name }: { name: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent-dark/40 to-stone-900">
      <span className="text-3xl font-bold text-accent-light/80">{getInitials(name)}</span>
    </div>
  );
}

function Badge({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "green" | "amber" }) {
  const styles = {
    default: "bg-stone-800 text-stone-200",
    green: "bg-emerald-900/60 text-emerald-200",
    amber: "bg-amber-900/60 text-amber-200",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${styles[variant]}`}>
      {children}
    </span>
  );
}

export function TequilaCard({ tequila }: { tequila: TequilaWithProducer }) {
  const primaryImage = tequila.tequila_images?.find((img) => img.is_primary)?.url
    ?? tequila.tequila_images?.[0]?.url;

  return (
    <Link
      href={`/tequilas/${tequila.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-card-border bg-card transition hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-stone-900">
        {primaryImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={primaryImage}
            alt={tequila.name}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <BottlePlaceholder name={tequila.name} />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex flex-wrap gap-1.5">
          <Badge>{formatTequilaType(tequila.type)}</Badge>
          {tequila.additive_free && <Badge variant="green">Additive-Free</Badge>}
          {tequila.organic && <Badge variant="amber">Organic</Badge>}
        </div>

        <div>
          <h3 className="font-semibold leading-snug group-hover:text-accent-light">
            {tequila.name}
          </h3>
          <p className="text-sm text-muted">{tequila.producer?.name}</p>
        </div>

        <p className="mt-auto text-sm font-medium text-accent-light">
          {formatPriceRange(tequila.price_range)}
        </p>
      </div>
    </Link>
  );
}
