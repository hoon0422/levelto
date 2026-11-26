import { describe, expect, it } from "vitest";
import type { WalkRouteRequest, WalkRouteResult } from "@/lib/routing/types";
import { cn } from "@/lib/utils";

describe("project workspace smoke checks", () => {
  it("merges Tailwind classes cleanly", () => {
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
  });

  it("validates routing contract shapes", () => {
    const req: WalkRouteRequest = {
      origin: { lat: 43.6532, lng: -79.3832 },
      destination: { lat: 43.6629, lng: -79.3957 },
      preset: "manual",
      mode: "recommended",
    };

    const res: WalkRouteResult = {
      status: "OUT_OF_COVERAGE",
      nearestNodeDistM: null,
    };

    expect(req.preset).toBe("manual");
    expect(res.status).toBe("OUT_OF_COVERAGE");
  });
});
