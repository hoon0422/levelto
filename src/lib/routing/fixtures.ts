import type { WalkRouteResult } from "./types";

// Fake routing results so the UI can be built before the real router lands.
// Values are illustrative only (not measured data): College Station -> Toronto Reference Library along Yonge St.

const ok: WalkRouteResult = {
  status: "OK",
  summary: {
    distanceM: 905,
    durationSec: 1354,
    maxAbsGradePct: 10.2,
    totalClimbM: 36.1,
    totalDescentM: 0,
    snapOriginM: 12,
    snapDestM: 18,
    apsCrossingCount: 1,
  },
  segments: [
    {
      edgeId: "fx-1",
      streetName: "Yonge St",
      points: [
        [43.6613, -79.3831],
        [43.664, -79.3838],
      ],
      lengthM: 300,
      gradePct: 1.2,
      maxGradePct: 2.0,
      slopeTier: "flat",
      sidewalk: "both",
      flags: {
        stepsSuspected: false,
        roadRestriction: false,
        userReported: false,
        apsSignal: false,
      },
    },
    {
      edgeId: "fx-2",
      streetName: "Yonge St",
      points: [
        [43.664, -79.3838],
        [43.6668, -79.3845],
      ],
      lengthM: 310,
      gradePct: 5.6,
      maxGradePct: 7.4,
      slopeTier: "moderate",
      sidewalk: "both",
      flags: {
        stepsSuspected: false,
        roadRestriction: true,
        userReported: false,
        apsSignal: false,
      },
    },
    {
      edgeId: "fx-3",
      streetName: "Yonge St",
      points: [
        [43.6668, -79.3845],
        [43.6695, -79.3852],
      ],
      lengthM: 160,
      gradePct: 8.9,
      maxGradePct: 10.2,
      slopeTier: "steep",
      sidewalk: "one",
      flags: {
        stepsSuspected: false,
        roadRestriction: false,
        userReported: false,
        apsSignal: false,
      },
    },
    {
      edgeId: "fx-4",
      streetName: "Bloor St E crossing",
      points: [
        [43.6695, -79.3852],
        [43.6709, -79.3857],
      ],
      lengthM: 25,
      gradePct: 0.8,
      maxGradePct: 1.0,
      slopeTier: "flat",
      sidewalk: "crosswalk",
      flags: {
        stepsSuspected: false,
        roadRestriction: false,
        userReported: false,
        apsSignal: true,
      },
    },
    {
      edgeId: "fx-5",
      streetName: "Yonge St",
      points: [
        [43.6709, -79.3857],
        [43.6716, -79.386],
        [43.672, -79.3868],
      ],
      lengthM: 110,
      gradePct: 0.9,
      maxGradePct: 1.5,
      slopeTier: "flat",
      sidewalk: "both",
      flags: {
        stepsSuspected: true,
        roadRestriction: false,
        userReported: false,
        apsSignal: false,
      },
    },
  ],
  elevationProfile: [
    { distM: 0, elevM: 101.0, gradePct: 1.2, lat: 43.6613, lng: -79.3831 },
    { distM: 300, elevM: 104.6, gradePct: 5.6, lat: 43.664, lng: -79.3838 },
    { distM: 610, elevM: 122.0, gradePct: 8.9, lat: 43.6668, lng: -79.3845 },
    { distM: 770, elevM: 136.2, gradePct: 0.8, lat: 43.6695, lng: -79.3852 },
    { distM: 795, elevM: 136.4, gradePct: 0.9, lat: 43.6709, lng: -79.3857 },
    { distM: 905, elevM: 137.1, gradePct: 0.9, lat: 43.672, lng: -79.3868 },
  ],
  steps: [
    {
      instruction: "Head north on Yonge St",
      maneuver: "depart",
      distanceM: 610,
      durationSec: 713,
      maxGradePct: 7.4,
      location: { lat: 43.6613, lng: -79.3831 },
    },
    {
      instruction: "Continue on Yonge St, steep section ahead",
      maneuver: "straight",
      distanceM: 160,
      durationSec: 356,
      maxGradePct: 10.2,
      location: { lat: 43.6668, lng: -79.3845 },
    },
    {
      instruction: "Cross Bloor St E at the signal",
      maneuver: "crosswalk",
      distanceM: 25,
      durationSec: 55,
      maxGradePct: 1.0,
      location: { lat: 43.6695, lng: -79.3852 },
    },
    {
      instruction: "Arrive at Toronto Reference Library",
      maneuver: "arrive",
      distanceM: 110,
      durationSec: 230,
      maxGradePct: 1.5,
      location: { lat: 43.672, lng: -79.3868 },
    },
  ],
  warnings: [
    {
      code: "STAIR_SUSPECTED",
      severity: "warn",
      message: "Stairs suspected near the entrance (OpenStreetMap, unverified)",
      location: { lat: 43.6716, lng: -79.386 },
    },
  ],
};

const unroutable: WalkRouteResult = {
  status: "UNROUTABLE_UNDER_PRESET",
  reason: "SLOPE_LIMIT_EXCEEDED",
  diagnostic: { minRequiredGradePct: 9.1, blockingWarnings: [] },
};

const outOfCoverage: WalkRouteResult = { status: "OUT_OF_COVERAGE", nearestNodeDistM: 4200 };

export const FIXTURE_ROUTES = { ok, unroutable, outOfCoverage } as const;
