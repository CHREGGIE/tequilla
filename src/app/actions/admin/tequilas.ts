"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { createServiceClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import type { TequilaType, PriceRange } from "@/types/database";

export interface TequilaFormData {
  id?: string;
  producer_id: string;
  name: string;
  type: TequilaType;
  description: string;
  additive_free: boolean;
  organic: boolean;
  agave_region: string;
  abv: string;
  production_volume: string;
  noma: string;
  price_range: PriceRange;
  price_min: string;
  price_max: string;
  tasting_notes: string;
  featured: boolean;
}

function parseTequilaPayload(data: TequilaFormData) {
  const slug = slugify(`${data.name}-${data.type}`);
  return {
    producer_id: data.producer_id,
    name: data.name,
    slug,
    type: data.type,
    description: data.description || null,
    additive_free: data.additive_free,
    organic: data.organic,
    agave_region: data.agave_region || null,
    abv: data.abv ? parseFloat(data.abv) : null,
    production_volume: data.production_volume || null,
    noma: data.noma || null,
    price_range: data.price_range || null,
    price_min: data.price_min ? parseFloat(data.price_min) : null,
    price_max: data.price_max ? parseFloat(data.price_max) : null,
    tasting_notes: data.tasting_notes || null,
    featured: data.featured,
    updated_at: new Date().toISOString(),
  };
}

export async function createTequila(data: TequilaFormData) {
  await requireAdmin();
  const supabase = createServiceClient();
  const payload = parseTequilaPayload(data);

  const { data: tequila, error } = await supabase
    .from("tequilas")
    .insert(payload)
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/tequilas");
  revalidatePath("/admin/tequilas");
  redirect(`/admin/tequilas/${tequila.id}`);
}

export async function updateTequila(data: TequilaFormData) {
  if (!data.id) throw new Error("Missing tequila id");
  await requireAdmin();
  const supabase = createServiceClient();
  const payload = parseTequilaPayload(data);

  const { error } = await supabase
    .from("tequilas")
    .update(payload)
    .eq("id", data.id);

  if (error) throw new Error(error.message);

  revalidatePath("/tequilas");
  revalidatePath(`/tequilas/${payload.slug}`);
  revalidatePath("/admin/tequilas");
  revalidatePath(`/admin/tequilas/${data.id}`);
}

export async function deleteTequila(id: string) {
  await requireAdmin();
  const supabase = createServiceClient();
  const { error } = await supabase.from("tequilas").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/tequilas");
  revalidatePath("/admin/tequilas");
  redirect("/admin/tequilas");
}

export async function getAdminProducers() {
  await requireAdmin();
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("producers")
    .select("*")
    .order("name");
  if (error) throw error;
  return data ?? [];
}

export async function getAdminTequilas() {
  await requireAdmin();
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("tequilas")
    .select("*, producer:producers(name), tequila_images(id)")
    .order("name");
  if (error) throw error;
  return data ?? [];
}

export async function getAdminTequila(id: string) {
  await requireAdmin();
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("tequilas")
    .select("*, producer:producers(*), tequila_images(*)")
    .eq("id", id)
    .single();
  if (error) return null;
  return data;
}
