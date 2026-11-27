"use client";

import type { SelectedPlace } from "@/components/places/PlaceList";
import type { WalkRouteResult } from "@/lib/routing/types";

type Props = { place: SelectedPlace; result: WalkRouteResult; onBack: () => void };

/** Placeholder: replace with route summary, elevation profile, text steps and warnings. */
export function RouteDetail({ place, result, onBack }: Props) {
  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="min-h-11 rounded-lg border border-[var(--border)] px-4 font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
      >
        Back to places
      </button>
      <h2 className="mt-3 text-lg font-semibold">Route to {place.name}</h2>
      <p role="status" className="mt-1 text-sm">
        {result.status === "OK"
          ? `${Math.round(result.summary.distanceM)} m, about ${Math.round(result.summary.durationSec / 60)} min`
          : result.status === "OUT_OF_COVERAGE"
            ? "This start point is outside the covered area."
            : "No route fits your slope limit."}
      </p>
    </div>
  );
}
