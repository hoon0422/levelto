"use client";

import { AdvancedMarker } from "@vis.gl/react-google-maps";
import type { SelectedPlace } from "./PlaceList";

/** Numbered markers, numbers match the list rank. Render inside the map. */
export function PlaceMarkers({
  places,
  onSelect,
}: {
  places: SelectedPlace[];
  onSelect: (p: SelectedPlace) => void;
}) {
  return places.map((p, i) => (
    <AdvancedMarker
      key={p.id}
      position={p.location}
      title={`${i + 1}. ${p.name}`}
      onClick={() => onSelect(p)}
    >
      <div
        aria-label={`${i + 1}. ${p.name}`}
        className="flex size-8 items-center justify-center rounded-full border-2 border-white bg-[var(--primary)] text-sm font-bold text-[var(--primary-foreground)] shadow"
      >
        {i + 1}
      </div>
    </AdvancedMarker>
  ));
}
