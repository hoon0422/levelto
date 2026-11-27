import { describe, expect, it } from "vitest";
import { NOT_VERIFIED_PENALTY_MIN, estimateWalk, rankPlaces, type PlaceCandidate } from "./index";

const loc = { lat: 43.67, lng: -79.38 };
const mk = (
  id: string,
  min: number,
  entrance: boolean | null,
  washroom: boolean | null = true,
): PlaceCandidate => ({
  id,
  name: id,
  location: loc,
  entrance,
  washroom,
  walk: { status: "OK", durationSec: min * 60 },
  walkIsEstimate: true,
});

describe("rankPlaces", () => {
  it("excludes entrance=false and counts them", () => {
    const r = rankPlaces([mk("a", 5, false), mk("b", 6, true), mk("c", 7, false)], {
      needWashroom: false,
    });
    expect(r.ranked.map((p) => p.id)).toEqual(["b"]);
    expect(r.excludedEntrance).toBe(2);
  });

  it("keeps true as-is and adds the penalty to null", () => {
    const [t, n] = rankPlaces([mk("t", 10, true), mk("n", 10, null)], {
      needWashroom: false,
    }).ranked;
    expect(t.rankMin).toBeCloseTo(10);
    expect(t.notVerified).toBe(false);
    expect(n.rankMin).toBeCloseTo(10 + NOT_VERIFIED_PENALTY_MIN);
    expect(n.notVerified).toBe(true);
  });

  it("sorts by penalized time: a verified far place beats a close unknown one", () => {
    const r = rankPlaces([mk("near-null", 4, null), mk("far-true", 8, true), mk("mid", 5, true)], {
      needWashroom: false,
    });
    expect(r.ranked.map((p) => p.id)).toEqual(["mid", "far-true", "near-null"]);
  });

  it("ignores washroom unless needWashroom is on", () => {
    const list = [mk("a", 5, true, false), mk("b", 6, true, null)];
    const off = rankPlaces(list, { needWashroom: false });
    expect(off.ranked.map((p) => p.id)).toEqual(["a", "b"]);
    expect(off.ranked[1].rankMin).toBeCloseTo(6);
    expect(off.excludedWashroom).toBe(0);
  });

  it("applies the same three-state rule to washrooms when on", () => {
    const r = rankPlaces(
      [mk("no", 1, true, false), mk("unk", 5, true, null), mk("yes", 8, true, true)],
      {
        needWashroom: true,
      },
    );
    expect(r.excludedWashroom).toBe(1);
    expect(r.ranked.map((p) => p.id)).toEqual(["yes", "unk"]);
    expect(r.ranked[1].rankMin).toBeCloseTo(5 + NOT_VERIFIED_PENALTY_MIN);
    expect(r.ranked[1].notVerified).toBe(true);
  });

  it("counts entrance exclusion before washroom exclusion", () => {
    const r = rankPlaces([mk("x", 1, false, false)], { needWashroom: true });
    expect(r.excludedEntrance).toBe(1);
    expect(r.excludedWashroom).toBe(0);
  });

  it("shows a 0.85x to 1.3x range of the unpenalized time", () => {
    const [p] = rankPlaces([mk("a", 10, null)], { needWashroom: false }).ranked;
    expect(p.rangeMin[0]).toBeCloseTo(8.5);
    expect(p.rangeMin[1]).toBeCloseTo(13);
  });

  it("drops places with no walk result", () => {
    const bad: PlaceCandidate = { ...mk("u", 1, true), walk: { status: "OUT_OF_COVERAGE" } };
    const r = rankPlaces([bad], { needWashroom: false });
    expect(r.ranked).toEqual([]);
    expect(r.unreachable).toBe(1);
  });
});

describe("estimateWalk", () => {
  it("is 1.3x straight line at 0.75 m/s", () => {
    const w = estimateWalk({ lat: 43.67, lng: -79.38 }, { lat: 43.68, lng: -79.38 });
    expect(w.distanceM).toBeGreaterThan(1400);
    expect(w.distanceM).toBeLessThan(1500);
    expect(w.durationSec! * 0.75).toBeCloseTo(w.distanceM!);
  });
});
