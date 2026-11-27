import { describe, expect, it } from "vitest";
import { durationRangeMin, formatDistance, formatDurationRange } from "./format";

describe("durationRangeMin", () => {
  it("is 0.85x to 1.3x of the computed time, in minutes", () => {
    expect(durationRangeMin(1354)).toEqual({ lo: 19, hi: 29 });
    expect(durationRangeMin(3600)).toEqual({ lo: 51, hi: 78 });
  });
  it("never shows 0 minutes", () => {
    expect(durationRangeMin(10)).toEqual({ lo: 1, hi: 1 });
  });
});

describe("formatDurationRange", () => {
  it("collapses equal ends", () => {
    expect(formatDurationRange(1354)).toBe("19 to 29 min");
    expect(formatDurationRange(10)).toBe("1 min");
  });
});

describe("formatDistance", () => {
  it("uses m under 1 km and km above", () => {
    expect(formatDistance(905)).toBe("905 m");
    expect(formatDistance(1234)).toBe("1.2 km");
  });
});
