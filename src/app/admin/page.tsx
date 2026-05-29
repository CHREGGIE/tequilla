import Link from "next/link";
import { getAdminStats } from "@/app/actions/admin/images";

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  return (
    <div>
      <h1 className="text-3xl font-bold">Admin dashboard</h1>
      <p className="mt-1 text-muted">Manage tequilas, images, and recipes</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-card-border bg-card p-5">
          <p className="text-2xl font-bold text-accent-light">{stats.tequilas}</p>
          <p className="text-sm text-muted">Tequilas</p>
        </div>
        <div className="rounded-2xl border border-card-border bg-card p-5">
          <p className="text-2xl font-bold text-accent-light">{stats.images}</p>
          <p className="text-sm text-muted">Bottle images</p>
        </div>
        <div className="rounded-2xl border border-card-border bg-card p-5">
          <p className="text-2xl font-bold text-accent-light">{stats.recipes}</p>
          <p className="text-sm text-muted">Recipes</p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/admin/tequilas/new"
          className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-stone-950 hover:bg-accent-light"
        >
          Add tequila
        </Link>
        <Link
          href="/admin/recipes/new"
          className="rounded-full border border-card-border px-5 py-2 text-sm font-semibold hover:border-accent"
        >
          Add recipe
        </Link>
      </div>
    </div>
  );
}
