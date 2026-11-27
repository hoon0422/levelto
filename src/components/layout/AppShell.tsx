"use client";

import { useState } from "react";
import { MapShell } from "@/components/map/MapShell";
import { RouteLayer } from "@/components/map/RouteLayer";
import { CategoryChips } from "@/components/places/CategoryChips";
import { PlaceMarkers } from "@/components/places/PlaceMarkers";
import type { PlaceCategory } from "@/app/api/places/nearby/categories";
import { PlaceList, type SelectedPlace } from "@/components/places/PlaceList";
import { RouteDetail } from "@/components/routing/RouteDetail";
import { FIXTURE_ROUTES } from "@/lib/routing/fixtures";
import type { LatLng } from "@/lib/routing/types";

const BLOOR_YONGE: LatLng = { lat: 43.6709, lng: -79.3857 };

/** Dev only: ?fixture=unroutable|outOfCoverage swaps the fake result to preview the failure screens. */
function fixtureKey(): keyof typeof FIXTURE_ROUTES {
  const q = new URLSearchParams(window.location.search).get("fixture");
  return q === "unroutable" || q === "outOfCoverage" ? q : "ok";
}

/** App state and layout: results panel first in DOM (keyboard/screen reader), map shown on top on mobile. */
export function AppShell() {
  const [origin] = useState<LatLng>(BLOOR_YONGE); // origin picker comes later
  const [place, setPlace] = useState<SelectedPlace | null>(null);
  const [category, setCategory] = useState<PlaceCategory | null>(null);
  const [ranked, setRanked] = useState<SelectedPlace[]>([]);
  // shortcut: same fixture route for every place, swap for the real router when src/lib/routing lands
  const route = place ? FIXTURE_ROUTES[fixtureKey()] : null;

  return (
    <div className="flex h-dvh flex-col-reverse md:flex-row">
      {/* First in DOM so keyboard reaches the chips first; floats over the map like Google Maps. */}
      <div className="absolute inset-x-2 top-2 z-10 md:left-[416px]">
        <CategoryChips
          value={category}
          onChange={(c) => {
            setCategory(c);
            setPlace(null);
          }}
        />
      </div>
      <section
        aria-label="Results"
        className="min-h-0 flex-[2] overflow-y-auto border-t border-[var(--border)] bg-[var(--background)] p-4 md:w-[400px] md:flex-none md:border-t-0 md:border-r"
      >
        {place && route ? (
          <RouteDetail place={place} result={route} onBack={() => setPlace(null)} />
        ) : (
          <PlaceList origin={origin} category={category} onSelect={setPlace} onRanked={setRanked} />
        )}
      </section>
      <div className="relative min-h-0 flex-[3] md:flex-1">
        <MapShell center={origin}>
          <RouteLayer result={route} />
          {!place && <PlaceMarkers places={ranked} onSelect={setPlace} />}
        </MapShell>
      </div>
    </div>
  );
}
