"use client";

import { Fragment, useEffect } from "react";
import { AdvancedMarker, Polyline, useMap } from "@vis.gl/react-google-maps";
import { SLOPE_STYLES, segmentLabel, segmentMidpoint } from "@/components/routing/slopeStyle";
import type { WalkRouteResult, WalkRouteSegment } from "@/lib/routing/types";

type Props = { result: WalkRouteResult | null };

function toPath(seg: WalkRouteSegment) {
  return seg.points.map(([lat, lng]) => ({ lat, lng }));
}

/** Draws result.segments. Slope tier = line shape (solid / long dash / short dash); color is secondary. */
export function RouteLayer({ result }: Props) {
  const map = useMap();
  const segments = result?.status === "OK" ? result.segments : null;

  // Fit the map to the route whenever a new result arrives.
  useEffect(() => {
    if (!map || !segments?.length) return;
    const pts = segments.flatMap((s) => s.points);
    map.fitBounds(
      {
        south: Math.min(...pts.map((p) => p[0])),
        north: Math.max(...pts.map((p) => p[0])),
        west: Math.min(...pts.map((p) => p[1])),
        east: Math.max(...pts.map((p) => p[1])),
      },
      { top: 72, right: 48, bottom: 48, left: 48 }, // top room for the end-point label
    );
  }, [map, segments]);

  if (!segments) return null;

  return (
    <>
      {segments.map((seg) => {
        const style = SLOPE_STYLES[seg.slopeTier];
        const path = toPath(seg);
        const dash = style.dash;
        return (
          <Fragment key={seg.edgeId}>
            {/* white casing keeps the line readable on any basemap */}
            <Polyline
              path={path}
              strokeColor="#ffffff"
              strokeOpacity={0.9}
              strokeWeight={style.weight + 4}
              zIndex={1}
            />
            <Polyline
              path={path}
              strokeColor={style.color}
              strokeWeight={style.weight}
              zIndex={2}
              {...(dash
                ? {
                    strokeOpacity: 0,
                    icons: [
                      {
                        icon: {
                          path: "M 0,-1 0,1",
                          strokeOpacity: 1,
                          strokeColor: style.color,
                          strokeWeight: style.weight,
                          scale: dash.scale,
                        },
                        offset: "0",
                        repeat: `${dash.repeatPx}px`,
                      },
                    ],
                  }
                : { strokeOpacity: 1 })}
            />
          </Fragment>
        );
      })}
      {segments.map((seg) => {
        const label = segmentLabel(seg);
        if (!label) return null;
        return (
          <AdvancedMarker
            key={`${seg.edgeId}-label`}
            position={segmentMidpoint(seg.points)}
            zIndex={3}
          >
            <span className="rounded border-2 border-[#0f172a] bg-white px-1.5 py-0.5 text-xs font-bold text-[#0f172a]">
              {label}
            </span>
          </AdvancedMarker>
        );
      })}
    </>
  );
}
