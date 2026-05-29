"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function toggleFavorite(tequilaId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "not_authenticated" as const };

  const { data: existing } = await supabase
    .from("favorites")
    .select("tequila_id")
    .eq("user_id", user.id)
    .eq("tequila_id", tequilaId)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("favorites")
      .delete()
      .eq("user_id", user.id)
      .eq("tequila_id", tequilaId);
  } else {
    await supabase.from("favorites").insert({
      user_id: user.id,
      tequila_id: tequilaId,
    });
  }

  revalidatePath("/account");
  revalidatePath(`/tequilas`);
  return { success: true };
}

export async function toggleWishlist(tequilaId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "not_authenticated" as const };

  const { data: existing } = await supabase
    .from("wishlists")
    .select("tequila_id")
    .eq("user_id", user.id)
    .eq("tequila_id", tequilaId)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("wishlists")
      .delete()
      .eq("user_id", user.id)
      .eq("tequila_id", tequilaId);
  } else {
    await supabase.from("wishlists").insert({
      user_id: user.id,
      tequila_id: tequilaId,
    });
  }

  revalidatePath("/account");
  return { success: true };
}
