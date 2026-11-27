"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, CircleHelp, X } from "lucide-react";
import type { LatLng } from "@/lib/routing/types";
import {
  NOT_VERIFIED_PENALTY_MIN,
  TIME_RANGE_HIGH,
  TIME_RANGE_LOW,
  estimateWalk,
  rankPlaces,
  type Access,
  type PlaceCandidate,
} from "@/lib/scoring";

export type SelectedPlace = { id: string; name: string; location: LatLng };

type Props = { origin: LatLng; onSelect: (place: SelectedPlace) => void };

type ApiPlace = Pick<PlaceCandidate, "id" | "name" | "location" | "entrance" | "washroom">;
type Loaded =
  | { origin: LatLng; status: "error"; message: string }
  | { origin: LatLng; status: "ready"; places: ApiPlace[] };

const RADIUS_M = 1000;

function AccessBadge({ label, value }: { label: string; value: Access }) {
  const [Icon, text] =
    value === true
      ? [Check, "accessible"]
      : value === false
        ? [X, "not accessible"]
        : [CircleHelp, "no info"];
  return (
    <span className="inline-flex items-center gap-1">
      <Icon aria-hidden className="size-4" />
      {label}: {text}
    </span>
  );
}

export function PlaceList({ origin, onSelect }: Props) {
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  // Loading = no result yet for the current origin.
  const state = loaded && loaded.origin === origin ? loaded : null;
  const [needWashroom, setNeedWashroom] = useState(false);

  useEffect(() => {
    const ctrl = new AbortController();
    fetch("/api/places/nearby", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ origin, radiusM: RADIUS_M }),
      signal: ctrl.signal,
    })
      .then(async (res) => {
        const json = await res.json().catch(() => null);
        if (!res.ok) throw new Error(json?.error?.message ?? `Request failed (${res.status}).`);
        setLoaded({ origin, status: "ready", places: json.places });
      })
      .catch((e: unknown) => {
        if (ctrl.signal.aborted) return;
        setLoaded({
          origin,
          status: "error",
          message: e instanceof Error ? e.message : "Could not load nearby places.",
        });
      });
    return () => ctrl.abort();
  }, [origin]);

  const result = useMemo(() => {
    if (state?.status !== "ready") return null;
    // shortcut: estimateWalk is a straight-line guess; swap for Young's one-to-many routing call.
    const candidates: PlaceCandidate[] = state.places.map((p) => ({
      ...p,
      walk: estimateWalk(origin, p.location),
      walkIsEstimate: true,
    }));
    return rankPlaces(candidates, { needWashroom });
  }, [state, origin, needWashroom]);

  let status = "";
  if (!state) status = "Loading nearby cafes.";
  else if (state.status === "error") status = `Error: ${state.message}`;
  else if (result) status = `${result.ranked.length} cafes found.`;

  return (
    <div>
      <h2 className="text-lg font-semibold">Nearby cafes</h2>
      <p className="mt-1 text-sm text-[var(--muted-foreground)]">
        Sorted by estimated wheelchair travel time. Times are estimates (straight line x 1.3 at 0.75
        m/s), not routed paths.
      </p>

      <label className="mt-3 flex min-h-11 items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          className="size-5"
          checked={needWashroom}
          onChange={(e) => setNeedWashroom(e.target.checked)}
        />
        Need accessible washroom
      </label>

      <p role="status" aria-live="polite" className="mt-2 text-sm font-medium">
        {status}
      </p>

      {result && result.excludedEntrance > 0 && (
        <p className="mt-1 text-sm">
          {result.excludedEntrance} places excluded: entrance not accessible
        </p>
      )}
      {result && result.excludedWashroom > 0 && (
        <p className="mt-1 text-sm">
          {result.excludedWashroom} places excluded: washroom not accessible
        </p>
      )}

      {result && (
        <ul className="mt-3 flex flex-col gap-2">
          {result.ranked.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => onSelect({ id: p.id, name: p.name, location: p.location })}
                className="flex min-h-11 w-full flex-col gap-1 rounded-lg border border-[var(--border)] p-3 text-left text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
              >
                <span className="text-base font-semibold">{p.name}</span>
                <span>
                  About {Math.round(p.rangeMin[0])} to {Math.round(p.rangeMin[1])} min (estimate)
                </span>
                <span>
                  {p.walk.maxAbsGradePct === undefined
                    ? "Max slope: not estimated"
                    : `Max slope: ${p.walk.maxAbsGradePct.toFixed(1)}%`}
                </span>
                <AccessBadge label="Entrance" value={p.entrance} />
                {needWashroom || p.washroom !== null ? (
                  <AccessBadge label="Washroom" value={p.washroom} />
                ) : null}
                {p.notVerified && <span className="font-medium">Not verified, call ahead</span>}
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-4 text-xs text-[var(--muted-foreground)]">
        Ranking: places with no entrance info get +{NOT_VERIFIED_PENALTY_MIN} min (assumed value).
        Displayed range is {TIME_RANGE_LOW} to {TIME_RANGE_HIGH} times the estimate.
      </p>
    </div>
  );
}
