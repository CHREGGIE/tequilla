"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  deleteTequilaImage,
  fetchImageCandidates,
  importTequilaImageFromUrl,
  setPrimaryImage,
  uploadTequilaImage,
} from "@/app/actions/admin/images";
import { getImageUrl } from "@/lib/utils";
import type { TequilaImage } from "@/types/database";

interface ImageCandidate {
  url: string;
  label: string;
}

interface ImageManagerProps {
  tequilaId: string;
  images: TequilaImage[];
  suggestedUrl?: string;
}

export function ImageManager({ tequilaId, images, suggestedUrl }: ImageManagerProps) {
  const [uploading, setUploading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [importingUrl, setImportingUrl] = useState<string | null>(null);
  const [pageUrl, setPageUrl] = useState(suggestedUrl ?? "");
  const [candidates, setCandidates] = useState<ImageCandidate[]>([]);
  const [sourcePageUrl, setSourcePageUrl] = useState<string | null>(null);
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

  async function handleFindImages(event: React.FormEvent) {
    event.preventDefault();
    if (!pageUrl.trim()) return;

    setFetching(true);
    setError(null);
    setCandidates([]);
    setSourcePageUrl(null);

    try {
      const found = await fetchImageCandidates(pageUrl.trim());
      setCandidates(found);
      setSourcePageUrl(pageUrl.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not fetch images");
    } finally {
      setFetching(false);
    }
  }

  async function handleImport(imageUrl: string) {
    if (!sourcePageUrl) return;

    setImportingUrl(imageUrl);
    setError(null);

    try {
      await importTequilaImageFromUrl(tequilaId, imageUrl, sourcePageUrl);
      setCandidates([]);
      setSourcePageUrl(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed");
    } finally {
      setImportingUrl(null);
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
    <section className="space-y-6 rounded-2xl border border-card-border bg-card p-5">
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

      <div className="space-y-3 rounded-xl border border-card-border bg-stone-950/40 p-4">
        <div>
          <h3 className="text-sm font-semibold">Import from producer website</h3>
          <p className="mt-1 text-sm text-muted">
            Paste a product or producer page URL, pick an image, and it will be saved to your
            storage bucket.
          </p>
        </div>

        <form onSubmit={handleFindImages} className="flex flex-col gap-2 sm:flex-row">
          <input
            type="url"
            value={pageUrl}
            onChange={(event) => setPageUrl(event.target.value)}
            placeholder={suggestedUrl ?? "https://producer.com/products/blanco"}
            className="min-w-0 flex-1 rounded-lg border border-card-border bg-background px-3 py-2 text-sm"
            required
          />
          <button
            type="submit"
            disabled={fetching || !pageUrl.trim()}
            className="rounded-lg bg-stone-800 px-4 py-2 text-sm font-medium text-stone-100 hover:bg-stone-700 disabled:opacity-50"
          >
            {fetching ? "Finding…" : "Find images"}
          </button>
        </form>

        {candidates.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm text-muted">
              {candidates.length} candidate{candidates.length === 1 ? "" : "s"} — click to import
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {candidates.map((candidate) => (
                <button
                  key={candidate.url}
                  type="button"
                  disabled={Boolean(importingUrl)}
                  onClick={() => handleImport(candidate.url)}
                  className="overflow-hidden rounded-xl border border-card-border bg-stone-900 text-left transition hover:border-accent disabled:opacity-50"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={candidate.url}
                    alt={candidate.label}
                    className="aspect-[3/4] w-full object-cover"
                    loading="lazy"
                  />
                  <div className="space-y-1 p-2">
                    <p className="text-xs font-medium text-stone-200">{candidate.label}</p>
                    <p className="truncate text-[10px] text-muted">{candidate.url}</p>
                    <p className="text-xs text-accent-light">
                      {importingUrl === candidate.url ? "Importing…" : "Import this image"}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="rounded-lg bg-red-950/50 px-3 py-2 text-sm text-red-200">{error}</p>
      )}

      {images.length === 0 ? (
        <p className="text-sm text-muted">No images yet. Upload a bottle photo or import from a URL.</p>
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
                <div className="space-y-2 p-3">
                  {image.alt_text && (
                    <p className="truncate text-[10px] text-muted" title={image.alt_text}>
                      {image.alt_text}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2">
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
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
