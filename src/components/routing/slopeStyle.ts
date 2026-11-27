import type { SlopeTier, WalkRouteSegment } from "@/lib/routing/types";

/**
 * Slope tiers are told apart by line shape first (solid / long dash / short dash), color is secondary.
 * `icons` + `iconRepeat` drive google.maps.Polyline dashes, `svgDash` draws the same pattern in the legend.
 */
export const SLOPE_STYLES: Record<
  SlopeTier,
  {
    label: string;
    description: string;
    color: string;
    weight: number;
    /** Dash length is 2 * scale px; null means a solid line. */
    dash: { scale: number; repeatPx: number } | null;
    svgDash: string | undefined;
  }
> = {
  flat: {
    label: "Flat",
    description: "Gentle slope",
    color: "#0f52ba",
    weight: 5,
    dash: null,
    svgDash: undefined,
  },
  moderate: {
    label: "Moderate",
    description: "Noticeable slope",
    color: "#b45309",
    weight: 5,
    dash: { scale: 8, repeatPx: 24 },
    svgDash: "16 8",
  },
  steep: {
    label: "Steep",
    description: "Hard slope, check the % label",
    color: "#b91c1c",
    weight: 6,
    dash: { scale: 2.5, repeatPx: 10 },
    svgDash: "5 5",
  },
};

/** Text for the map label of a segment, or null when it needs none (steep grade and/or suspected stairs). */
export function segmentLabel(seg: WalkRouteSegment): string | null {
  const parts: string[] = [];
  if (seg.slopeTier === "steep") parts.push(`${Math.round(Math.abs(seg.gradePct))}%`);
  if (seg.flags.stepsSuspected) parts.push("Stairs?");
  return parts.length ? parts.join(" ") : null;
}

/** Middle vertex of the segment path (average of the two middle ones for an even count). */
export function segmentMidpoint(points: [number, number][]): { lat: number; lng: number } {
  const a = points[Math.floor((points.length - 1) / 2)];
  const b = points[Math.floor(points.length / 2)];
  return { lat: (a[0] + b[0]) / 2, lng: (a[1] + b[1]) / 2 };
}
