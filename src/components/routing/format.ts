// ADR 0001: show time as a range, 0.85x to 1.3x of the computed value.
const LOW = 0.85;
const HIGH = 1.3;

export function durationRangeMin(durationSec: number): { lo: number; hi: number } {
  const lo = Math.max(1, Math.round((durationSec * LOW) / 60));
  const hi = Math.max(lo, Math.round((durationSec * HIGH) / 60));
  return { lo, hi };
}

export function formatDurationRange(durationSec: number): string {
  const { lo, hi } = durationRangeMin(durationSec);
  return lo === hi ? `${lo} min` : `${lo} to ${hi} min`;
}

export function formatDistance(m: number): string {
  return m < 1000 ? `${Math.round(m)} m` : `${(m / 1000).toFixed(1)} km`;
}
