"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import {
  downloadImage,
  fetchImageCandidatesFromPage,
  type ImageCandidate,
} from "@/lib/admin/url-images";
import { createServiceClient } from "@/lib/supabase/server";

const BUCKET = "tequila-images";

function extractStoragePath(publicUrl: string): string | null {
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const index = publicUrl.indexOf(marker);
  if (index === -1) return null;
  return publicUrl.slice(index + marker.length);
}

async function insertTequilaImage(
  tequilaId: string,
  publicUrl: string,
  altText: string,
) {
  const supabase = createServiceClient();

  const { count } = await supabase
    .from("tequila_images")
    .select("*", { count: "exact", head: true })
    .eq("tequila_id", tequilaId);

  const { error: dbError } = await supabase.from("tequila_images").insert({
    tequila_id: tequilaId,
    url: publicUrl,
    alt_text: altText,
    is_primary: (count ?? 0) === 0,
    sort_order: count ?? 0,
  });

  if (dbError) throw new Error(dbError.message);

  revalidatePath(`/admin/tequilas/${tequilaId}`);
  revalidatePath("/tequilas");
}

async function uploadBufferToStorage(
  tequilaId: string,
  buffer: Buffer,
  contentType: string,
  ext: string,
): Promise<string> {
  const supabase = createServiceClient();
  const path = `${tequilaId}/${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, buffer, { contentType, upsert: false });

  if (uploadError) throw new Error(uploadError.message);

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(path);

  return publicUrl;
}

export async function uploadTequilaImage(tequilaId: string, formData: FormData) {
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("No file provided");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const publicUrl = await uploadBufferToStorage(
    tequilaId,
    buffer,
    file.type,
    file.name.split(".").pop()?.toLowerCase() ?? "jpg",
  );

  await insertTequilaImage(tequilaId, publicUrl, file.name);
}

export async function fetchImageCandidates(pageUrl: string): Promise<ImageCandidate[]> {
  await requireAdmin();
  return fetchImageCandidatesFromPage(pageUrl);
}

export async function importTequilaImageFromUrl(
  tequilaId: string,
  imageUrl: string,
  sourcePageUrl: string,
) {
  await requireAdmin();

  const { buffer, contentType, ext } = await downloadImage(imageUrl);
  const publicUrl = await uploadBufferToStorage(tequilaId, buffer, contentType, ext);
  const altText = `Imported from ${sourcePageUrl}`;

  await insertTequilaImage(tequilaId, publicUrl, altText);
}

export async function setPrimaryImage(imageId: string, tequilaId: string) {
  await requireAdmin();
  const supabase = createServiceClient();

  await supabase
    .from("tequila_images")
    .update({ is_primary: false })
    .eq("tequila_id", tequilaId);

  const { error } = await supabase
    .from("tequila_images")
    .update({ is_primary: true })
    .eq("id", imageId);

  if (error) throw new Error(error.message);

  revalidatePath(`/admin/tequilas/${tequilaId}`);
  revalidatePath("/tequilas");
}

export async function deleteTequilaImage(imageId: string, tequilaId: string) {
  await requireAdmin();
  const supabase = createServiceClient();

  const { data: image } = await supabase
    .from("tequila_images")
    .select("url")
    .eq("id", imageId)
    .single();

  if (image?.url) {
    const path = extractStoragePath(image.url);
    if (path) {
      await supabase.storage.from(BUCKET).remove([path]);
    }
  }

  const { error } = await supabase.from("tequila_images").delete().eq("id", imageId);
  if (error) throw new Error(error.message);

  revalidatePath(`/admin/tequilas/${tequilaId}`);
  revalidatePath("/tequilas");
}

export async function getAdminStats() {
  await requireAdmin();
  const supabase = createServiceClient();

  const [tequilas, recipes, images] = await Promise.all([
    supabase.from("tequilas").select("*", { count: "exact", head: true }),
    supabase.from("recipes").select("*", { count: "exact", head: true }),
    supabase.from("tequila_images").select("*", { count: "exact", head: true }),
  ]);

  return {
    tequilas: tequilas.count ?? 0,
    recipes: recipes.count ?? 0,
    images: images.count ?? 0,
  };
}
