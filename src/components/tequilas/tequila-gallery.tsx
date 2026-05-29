"use client";

import { useState } from "react";
import { getInitials, getImageUrl } from "@/lib/utils";
import type { TequilaImage } from "@/types/database";

interface TequilaGalleryProps {
  name: string;
  images: TequilaImage[];
}

export function TequilaGallery({ name, images }: TequilaGalleryProps) {
  const sorted = [...images].sort((a, b) => a.sort_order - b.sort_order);
  const [activeIndex, setActiveIndex] = useState(0);
  const active = sorted[activeIndex];
  const activeSrc = active ? getImageUrl(active.url) : null;

  if (!sorted.length) {
    return (
      <div className="flex aspect-[3/4] items-center justify-center rounded-2xl bg-gradient-to-br from-accent-dark/40 to-stone-900">
        <span className="text-5xl font-bold text-accent-light/80">{getInitials(name)}</span>
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
          <div className="flex h-full items-center justify-center">
            <span className="text-5xl font-bold text-accent-light/80">{getInitials(name)}</span>
          </div>
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
