import Link from "next/link";
import { getAdminTequilas } from "@/app/actions/admin/tequilas";

export default async function AdminTequilasPage() {
  const tequilas = await getAdminTequilas();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tequilas</h1>
          <p className="text-muted">{tequilas.length} entries</p>
        </div>
        <Link
          href="/admin/tequilas/new"
          className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-stone-950 hover:bg-accent-light"
        >
          Add tequila
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-card-border">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-card-border bg-card">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Producer</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Images</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {tequilas.map((tequila) => (
              <tr key={tequila.id} className="border-b border-card-border/50">
                <td className="px-4 py-3 font-medium">{tequila.name}</td>
                <td className="px-4 py-3 text-muted">
                  {(tequila.producer as { name: string } | null)?.name}
                </td>
                <td className="px-4 py-3 text-muted">{tequila.type}</td>
                <td className="px-4 py-3 text-muted">
                  {tequila.tequila_images?.length ?? 0}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/tequilas/${tequila.id}`}
                    className="text-accent-light hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
