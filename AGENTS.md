# LevelTO — Agent Guide

Working codename: **`LevelTO`** (`levelto`, renameable before final submission).
Target event: **Toronto Open Data Awards 2026** (submission deadline: **2026-12-04**).

## Tech Stack

- **Web App & API Proxy**: Next.js (App Router) + TypeScript + Tailwind CSS v4 + shadcn/ui config (`npm`)
- **Map & UI**: `@vis.gl/react-google-maps`, Lucide icons, Zod validation, Vitest
- **Database**: Supabase (PostgreSQL + PostGIS) — tables/migrations to be designed collaboratively for crowdsourced barrier reports and API quota tracking
- **Offline Data Pipeline**: Python + `uv` (`geopandas`, `rasterio`, `shapely`, `pyproj`) in `pipeline/`

## Common Commands

- Web dev server: `npm run dev`
- Format write / check: `npm run format` / `npm run format:check`
- Type check: `npm run typecheck`
- Lint: `npm run lint`
- Tests: `npm test`
- Production build: `npm run build`
- Python env sync: `uv sync --directory pipeline`
- Python lint / format check: `uv run --directory pipeline ruff check .` / `uv run --directory pipeline ruff format --check .`

## Architecture Invariants

1. **Static Pedestrian Tiles + Client Routing**:
   - The Open Toronto Pedestrian Network (`87,105` edges) enriched with NRCan HRDEM 1m DTM elevation/slopes and filtered OSM `highway=steps` is generated offline in `pipeline/` as 2km x 2km static JSON tiles under `public/data/tiles/`.
   - Client/pure routing logic lives in `src/lib/routing/` with zero DOM dependencies so it runs cleanly in both browser and unit tests.
   - Do NOT store the pedestrian graph in PostgreSQL/PostGIS.
2. **Supabase PostGIS Scope**:
   - Intended for crowdsourced barrier/accessibility reports (PostGIS `geography(Point, 4326)`) and server-side daily API quota counters once DB schema migrations are added under `supabase/migrations/`.
   - All report writes and rate limiting must go through server API handlers (`SUPABASE_SERVICE_ROLE_KEY`); any IP/spam metadata must never be exposed publicly.
3. **Google Maps Platform Terms 3.2.3 & Quotas**:
   - Always render Google Places / Routes results on top of a Google Maps basemap (`<Map>` mounted once at top level to conserve map loads).
   - **NEVER** persist or cache Google Places responses in the database.
   - Proxy Routes (`computeRoutes`) and Places API requests through Next.js Route Handlers with strict `X-Goog-FieldMask` headers and daily server-side quota caps.
4. **WCAG 2.1 AA Compliance**:
   - Full keyboard navigation, skip links, semantic landmarks, ARIA labels, `>= 4.5:1` contrast, and colorblind-safe slope encodings (combine line dash patterns + glyphs + numeric `%` labels, never color alone).

## Reference Prototype

- The validated hybrid routing logic prototype (`hybrid-routing-prototype.html`) is archived on the throwaway git branch `prototype/hybrid-routing` (intentionally kept out of `main`).
