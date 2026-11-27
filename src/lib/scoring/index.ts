import type { LatLng, NearbyWalkSummary } from "@/lib/routing/types";

/** Ranking penalty for places whose accessibility is unknown (assumed value, shown in the UI). */
export const NOT_VERIFIED_PENALTY_MIN = 5;
/** Displayed time range is the computed time times these factors (ADR 0001). */
export const TIME_RANGE_LOW = 0.85;
export const TIME_RANGE_HIGH = 1.3;

/** true = accessible, false = not accessible, null = no info. */
export type Access = boolean | null;

export type PlaceCandidate = {
  id: string;
  name: string;
  location: LatLng;
  entrance: Access;
  washroom: Access;
  walk: NearbyWalkSummary;
  /** True when `walk` comes from the temporary estimate, not the routing engine. */
  walkIsEstimate: boolean;
};

export type RankedPlace = PlaceCandidate & {
  /** Walk time in minutes, unadjusted. */
  walkMin: number;
  /** Time used for ordering: walkMin plus penalties. */
  rankMin: number;
  rangeMin: [number, number];
  notVerified: boolean;
};

export type RankResult = {
  ranked: RankedPlace[];
  excludedEntrance: number;
  excludedWashroom: number;
  /** No walkable result (unroutable or out of coverage), so it cannot be ranked by time. */
  unreachable: number;
};

export function rankPlaces(
  candidates: PlaceCandidate[],
  opts: { needWashroom: boolean },
): RankResult {
  const ranked: RankedPlace[] = [];
  let excludedEntrance = 0;
  let excludedWashroom = 0;
  let unreachable = 0;

  for (const c of candidates) {
    if (c.entrance === false) {
      excludedEntrance++;
      continue;
    }
    if (opts.needWashroom && c.washroom === false) {
      excludedWashroom++;
      continue;
    }
    if (c.walk.status !== "OK" || c.walk.durationSec === undefined) {
      unreachable++;
      continue;
    }
    const walkMin = c.walk.durationSec / 60;
    const notVerified = c.entrance === null || (opts.needWashroom && c.washroom === null);
    const penalty =
      (c.entrance === null ? NOT_VERIFIED_PENALTY_MIN : 0) +
      (opts.needWashroom && c.washroom === null ? NOT_VERIFIED_PENALTY_MIN : 0);
    ranked.push({
      ...c,
      walkMin,
      rankMin: walkMin + penalty,
      rangeMin: [walkMin * TIME_RANGE_LOW, walkMin * TIME_RANGE_HIGH],
      notVerified,
    });
  }

  ranked.sort((a, b) => a.rankMin - b.rankMin);
  return { ranked, excludedEntrance, excludedWashroom, unreachable };
}

const DETOUR_FACTOR = 1.3;
const WALK_SPEED_MPS = 0.75;

function haversineM(a: LatLng, b: LatLng): number {
  const R = 6371000;
  const rad = (d: number) => (d * Math.PI) / 180;
  const h =
    Math.sin(rad(b.lat - a.lat) / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(rad(b.lng - a.lng) / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/**
 * shortcut: straight-line distance x 1.3 at 0.75 m/s, ignores slope, stairs and barriers.
 * Replace with Young's one-to-many routing function once src/lib/routing/ has it.
 */
export function estimateWalk(origin: LatLng, dest: LatLng): NearbyWalkSummary {
  const distanceM = haversineM(origin, dest) * DETOUR_FACTOR;
  return { status: "OK", distanceM, durationSec: distanceM / WALK_SPEED_MPS };
}
