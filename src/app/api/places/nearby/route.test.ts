import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CATEGORY_TYPES } from "./categories";
import { POST } from "./route";

const call = (body: unknown) =>
  POST(
    new Request("http://localhost/api/places/nearby", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  );
const base = { origin: { lat: 43.67, lng: -79.38 }, radiusM: 1000 };

describe("POST /api/places/nearby", () => {
  beforeEach(() => {
    vi.stubEnv("GOOGLE_MAPS_SERVER_API_KEY", "test-key");
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("rejects a missing or unknown category with 400", async () => {
    expect((await call(base)).status).toBe(400);
    expect((await call({ ...base, category: "bar" })).status).toBe(400);
  });

  it.each(Object.entries(CATEGORY_TYPES))(
    "maps %s to its Google primary types",
    async (category, types) => {
      const fetchMock = vi.fn(async () => Response.json({ places: [] }));
      vi.stubGlobal("fetch", fetchMock);
      const res = await call({ ...base, category });
      expect(res.status).toBe(200);
      const init = (fetchMock.mock.calls[0] as unknown as [string, RequestInit])[1];
      expect(JSON.parse(init.body as string).includedPrimaryTypes).toEqual(types);
    },
  );
});
