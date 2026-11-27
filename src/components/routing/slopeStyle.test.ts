import { describe, expect, it } from "vitest";
import { FIXTURE_ROUTES } from "@/lib/routing/fixtures";
import { SLOPE_STYLES, segmentLabel, segmentMidpoint } from "./slopeStyle";

const ok = FIXTURE_ROUTES.ok;
if (ok.status !== "OK") throw new Error("fixture");
const [flat, moderate, steep, , stairs] = ok.segments;

describe("SLOPE_STYLES", () => {
  it("tells tiers apart by dash shape, not only color", () => {
    expect(SLOPE_STYLES.flat.dash).toBeNull();
    const m = SLOPE_STYLES.moderate.dash!;
    const s = SLOPE_STYLES.steep.dash!;
    expect(m.scale).toBeGreaterThan(s.scale);
    expect(m.repeatPx).toBeGreaterThan(s.repeatPx);
    expect(new Set(Object.values(SLOPE_STYLES).map((t) => t.svgDash)).size).toBe(3);
  });
});

describe("segmentLabel", () => {
  it("labels steep segments with rounded grade and suspected stairs", () => {
    expect(segmentLabel(flat)).toBeNull();
    expect(segmentLabel(moderate)).toBeNull();
    expect(segmentLabel(steep)).toBe("9%");
    expect(segmentLabel(stairs)).toBe("Stairs?");
    expect(segmentLabel({ ...steep, flags: { ...steep.flags, stepsSuspected: true } })).toBe(
      "9% Stairs?",
    );
  });
});

describe("segmentMidpoint", () => {
  it("uses the middle vertex or the average of the two middle ones", () => {
    expect(
      segmentMidpoint([
        [0, 0],
        [2, 4],
      ]),
    ).toEqual({ lat: 1, lng: 2 });
    expect(
      segmentMidpoint([
        [0, 0],
        [1, 1],
        [5, 5],
      ]),
    ).toEqual({ lat: 1, lng: 1 });
  });
});
