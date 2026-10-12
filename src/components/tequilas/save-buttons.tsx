"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleFavorite, toggleWishlist } from "@/app/actions/user-lists";
import { BookmarkIcon, HeartIcon } from "@/components/brand/icons";

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
        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
          isFavorite
            ? "bg-agave-700 text-paper"
            : "border border-card-border bg-card hover:border-agave-500"
        }`}
      >
        <HeartIcon className="h-4 w-4" fill={isFavorite ? "currentColor" : "none"} />
        {isFavorite ? "Favorited" : "Add to favorites"}
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
        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
          isWishlisted
            ? "bg-accent text-paper"
            : "border border-card-border bg-card hover:border-accent"
        }`}
      >
        <BookmarkIcon className="h-4 w-4" fill={isWishlisted ? "currentColor" : "none"} />
        {isWishlisted ? "On your wishlist" : "Add to wishlist"}
      </button>
    </div>
  );
}
