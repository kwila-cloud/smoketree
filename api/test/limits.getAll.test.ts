import { LimitsGetAll } from "../src/endpoints/limits";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { createTestDb } from "./utils";
import { requireApiKey } from "../src/auth";
import { Hono } from "hono";
import { fromHono } from "chanfana";

describe("LimitsGetAll endpoint", () => {
  let db: any;
  let app: Hono;

  beforeEach(() => {
    db = createTestDb();
    db.seedOrganizations(["org-1", "org-2"]);
    app = new Hono();
    app.use(requireApiKey);
    const openapi = fromHono(app, { docs_url: "/" });
    openapi.get("/api/v1/limits", LimitsGetAll);
  });

  afterEach(() => {
    db.close();
  });

  async function simulateRequest(orgUuid: string, apiKeyType: string) {
    const req = new Request(`http://localhost/api/v1/limits`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": orgUuid + "-" + apiKeyType,
      },
    });

    // Mock the c.env.DB for the Hono app
    const originalFetch = app.fetch;
    app.fetch = async (request, env, ...rest) => {
      return originalFetch(request, { ...env, DB: db }, ...rest);
    };

    const res = await app.request(req);
    return res;
  }

  it("returns all monthly limits for the organization", async () => {
    const allLimits = [
      { month: "2025-06", segmentLimit: 1000, updatedAt: "2025-06-01T00:00:00Z", organization_uuid: "org-1" },
      { month: "2025-05", segmentLimit: 900, updatedAt: "2025-05-01T00:00:00Z", organization_uuid: "org-1" },
    ];

    for (const limit of allLimits) {
      await db.prepare(
        `INSERT INTO monthly_limit (month, segment_limit, updated_at, organization_uuid) VALUES (?, ?, ?, ?)`
      ).bind(limit.month, limit.segmentLimit, limit.updatedAt, limit.organization_uuid).run();
    }

    const res = await simulateRequest("org-1", "user");
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data).toEqual([
      { month: "2025-06", segmentLimit: 1000, updatedAt: "2025-06-01T00:00:00Z" },
      { month: "2025-05", segmentLimit: 900, updatedAt: "2025-05-01T00:00:00Z" },
    ]);
  });

  it("returns an empty array if no limits exist", async () => {
    const res = await simulateRequest("org-1", "user");
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data).toEqual([]);
  });

  it("does not return limits from another organization", async () => {
    const allLimits = [
      { month: "2025-06", segmentLimit: 1000, updatedAt: "2025-06-01T00:00:00Z", organization_uuid: "org-1" },
      { month: "2025-06", segmentLimit: 9999, updatedAt: "2025-06-01T00:00:00Z", organization_uuid: "org-2" },
    ];

    for (const limit of allLimits) {
      await db.prepare(
        `INSERT INTO monthly_limit (month, segment_limit, updated_at, organization_uuid) VALUES (?, ?, ?, ?)`
      ).bind(limit.month, limit.segmentLimit, limit.updatedAt, limit.organization_uuid).run();
    }

    const res = await simulateRequest("org-2", "user");
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data).toEqual([
      { month: "2025-06", segmentLimit: 9999, updatedAt: "2025-06-01T00:00:00Z" }
    ]);
  });
});
