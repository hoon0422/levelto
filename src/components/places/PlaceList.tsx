"use client";

import type { LatLng } from "@/lib/routing/types";

export type SelectedPlace = { id: string; name: string; location: LatLng };

type Props = { origin: LatLng; onSelect: (place: SelectedPlace) => void };

/** Placeholder: replace with Places nearby search + accessibility-aware ranking (src/lib/scoring/). */
export function PlaceList({ onSelect }: Props) {
  return (
    <div>
      <h2 className="text-lg font-semibold">Nearby places</h2>
      <p className="mt-1 text-sm text-[var(--muted-foreground)]">
        Place search is not connected yet.
      </p>
      <button
        type="button"
        onClick={() =>
          onSelect({
            id: "fixture-trl",
            name: "Toronto Reference Library",
            location: { lat: 43.672, lng: -79.3868 },
          })
        }
        className="mt-3 min-h-11 rounded-lg bg-[var(--primary)] px-4 font-semibold text-[var(--primary-foreground)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
      >
        Show sample route
      </button>
    </div>
  );
}
