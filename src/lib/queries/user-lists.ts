import { createClient } from "@/lib/supabase/server";
import type { TequilaWithProducer } from "@/types/database";

export async function getUserLists(userId: string) {
  const supabase = await createClient();

  const [favoritesResult, wishlistResult] = await Promise.all([
    supabase
      .from("favorites")
      .select(
        `
        tequila:tequilas(
          *,
          producer:producers(*),
          tequila_images(*)
        )
      `,
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false }),
    supabase
      .from("wishlists")
      .select(
        `
        tequila:tequilas(
          *,
          producer:producers(*),
          tequila_images(*)
        )
      `,
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false }),
  ]);

  const favorites = (favoritesResult.data ?? [])
    .map((row) => (row as unknown as { tequila: TequilaWithProducer | null }).tequila)
    .filter((tequila): tequila is TequilaWithProducer => Boolean(tequila));

  const wishlist = (wishlistResult.data ?? [])
    .map((row) => (row as unknown as { tequila: TequilaWithProducer | null }).tequila)
    .filter((tequila): tequila is TequilaWithProducer => Boolean(tequila));

  return { favorites, wishlist };
}

export async function getUserListStatus(userId: string | undefined, tequilaId: string) {
  if (!userId) return { isFavorite: false, isWishlisted: false };

  const supabase = await createClient();
  const [favorite, wishlist] = await Promise.all([
    supabase
      .from("favorites")
      .select("tequila_id")
      .eq("user_id", userId)
      .eq("tequila_id", tequilaId)
      .maybeSingle(),
    supabase
      .from("wishlists")
      .select("tequila_id")
      .eq("user_id", userId)
      .eq("tequila_id", tequilaId)
      .maybeSingle(),
  ]);

  return {
    isFavorite: Boolean(favorite.data),
    isWishlisted: Boolean(wishlist.data),
  };
}
