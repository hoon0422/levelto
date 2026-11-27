import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerEnv } from "@/lib/env";
import { CATEGORY_TYPES, categorySchema } from "./categories";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  category: categorySchema,
  origin: z.object({ lat: z.number().min(-90).max(90), lng: z.number().min(-180).max(180) }),
  radiusM: z.number().positive().max(5000),
});

const FIELD_MASK = "places.id,places.displayName,places.location,places.accessibilityOptions";
const DAILY_LIMIT = 500;

// shortcut: in-memory counter resets on server restart and is per instance, so it is not a hard cap; move to a Supabase counter table when migrations exist.
let quota = { day: "", count: 0 };
function takeQuota(): boolean {
  const day = new Date().toISOString().slice(0, 10);
  if (quota.day !== day) quota = { day, count: 0 };
  if (quota.count >= DAILY_LIMIT) return false;
  quota.count++;
  return true;
}

type GooglePlace = {
  id: string;
  displayName?: { text?: string };
  location?: { latitude: number; longitude: number };
  accessibilityOptions?: {
    wheelchairAccessibleEntrance?: boolean;
    wheelchairAccessibleRestroom?: boolean;
  };
};

const err = (status: number, code: string, message: string) =>
  NextResponse.json({ error: { code, message } }, { status });

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return err(
      400,
      "INVALID_REQUEST",
      "Expected { category, origin: {lat, lng}, radiusM <= 5000 }.",
    );

  const key = getServerEnv().GOOGLE_MAPS_SERVER_API_KEY;
  if (!key) return err(503, "NOT_CONFIGURED", "Place search is not configured on this server.");
  if (!takeQuota())
    return err(429, "DAILY_LIMIT", "Daily place search limit reached. Try again tomorrow.");

  const { origin, radiusM, category } = parsed.data;
  let res: Response;
  try {
    res = await fetch("https://places.googleapis.com/v1/places:searchNearby", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask": FIELD_MASK,
      },
      body: JSON.stringify({
        includedPrimaryTypes: CATEGORY_TYPES[category],
        maxResultCount: 20,
        locationRestriction: {
          circle: { center: { latitude: origin.lat, longitude: origin.lng }, radius: radiusM },
        },
      }),
      cache: "no-store", // Places terms: never cache or store responses.
    });
  } catch {
    return err(502, "UPSTREAM_UNREACHABLE", "Could not reach Google Places.");
  }

  if (!res.ok) {
    const detail = (await res.json().catch(() => null)) as { error?: { message?: string } } | null;
    console.error("places:searchNearby failed", res.status, detail?.error?.message);
    return err(502, "UPSTREAM_ERROR", `Google Places returned ${res.status}.`);
  }

  const data = (await res.json()) as { places?: GooglePlace[] };
  const places = (data.places ?? []).flatMap((p) =>
    p.location
      ? [
          {
            id: p.id,
            name: p.displayName?.text ?? "Unnamed place",
            location: { lat: p.location.latitude, lng: p.location.longitude },
            // Missing field means "no info" (null), not false.
            entrance: p.accessibilityOptions?.wheelchairAccessibleEntrance ?? null,
            washroom: p.accessibilityOptions?.wheelchairAccessibleRestroom ?? null,
          },
        ]
      : [],
  );
  return NextResponse.json({ places });
}
