"use client";

import { useState } from "react";
import { getImageUrl } from "@/lib/utils";
import { BottlePlaceholder } from "@/components/tequilas/bottle-placeholder";
import type { TequilaImage } from "@/types/database";

interface TequilaGalleryProps {
  name: string;
  images: TequilaImage[];
  type: string;
  slug: string;
  noma: string | null;
}

export function TequilaGallery({ name, images, type, slug, noma }: TequilaGalleryProps) {
  const placeholder = <BottlePlaceholder name={name} type={type} seed={slug} noma={noma} />;
  const sorted = [...images].sort((a, b) => a.sort_order - b.sort_order);
  const [activeIndex, setActiveIndex] = useState(0);
  const active = sorted[activeIndex];
  const activeSrc = active ? getImageUrl(active.url) : null;

  if (!sorted.length) {
    return (
      <div className="aspect-[3/4] overflow-hidden rounded-2xl border border-card-border">
        {placeholder}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-stone-900">
        {activeSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={activeSrc}
            alt={active.alt_text ?? name}
            className="h-full w-full object-cover"
          />
        ) : (
          placeholder
        )}
      </div>
      {sorted.length > 1 && (
        <div className="flex gap-2">
          {sorted.map((image, index) => {
            const thumbSrc = getImageUrl(image.url);
            return (
              <button
                key={image.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`h-16 w-16 overflow-hidden rounded-lg border-2 ${
                  index === activeIndex ? "border-accent" : "border-transparent"
                }`}
              >
                {thumbSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={thumbSrc}
                    alt={image.alt_text ?? name}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
