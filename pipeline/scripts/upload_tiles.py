"""Upload generated tiles in ../public/data/tiles/ to the public Supabase Storage bucket."""

import os
import sys
from pathlib import Path

import requests

BUCKET = "pedestrian-tiles"
ROOT = Path(__file__).resolve().parents[2]


def load_env(path: Path) -> dict[str, str]:
    env = {}
    for line in path.read_text().splitlines():
        if "=" in line and not line.lstrip().startswith("#"):
            k, v = line.split("=", 1)
            env[k.strip()] = v.strip().strip("'\"")
    return env


def main(tiles_dir: Path) -> None:
    env = {**load_env(ROOT / ".env"), **os.environ}
    base = env["NEXT_PUBLIC_SUPABASE_URL"].rstrip("/")
    key = env["SUPABASE_SERVICE_ROLE_KEY"]
    files = sorted(tiles_dir.rglob("*.json"))
    if not files:
        sys.exit(f"No .json tiles under {tiles_dir}")
    session = requests.Session()
    session.headers.update(
        {
            "Authorization": f"Bearer {key}",
            "apikey": key,
            "Content-Type": "application/json",
            "x-upsert": "true",
            "cache-control": "3600",
        }
    )
    for f in files:
        name = f.relative_to(tiles_dir).as_posix()
        r = session.post(f"{base}/storage/v1/object/{BUCKET}/{name}", data=f.read_bytes())
        if not r.ok:
            sys.exit(f"FAILED {name}: {r.status_code} {r.text}")
        print(f"uploaded {name}")
    print(f"{len(files)} tiles -> {base}/storage/v1/object/public/{BUCKET}/")


if __name__ == "__main__":
    main(Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "public/data/tiles")
