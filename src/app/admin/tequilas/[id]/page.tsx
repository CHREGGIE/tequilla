import { notFound } from "next/navigation";
import { getAdminProducers, getAdminTequila } from "@/app/actions/admin/tequilas";
import { TequilaForm } from "@/components/admin/tequila-form";
import { ImageManager } from "@/components/admin/image-manager";
import type { TequilaImage } from "@/types/database";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditTequilaPage({ params }: PageProps) {
  const { id } = await params;
  const [tequila, producers] = await Promise.all([
    getAdminTequila(id),
    getAdminProducers(),
  ]);

  if (!tequila) notFound();

  const images = (tequila.tequila_images ?? []) as TequilaImage[];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Edit tequila</h1>
        <p className="text-muted">{tequila.name}</p>
      </div>

      <TequilaForm
        producers={producers}
        initial={{
          id: tequila.id,
          producer_id: tequila.producer_id,
          name: tequila.name,
          type: tequila.type,
          description: tequila.description ?? "",
          additive_free: tequila.additive_free,
          organic: tequila.organic,
          agave_region: tequila.agave_region ?? "",
          abv: tequila.abv?.toString() ?? "",
          production_volume: tequila.production_volume ?? "",
          noma: tequila.noma ?? "",
          price_range: tequila.price_range ?? "$$",
          price_min: tequila.price_min?.toString() ?? "",
          price_max: tequila.price_max?.toString() ?? "",
          tasting_notes: tequila.tasting_notes ?? "",
          featured: tequila.featured,
        }}
      />

      <ImageManager tequilaId={tequila.id} images={images} />
    </div>
  );
}
