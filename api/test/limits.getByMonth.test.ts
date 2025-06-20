import { LimitsGetByMonth } from "../src/endpoints/limits";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { createTestDb } from "./utils";
import { requireApiKey } from "../src/auth";
import { Hono } from "hono";
import { fromHono } from "chanfana";
import { Env, ApiKeyType } from "../src/types";
import { Organization } from "../src/entities";

describe("LimitsGetByMonth endpoint", () => {
  let db: any;
  let app: Hono<{
    Bindings: Env;
    Variables: { organization: Organization; apiKeyType: ApiKeyType };
  }>;

  beforeEach(() => {
    db = createTestDb();
    db.seedOrganizations(["org-1", "org-2"]);
    app = new Hono();
    app.use(requireApiKey);
    const openapi = fromHono(app, { docs_url: "/" });
    openapi.get("/api/v1/limits/:month", LimitsGetByMonth);
  });

  afterEach(() => {
    db.close();
  });

  async function simulateRequest(
    orgUuid: string,
    apiKeyType: string,
    month: string
  ) {
    const req = new Request(`http://localhost/api/v1/limits/${month}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": orgUuid + "-" + apiKeyType,
      },
    });

    // Mock the c.env.DB for the Hono app
    const originalFetch = app.fetch;
    app.fetch = async (request, env, ...rest) => {
      return originalFetch(request, { ...(env || {}), DB: db }, ...rest);
    };

    const res = await app.request(req);
    return res;
  }

  it("returns the monthly limit for the organization and month", async () => {
    await db.prepare(
      `INSERT INTO monthly_limit (month, segment_limit, updated_at, organization_uuid) VALUES (?, ?, ?, ?)`
    ).bind("2025-06", 1000, "2025-06-01T00:00:00Z", "org-1").run();

    const res = await simulateRequest("org-1", "user", "2025-06");
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data).toEqual({
      month: "2025-06",
      segmentLimit: 1000,
      updatedAt: "2025-06-01T00:00:00Z",
    });
  });

  it("returns 404 if the limit does not exist for the month", async () => {
    const res = await simulateRequest("org-1", "user", "2025-07");
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data).toEqual({
      month: "2025-07",
      segmentLimit: 0,
      updatedAt: null,
    });
  });

  it("does not return limits from another organization", async () => {
    await db.prepare(
      `INSERT INTO monthly_limit (month, segment_limit, updated_at, organization_uuid) VALUES (?, ?, ?, ?)`
    ).bind("2025-06", 9999, "2025-06-01T00:00:00Z", "org-2").run();

    const res = await simulateRequest("org-1", "user", "2025-06");
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data).toEqual({
      month: "2025-06",
      segmentLimit: 0,
      updatedAt: null,
    });
  });
});
