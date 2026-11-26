export type MobilityPresetId = "manual" | "power" | "mobility_aid";

export interface LatLng {
  lat: number;
  lng: number;
}

export interface TileIndexEntry {
  nodes: number;
  edges: number;
  bytes: number;
}

export interface TileIndex {
  version: string;
  origin: LatLng;
  tileSizeDeg: {
    lat: number;
    lng: number;
  };
  tiles: Record<string, TileIndexEntry>;
}

export interface GraphNode {
  lat: number;
  lng: number;
  /** Bare-earth elevation in meters (NRCan HRDEM 1m DTM). */
  z: number;
  /** Accessible Pedestrian Signal present at crossing node. */
  aps?: boolean;
  /** Public street bench nearby. */
  bench?: boolean;
}

export type SidewalkType = "both" | "one" | "none" | "crosswalk";

export interface GraphEdge {
  id: string;
  u: string;
  v: string;
  /** Segment length in meters. */
  len: number;
  name: string;
  sw: SidewalkType;
  /** Average signed grade u -> v (%). Reverse v -> u is -gFwd. */
  gFwd: number;
  /** Peak sampled slope (%) along 5m sub-intervals. */
  maxG: number;
  climbFwd: number;
  climbRev: number;
  /** Filtered OSM highway=steps proximity flag. */
  steps: boolean;
  /** Simplified polyline coordinates [lat, lng][]. */
  pts: [number, number][];
}

export interface GraphTile {
  tileId: string;
  nodes: Record<string, GraphNode>;
  edges: GraphEdge[];
}

export interface WalkRouteRequest {
  origin: LatLng;
  destination: LatLng;
  preset: MobilityPresetId;
  mode?: "recommended" | "shortest" | "diagnostic";
  barriers?: {
    blockedEdgeIds?: Set<string>;
    penaltyEdgeSec?: Map<string, number>;
  };
  snapRadiusM?: number;
}

export type SlopeTier = "flat" | "moderate" | "steep";

export interface WalkRouteSegment {
  edgeId: string;
  streetName: string;
  points: [number, number][];
  lengthM: number;
  gradePct: number;
  maxGradePct: number;
  slopeTier: SlopeTier;
  sidewalk: SidewalkType;
  flags: {
    stepsSuspected: boolean;
    roadRestriction: boolean;
    userReported: boolean;
    apsSignal: boolean;
  };
}

export interface ElevationPoint {
  distM: number;
  elevM: number;
  gradePct: number;
  lat: number;
  lng: number;
}

export interface WalkStep {
  instruction: string;
  maneuver: "depart" | "straight" | "left" | "right" | "crosswalk" | "arrive";
  distanceM: number;
  durationSec: number;
  maxGradePct: number;
  location: LatLng;
}

export interface WalkWarning {
  code: "STAIR_SUSPECTED" | "NO_SIDEWALK" | "STEEP_DOWNHILL" | "SNAP_FAR";
  severity: "info" | "warn" | "critical";
  message: string;
  location: LatLng;
}

export type WalkRouteResult =
  | {
      status: "OK";
      summary: {
        distanceM: number;
        durationSec: number;
        maxAbsGradePct: number;
        totalClimbM: number;
        totalDescentM: number;
        snapOriginM: number;
        snapDestM: number;
        apsCrossingCount: number;
      };
      segments: WalkRouteSegment[];
      elevationProfile: ElevationPoint[];
      steps: WalkStep[];
      warnings: WalkWarning[];
    }
  | {
      status: "UNROUTABLE_UNDER_PRESET";
      reason: "SLOPE_LIMIT_EXCEEDED" | "BARRIER_DISCONNECTED";
      diagnostic?: {
        minRequiredGradePct: number;
        blockingWarnings: string[];
      };
    }
  | {
      status: "OUT_OF_COVERAGE";
      nearestNodeDistM: number | null;
    };

export interface NearbyWalkSummary {
  status: "OK" | "UNROUTABLE_UNDER_PRESET" | "OUT_OF_COVERAGE";
  distanceM?: number;
  durationSec?: number;
  maxAbsGradePct?: number;
  totalClimbM?: number;
  stairWarningCount?: number;
}

export interface TtcStopRecord {
  id: string;
  name: string;
  lat: number;
  lng: number;
  /** GTFS wheelchair_boarding: 1 accessible, 2 inaccessible, 0 unknown. */
  wb: 0 | 1 | 2;
}

export interface WashroomRecord {
  id: string;
  source: "park" | "crem";
  name: string;
  lat: number;
  lng: number;
  accessible: boolean;
  features: string[];
  status: string;
  hours?: string;
}
