"use client";

import type { ReactNode } from "react";
import { AdvancedMarker, APIProvider, Map } from "@vis.gl/react-google-maps";
import type { LatLng } from "@/lib/routing/types";

const STATIONS = [
  { id: "bloor-yonge", name: "Bloor-Yonge Station", position: { lat: 43.6709, lng: -79.3857 } },
  { id: "high-park", name: "High Park Station", position: { lat: 43.6539, lng: -79.467 } },
];

/** Full-screen Google basemap, mounted once at the top level (Maps Platform Terms 3.2.3). */
export function MapShell({ center, children }: { center: LatLng; children?: ReactNode }) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || "DEMO_MAP_ID";

  if (!apiKey) {
    return (
      <p role="alert" className="p-6 text-base">
        Map unavailable: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not set.
      </p>
    );
  }

  return (
    <APIProvider apiKey={apiKey}>
      <Map
        mapId={mapId}
        defaultCenter={center}
        defaultZoom={15}
        gestureHandling="greedy"
        style={{ width: "100%", height: "100%" }}
      >
        {STATIONS.map((s) => (
          <AdvancedMarker key={s.id} position={s.position} title={s.name} />
        ))}
        {children}
      </Map>
    </APIProvider>
  );
}
