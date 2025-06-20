import { LimitsPut } from "../src/endpoints/limits";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { createTestDb } from "./utils";
import { requireApiKey } from "../src/auth";
import { Hono } from "hono";
import { fromHono } from "chanfana";

describe("LimitsPut endpoint", () => {
  let db: any;
  let app: Hono;

  beforeEach(() => {
    db = createTestDb();
    db.seedOrganizations(["org-1"]);
    app = new Hono();
    app.use(requireApiKey);
    const openapi = fromHono(app, { docs_url: "/" });
    openapi.put("/api/v1/limits/:month", LimitsPut);
  });

  afterEach(() => {
    db.close();
  });

  async function simulateRequest(
    orgUuid: string,
    apiKeyType: string,
    month: string,
    segmentLimit: number
  ) {
    const req = new Request(`http://localhost/api/v1/limits/${month}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": orgUuid + "-" + apiKeyType,
      },
      body: JSON.stringify({ segmentLimit }),
    });

    // Mock the c.env.DB for the Hono app
    const originalFetch = app.fetch;
    app.fetch = async (request, env, ...rest) => {
      return originalFetch(request, { ...env, DB: db }, ...rest);
    };

    const res = await app.request(req);
    return res;
  }

  it("forbids non-admin API keys", async () => {
    const res = await simulateRequest("org-1", "user", "2025-06", 1234);
    const data = await res.json();
    expect(res.status).toBe(403);
    expect(data.error).toBe("Forbidden");
  });

  it("inserts a new monthly limit for admin", async () => {
    const res = await simulateRequest("org-1", "admin", "2025-06", 1500);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.month).toBe("2025-06");
    expect(data.segmentLimit).toBe(1500);
    expect(typeof data.updatedAt).toBe("string");
    // Check DB
    const row = await db
      .prepare(
        `SELECT segment_limit FROM monthly_limit WHERE organization_uuid = ? AND month = ?`
      )
      .bind("org-1", "2025-06")
      .first();
    expect(row.segment_limit).toBe(1500);
  });

  it("updates an existing monthly limit for admin", async () => {
    // Insert initial value
    await db
      .prepare(
        `INSERT INTO monthly_limit (month, segment_limit, updated_at, organization_uuid) VALUES (?, ?, CURRENT_TIMESTAMP, ?)`
      )
      .bind("2025-06", 1000, "org-1")
      .run();
    const res = await simulateRequest("org-1", "admin", "2025-06", 2000);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.month).toBe("2025-06");
    expect(data.segmentLimit).toBe(2000);
    expect(typeof data.updatedAt).toBe("string");
    // Check DB
    const row = await db
      .prepare(
        `SELECT segment_limit FROM monthly_limit WHERE organization_uuid = ? AND month = ?`
      )
      .bind("org-1", "2025-06")
      .first();
    expect(row.segment_limit).toBe(2000);
  });
});
