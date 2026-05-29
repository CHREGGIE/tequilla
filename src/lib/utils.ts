export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function formatTequilaType(type: string): string {
  const labels: Record<string, string> = {
    blanco: "Blanco",
    reposado: "Reposado",
    anejo: "Añejo",
    extra_anejo: "Extra Añejo",
    cristalino: "Cristalino",
  };
  return labels[type] ?? type;
}

export function formatPriceRange(range: string | null): string {
  if (!range) return "—";
  const labels: Record<string, string> = {
    $: "Budget ($)",
    $$: "Mid-range ($$)",
    $$$: "Premium ($$$)",
    $$$$: "Ultra-premium ($$$$)",
  };
  return labels[range] ?? range;
}

export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export function getImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;

  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return url;
  return `${base}/storage/v1/object/public/tequila-images/${url}`;
}
