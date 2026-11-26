# LevelTO _(Working Codename)_

Accessible wheelchair and limited-mobility navigation web app for **Toronto Open Data Awards 2026**.

## Mission

Help wheelchair users and people with limited mobility navigate Toronto safely by combining Open Toronto pedestrian infrastructure, bare-earth terrain slope analysis, TTC accessible station verification, municipal accessible washrooms, live road restrictions, and community barrier reports.

## Architecture Overview

- **Pedestrian Graph & Tiling (`pipeline/` -> Supabase Storage `pedestrian-tiles`)**: Offline Python preprocessing joins Open Toronto's Pedestrian Network (87,105 edges) with NRCan HRDEM 1m DTM bare-earth elevation, filtered OSM `highway=steps`, and Traffic Signals (APS) into 2km x 2km static JSON tiles. Cross-border edges are duplicated cleanly across adjacent tiles and deduplicated on client load.
- **Pure Client/Edge Routing (`src/lib/routing/`)**: Directional A*/Dijkstra computes mobility-preset-aware routes (`manual`, `power`, `mobility_aid`) using only local 3x3 tiles in browser memory — allowing instant zero-API re-ranking and re-routing when presets or barrier toggles change.
- **Hybrid TTC Transit Stitching (`POST /api/transit` + `src/lib/transit/`)**: Queries Google Routes API (`TRANSIT` mode, Essentials `X-Goog-FieldMask`), verifies boarding/alighting stops within 50m against Open Toronto TTC GTFS `stops.txt` (`wheelchair_boarding`), and replaces every `WALK` leg with local wheelchair A*.
- **Live Barriers & Quota Protection (`supabase/` + `/api/*`)**: Planned Supabase PostgreSQL + PostGIS schema for crowdsourced barrier/ramp reports and server-side daily API quota guards (migrations to be added in `supabase/migrations/`).

## Open Data Sources

- **City of Toronto Open Data (`open.toronto.ca`)**:
  - Pedestrian Network (87,105 segments)
  - TTC Routes and Schedules (GTFS `stops.txt` wheelchair boarding)
  - Road Restrictions (live construction closures)
  - Traffic Signals Tabular (APS / LPI crossings)
  - Park Washroom Facilities & CREM Public Washrooms
- **External Open Data**:
  - Natural Resources Canada HRDEM 1m DTM (bare-earth terrain elevation)
  - OpenStreetMap filtered `highway=steps`

Detailed dataset audit: [docs/research/open-toronto-datasets.md](docs/research/open-toronto-datasets.md).

## Tech Stack

- **Frontend & API Routes**: Next.js (App Router), TypeScript, Tailwind CSS v4, shadcn/ui, `@vis.gl/react-google-maps`, Zod, Vitest
- **Database**: Supabase (PostgreSQL + PostGIS)
- **Geospatial Pipeline**: Python (`uv`, `geopandas`, `rasterio`, `shapely`, `pyproj`)
- **Deployment**: Vercel

## Folder Structure

- `src/` — Next.js App Router pages, `/api/*` proxies, UI components, pure TS routing/scoring/tile modules
- `public/data/` — TTC stops and municipal washrooms JSON; `tiles/` is a gitignored local staging dir for pedestrian tiles uploaded to Supabase Storage
- `pipeline/` — Offline Python (`uv`) data ingestion, DTM slope enrichment, and tiling scripts
- `supabase/` — PostGIS SQL migrations and config
- `docs/` — Architecture Decision Records (`adr/`), dataset research (`research/`), submission notes (`submission/`)
- `scripts/` — Third-party interactive setup wizard (`setup-third-party.sh`)

## Local Development

### Prerequisites

- Node.js 22+ & `npm`
- `uv` (Python package manager)

### 1. Environment Variables

Copy `.env.example` to `.env` (or complete remaining dashboard steps with `./scripts/setup-third-party.sh`):

```bash
cp .env.example .env
```

### 2. Web App (`npm`)

```bash
npm install
npm run dev
```

Verification commands:

```bash
npm run format:check && npm run typecheck && npm run lint && npm test && npm run build
```

### 3. Geospatial Pipeline (`uv`)

```bash
uv sync --directory pipeline
uv run --directory pipeline ruff check . && uv run --directory pipeline ruff format --check .
```

### 4. Finish Third-Party Setup (Browser Steps)

If provisioning from scratch, run the interactive wizard for Google Maps Studio Map ID, billing budget alerts/quotas, and Vercel deployment:

```bash
./scripts/setup-third-party.sh
```

## Compliance & Accessibility

- **Google Maps Platform Terms 3.2.3**: Places and Routes data are never cached/persisted in the database and are always rendered over a Google Maps basemap. Server-side proxies hide API keys and enforce daily quota caps.
- **WCAG 2.1 AA**: Full keyboard navigation, ARIA landmarks/labels, `>= 4.5:1` contrast, and colorblind-safe slope encodings (dash patterns, icons, and numeric grades).
