import { redirect } from "next/navigation";
import { TequilaCard } from "@/components/tequilas/tequila-card";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { createClient } from "@/lib/supabase/server";
import { getUserLists } from "@/lib/queries/user-lists";
import { isSupabaseConfigured } from "@/lib/utils";

export default async function AccountPage() {
  if (!isSupabaseConfigured()) redirect("/");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { favorites, wishlist } = await getUserLists(user.id);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Your account</h1>
          <p className="mt-1 text-muted">{user.email}</p>
        </div>
        <SignOutButton />
      </div>

      <section className="mb-16">
        <h2 className="mb-4 text-xl font-semibold">Favorites ({favorites.length})</h2>
        {favorites.length === 0 ? (
          <p className="text-muted">No favorites yet. Browse the catalog to save bottles.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {favorites.map((tequila) => (
              <TequilaCard key={tequila.id} tequila={tequila} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Wishlist ({wishlist.length})</h2>
        {wishlist.length === 0 ? (
          <p className="text-muted">Your wishlist is empty.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {wishlist.map((tequila) => (
              <TequilaCard key={tequila.id} tequila={tequila} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
