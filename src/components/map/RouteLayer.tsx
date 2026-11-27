"use client";

import type { WalkRouteResult } from "@/lib/routing/types";

type Props = { result: WalkRouteResult | null };

/** Placeholder: draw result.segments on the map (dash pattern + % label per slope tier, never color alone). */
export function RouteLayer({ result }: Props) {
  void result;
  return null;
}
