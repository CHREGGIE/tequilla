"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  deleteTequilaImage,
  setPrimaryImage,
  uploadTequilaImage,
} from "@/app/actions/admin/images";
import { getImageUrl } from "@/lib/utils";
import type { TequilaImage } from "@/types/database";

interface ImageManagerProps {
  tequilaId: string;
  images: TequilaImage[];
}

export function ImageManager({ tequilaId, images }: ImageManagerProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    const formData = new FormData();
    formData.set("file", file);

    try {
      await uploadTequilaImage(tequilaId, formData);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function handleSetPrimary(imageId: string) {
    await setPrimaryImage(imageId, tequilaId);
    router.refresh();
  }

  async function handleDelete(imageId: string) {
    if (!confirm("Delete this image?")) return;
    await deleteTequilaImage(imageId, tequilaId);
    router.refresh();
  }

  return (
    <section className="space-y-4 rounded-2xl border border-card-border bg-card p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Bottle images</h2>
        <label className="cursor-pointer rounded-full bg-accent px-4 py-2 text-sm font-semibold text-stone-950 hover:bg-accent-light">
          {uploading ? "Uploading…" : "Upload image"}
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            disabled={uploading}
            onChange={handleUpload}
          />
        </label>
      </div>

      {error && (
        <p className="rounded-lg bg-red-950/50 px-3 py-2 text-sm text-red-200">{error}</p>
      )}

      {images.length === 0 ? (
        <p className="text-sm text-muted">No images yet. Upload a bottle photo (JPEG, PNG, WebP).</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image) => {
            const src = getImageUrl(image.url);
            return (
              <div
                key={image.id}
                className="overflow-hidden rounded-xl border border-card-border bg-stone-900"
              >
                {src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={src} alt={image.alt_text ?? "Bottle"} className="aspect-[3/4] w-full object-cover" />
                ) : null}
                <div className="flex flex-wrap gap-2 p-3">
                  {image.is_primary ? (
                    <span className="rounded-full bg-accent/20 px-2 py-0.5 text-xs text-accent-light">
                      Primary
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSetPrimary(image.id)}
                      className="text-xs text-muted hover:text-accent-light"
                    >
                      Set primary
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDelete(image.id)}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
