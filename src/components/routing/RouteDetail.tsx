"use client";

import { useEffect, useRef } from "react";
import { ArrowLeft, Info, OctagonAlert, TriangleAlert } from "lucide-react";
import type { SelectedPlace } from "@/components/places/PlaceList";
import type { ElevationPoint, SlopeTier, WalkRouteResult, WalkWarning } from "@/lib/routing/types";
import { formatDistance, formatDurationRange } from "./format";
import { SLOPE_STYLES } from "./slopeStyle";

type Props = { place: SelectedPlace; result: WalkRouteResult; onBack: () => void };
type OkResult = Extract<WalkRouteResult, { status: "OK" }>;

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]";

export function RouteDetail({ place, result, onBack }: Props) {
  const heading = useRef<HTMLHeadingElement>(null);
  // Move focus to the new view so keyboard and screen reader users land on it.
  useEffect(() => heading.current?.focus(), [result.status]);

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className={`inline-flex min-h-11 items-center gap-2 rounded-lg border border-[var(--border)] px-4 font-semibold ${FOCUS}`}
      >
        <ArrowLeft aria-hidden="true" size={18} />
        Back to places
      </button>
      <h2 ref={heading} tabIndex={-1} className="mt-3 text-lg font-semibold outline-none">
        Route to {place.name}
      </h2>
      {result.status === "OK" ? (
        <OkView result={result} />
      ) : result.status === "UNROUTABLE_UNDER_PRESET" ? (
        <Unroutable result={result} />
      ) : (
        <OutOfCoverage nearestM={result.nearestNodeDistM} />
      )}
    </div>
  );
}

function Unroutable({
  result,
}: {
  result: Extract<WalkRouteResult, { status: "UNROUTABLE_UNDER_PRESET" }>;
}) {
  const min = result.diagnostic?.minRequiredGradePct;
  return (
    <div role="status" className="mt-3 rounded-lg border-2 border-[var(--border)] p-4">
      <p className="flex items-center gap-2 font-semibold">
        <OctagonAlert aria-hidden="true" size={20} />
        No route within your slope limit
      </p>
      {result.reason === "SLOPE_LIMIT_EXCEEDED" ? (
        <p className="mt-2 text-sm">
          Every path from your start point has a section steeper than your current limit.
          {min !== undefined && (
            <> The gentlest route still needs a slope of about {min.toFixed(1)}%.</>
          )}{" "}
          Try another place.
        </p>
      ) : (
        <p className="mt-2 text-sm">
          Reported barriers block every path from your start point. Try another place.
        </p>
      )}
      {!!result.diagnostic?.blockingWarnings.length && (
        <ul className="mt-2 list-disc pl-5 text-sm">
          {result.diagnostic.blockingWarnings.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function OutOfCoverage({ nearestM }: { nearestM: number | null }) {
  return (
    <div role="status" className="mt-3 rounded-lg border-2 border-[var(--border)] p-4">
      <p className="flex items-center gap-2 font-semibold">
        <Info aria-hidden="true" size={20} />
        Your start point is outside the pilot area
      </p>
      <p className="mt-2 text-sm">
        LevelTO currently covers the areas around Bloor-Yonge Station and High Park Station.
        {nearestM !== null && (
          <> The nearest mapped sidewalk is about {formatDistance(nearestM)} away.</>
        )}{" "}
        Choose one of these two stations as your start point.
      </p>
    </div>
  );
}

function OkView({ result }: { result: OkResult }) {
  const { summary } = result;
  const time = formatDurationRange(summary.durationSec);
  return (
    <>
      <p role="status" className="mt-1 text-sm text-[var(--muted-foreground)]">
        Route found: {time}, {formatDistance(summary.distanceM)}, steepest{" "}
        {summary.maxAbsGradePct.toFixed(1)}%.
      </p>

      <h3 className="sr-only">Summary</h3>
      <dl className="mt-3 grid grid-cols-2 gap-2">
        <Stat label="Time (estimate)" value={time} />
        <Stat label="Distance" value={formatDistance(summary.distanceM)} />
        <Stat label="Steepest slope" value={`${summary.maxAbsGradePct.toFixed(1)}%`} />
        <Stat label="Total uphill" value={`${Math.round(summary.totalClimbM)} m`} />
      </dl>
      <p className="mt-2 text-xs text-[var(--muted-foreground)]">
        Time is a range because wheelchair speed varies. Slope and stairs data are estimates.
      </p>

      {result.warnings.length > 0 && <Warnings warnings={result.warnings} />}

      <h3 className="mt-5 font-semibold">Slope key</h3>
      <ul className="mt-2 space-y-1">
        {(Object.keys(SLOPE_STYLES) as SlopeTier[]).map((tier) => {
          const s = SLOPE_STYLES[tier];
          return (
            <li key={tier} className="flex items-center gap-3 text-sm">
              <svg width="48" height="8" aria-hidden="true" className="shrink-0">
                <line
                  x1="0"
                  y1="4"
                  x2="48"
                  y2="4"
                  stroke={s.color}
                  strokeWidth={4}
                  strokeDasharray={s.svgDash}
                />
              </svg>
              <span>
                <strong>{s.label}</strong>: {s.description}
              </span>
            </li>
          );
        })}
        <li className="text-sm">
          <strong>Stairs?</strong> label: stairs suspected, unverified.
        </li>
      </ul>

      <ElevationChart profile={result.elevationProfile} maxGrade={summary.maxAbsGradePct} />

      <h3 className="mt-5 font-semibold">Directions</h3>
      <ol className="mt-2 list-decimal space-y-2 pl-6">
        {result.steps.map((step, i) => (
          <li key={i}>
            {step.instruction}
            <span className="block text-sm text-[var(--muted-foreground)]">
              {formatDistance(step.distanceM)}, steepest {step.maxGradePct.toFixed(1)}%
            </span>
          </li>
        ))}
      </ol>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--border)] p-3">
      <dt className="text-xs text-[var(--muted-foreground)]">{label}</dt>
      <dd className="text-lg font-semibold">{value}</dd>
    </div>
  );
}

const SEVERITY = {
  critical: { text: "Critical", Icon: OctagonAlert },
  warn: { text: "Warning", Icon: TriangleAlert },
  info: { text: "Info", Icon: Info },
} as const;
const SEVERITY_RANK = { critical: 0, warn: 1, info: 2 } as const;
const WARNING_TITLE: Record<WalkWarning["code"], string> = {
  STAIR_SUSPECTED: "Stairs suspected, unverified",
  NO_SIDEWALK: "No sidewalk",
  STEEP_DOWNHILL: "Steep downhill",
  SNAP_FAR: "Start or end is far from the mapped network",
};

function Warnings({ warnings }: { warnings: WalkWarning[] }) {
  const sorted = [...warnings].sort(
    (a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity],
  );
  return (
    <>
      <h3 className="mt-5 font-semibold">Warnings ({warnings.length})</h3>
      <ul className="mt-2 space-y-2">
        {sorted.map((w, i) => {
          const { text, Icon } = SEVERITY[w.severity];
          return (
            <li key={i} className="rounded-lg border-2 border-[var(--border)] p-3 text-sm">
              <p className="flex items-center gap-2 font-semibold">
                <Icon aria-hidden="true" size={18} />
                {text}: {WARNING_TITLE[w.code]}
              </p>
              <p className="mt-1">{w.message}</p>
            </li>
          );
        })}
      </ul>
    </>
  );
}

const W = 320;
const H = 120;
const PAD = { l: 40, r: 8, t: 8, b: 20 };

function ElevationChart({ profile, maxGrade }: { profile: ElevationPoint[]; maxGrade: number }) {
  if (profile.length < 2) return null;
  const maxD = profile[profile.length - 1].distM;
  const elevs = profile.map((p) => p.elevM);
  const minE = Math.min(...elevs);
  const maxE = Math.max(...elevs);
  const x = (d: number) => PAD.l + (d / maxD) * (W - PAD.l - PAD.r);
  const y = (e: number) => H - PAD.b - ((e - minE) / (maxE - minE || 1)) * (H - PAD.t - PAD.b);
  const first = profile[0];
  const last = profile[profile.length - 1];
  const summary = `Elevation goes from ${first.elevM.toFixed(0)} m to ${last.elevM.toFixed(0)} m over ${formatDistance(maxD)}. Steepest slope ${maxGrade.toFixed(1)}%.`;

  return (
    <>
      <h3 className="mt-5 font-semibold">Elevation</h3>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Elevation profile. ${summary} A data table follows.`}
        className="mt-2 h-auto w-full text-[var(--foreground)]"
      >
        <polyline
          points={profile.map((p) => `${x(p.distM)},${y(p.elevM)}`).join(" ")}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        />
        {profile.map((p) => (
          <circle key={p.distM} cx={x(p.distM)} cy={y(p.elevM)} r={3} fill="currentColor" />
        ))}
        <g fill="currentColor" fontSize="10">
          <text x={PAD.l - 4} y={y(maxE) + 3} textAnchor="end">{`${maxE.toFixed(0)} m`}</text>
          <text x={PAD.l - 4} y={y(minE) + 3} textAnchor="end">{`${minE.toFixed(0)} m`}</text>
          <text x={PAD.l} y={H - 5}>
            0
          </text>
          <text x={W - PAD.r} y={H - 5} textAnchor="end">
            {formatDistance(maxD)}
          </text>
        </g>
      </svg>
      <p className="mt-1 text-sm">{summary}</p>
      <details className="mt-2">
        <summary className={`min-h-11 cursor-pointer py-2 text-sm font-semibold ${FOCUS}`}>
          Elevation data table
        </summary>
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Elevation and slope along the route</caption>
          <thead>
            <tr>
              <th scope="col" className="py-1">
                Distance
              </th>
              <th scope="col">Elevation</th>
              <th scope="col">Slope</th>
            </tr>
          </thead>
          <tbody>
            {profile.map((p) => (
              <tr key={p.distM} className="border-t border-[var(--border)]">
                <td className="py-1">{formatDistance(p.distM)}</td>
                <td>{p.elevM.toFixed(1)} m</td>
                <td>{p.gradePct.toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </>
  );
}
