import Link from "next/link";

export default function HomePage() {
  return (
    <main
      id="main-content"
      className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-6 px-6 py-16"
    >
      <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--muted)] px-3 py-1 text-xs font-semibold">
        <span>Toronto Open Data Awards 2026</span>
        <span aria-hidden="true">·</span>
        <span>Workspace Ready</span>
      </div>

      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        LevelTO — Accessible Toronto Navigation
      </h1>

      <p className="text-base leading-relaxed text-[var(--muted-foreground)]">
        Wheelchair and limited-mobility route planner combining Open Toronto pedestrian network
        tiles, bare-earth terrain slope profiles, TTC GTFS accessibility checks, municipal
        washrooms, and community barrier reports.
      </p>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/api/health"
          className="inline-flex items-center rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--primary-foreground)] hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
        >
          Check API Health (/api/health)
        </Link>
      </div>
    </main>
  );
}
