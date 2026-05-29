import { getAdminProducers } from "@/app/actions/admin/tequilas";
import { TequilaForm } from "@/components/admin/tequila-form";

export default async function NewTequilaPage() {
  const producers = await getAdminProducers();

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Add tequila</h1>
      <TequilaForm producers={producers} />
    </div>
  );
}
