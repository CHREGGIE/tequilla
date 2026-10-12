import { formatTequilaType, formatPriceRange, getImageUrl } from "@/lib/utils";
import { BottlePlaceholder } from "@/components/tequilas/bottle-placeholder";
import { LeafIcon, PureDropIcon } from "@/components/brand/icons";
import type { TequilaWithProducer } from "@/types/database";
import Link from "next/link";

function Badge({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "green" | "amber" | "slate" }) {
  const styles = {
    default: "bg-cream-100 text-oak-700",
    green: "bg-agave-100 text-agave-700",
    amber: "bg-copper-300/40 text-copper-700",
    slate: "border border-card-border text-muted",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${styles[variant]}`}>
      {children}
    </span>
  );
}

export function TequilaCard({ tequila }: { tequila: TequilaWithProducer }) {
  const primaryImage = getImageUrl(
    tequila.tequila_images?.find((img) => img.is_primary)?.url
      ?? tequila.tequila_images?.[0]?.url,
  );

  return (
    <Link
      href={`/tequilas/${tequila.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-card-border bg-card transition hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-cream-100">
        {primaryImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={primaryImage}
            alt={tequila.name}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <BottlePlaceholder
            name={tequila.name}
            type={tequila.type}
            seed={tequila.slug}
            noma={tequila.noma}
          />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex flex-wrap gap-1.5">
          <Badge>{formatTequilaType(tequila.type)}</Badge>
          {tequila.additive_free && (
            <Badge variant="green">
              <PureDropIcon className="h-3.5 w-3.5" /> Additive-free
            </Badge>
          )}
          {tequila.organic && (
            <Badge variant="amber">
              <LeafIcon className="h-3.5 w-3.5" /> Organic
            </Badge>
          )}
          {tequila.source === "crt" && <Badge variant="slate">CRT Registry</Badge>}
        </div>

        <div>
          <h3 className="text-lg leading-snug group-hover:text-accent">
            {tequila.name}
          </h3>
          <p className="text-sm text-muted">{tequila.producer?.name}</p>
        </div>

        <p className="mt-auto text-sm font-medium text-accent">
          {tequila.price_range ? formatPriceRange(tequila.price_range) : tequila.source === "crt" ? "NOM " + (tequila.noma ?? "—") : "—"}
        </p>
      </div>
    </Link>
  );
}
