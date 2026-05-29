"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleFavorite, toggleWishlist } from "@/app/actions/user-lists";

interface SaveButtonsProps {
  tequilaId: string;
  isFavorite: boolean;
  isWishlisted: boolean;
  isLoggedIn: boolean;
}

export function SaveButtons({
  tequilaId,
  isFavorite,
  isWishlisted,
  isLoggedIn,
}: SaveButtonsProps) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function handleAuthRequired() {
    router.push("/login");
  }

  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (!isLoggedIn) return handleAuthRequired();
          startTransition(async () => {
            await toggleFavorite(tequilaId);
            router.refresh();
          });
        }}
        className={`rounded-full px-4 py-2 text-sm font-medium transition ${
          isFavorite
            ? "bg-emerald-700 text-white"
            : "border border-card-border bg-card hover:border-emerald-600"
        }`}
      >
        {isFavorite ? "★ Favorited" : "☆ Add to Favorites"}
      </button>

      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (!isLoggedIn) return handleAuthRequired();
          startTransition(async () => {
            await toggleWishlist(tequilaId);
            router.refresh();
          });
        }}
        className={`rounded-full px-4 py-2 text-sm font-medium transition ${
          isWishlisted
            ? "bg-accent text-stone-950"
            : "border border-card-border bg-card hover:border-accent"
        }`}
      >
        {isWishlisted ? "✓ On Wishlist" : "+ Add to Wishlist"}
      </button>
    </div>
  );
}
