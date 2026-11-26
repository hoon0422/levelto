# LevelTO Geospatial Pipeline

Offline Python preprocessing pipeline managed with `uv`. Builds static 2km x 2km pedestrian graph JSON tiles, TTC GTFS stop index, and municipal washroom datasets into `../public/data/`.

## Setup

```bash
uv sync --directory pipeline
```

## Checks

```bash
uv run --directory pipeline ruff check .
uv run --directory pipeline python -c "import geopandas, rasterio, shapely, pyproj, requests, levelto_pipeline; print('PIPELINE_OK')"
```

## Planned Datasets (`raw/` is gitignored)

- Open Toronto Pedestrian Network (87,105 edges)
- NRCan HRDEM 1m DTM (bare-earth elevation sampling at 5m intervals)
- OpenStreetMap filtered `highway=steps` (excluding indoor/subway stairs)
- Open Toronto Traffic Signals Tabular (APS / LPI crossings)
- Open Toronto TTC Routes and Schedules GTFS (`stops.txt` `wheelchair_boarding`)
- Open Toronto Park Washroom Facilities + CREM Public Washrooms
