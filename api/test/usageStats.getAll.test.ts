import { UsageStatsGetAll } from "../src/endpoints/usageStats";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Hono } from "hono";
import { fromHono } from "chanfana";
import { requireApiKey } from "../src/auth";
import { Env, ApiKeyType } from "../src/types";
import { Organization } from "../src/entities";
import { createTestDb } from "./utils";


describe("UsageStatsGetAll endpoint", () => {
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
    openapi.get("/api/v1/usage", UsageStatsGetAll);
  });

  afterEach(() => {
    db.close();
  });

  async function simulateRequest(orgUuid: string, apiKeyType: string) {
    const req = new Request(`http://localhost/api/v1/usage`, {
      method: "GET",
      headers: {
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

  it("returns usage stats for all months", async () => {
    // Insert messages for two months
    await db.prepare(
      `INSERT INTO message (uuid, organization_uuid, to_number, content, segments, current_status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind("msg-1", "org-1", "+123", "hi", 2, "sent", "2025-06-01T00:00:00Z", "2025-06-01T00:00:00Z").run();
    await db.prepare(
      `INSERT INTO message (uuid, organization_uuid, to_number, content, segments, current_status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind("msg-2", "org-1", "+123", "yo", 1, "sent", "2025-05-01T00:00:00Z", "2025-05-01T00:00:00Z").run();
    // Insert successful message attmempts
    await db.prepare(
      `INSERT INTO message_attempt (uuid, message_uuid, status, error_message, attempted_at) VALUES (?, ?, ?, ?, ?)`,
    )
      .bind(
        crypto.randomUUID(),
        "msg-1",
        "sent",
        "",
        "2025-06-01T00:00:00Z",
      )
      .run();
    await db.prepare(
      `INSERT INTO message_attempt (uuid, message_uuid, status, error_message, attempted_at) VALUES (?, ?, ?, ?, ?)`,
    )
      .bind(
        crypto.randomUUID(),
        "msg-2",
        "sent",
        "",
        "2025-06-01T00:00:00Z",
      )
      .run();
    // Insert monthly limits
    await db.prepare(
      `INSERT INTO monthly_limit (organization_uuid, month, segment_limit, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`
    ).bind("org-1", "2025-06", 100, "2025-06-01T00:00:00Z", "2025-06-01T00:00:00Z").run();
    await db.prepare(
      `INSERT INTO monthly_limit (organization_uuid, month, segment_limit, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`
    ).bind("org-1", "2025-05", 50, "2025-05-01T00:00:00Z", "2025-05-01T00:00:00Z").run();

    const res = await simulateRequest("org-1", "user");
    const data = await res.json();
    expect(data).toEqual([
      { month: "2025-06", totalMessages: 1, totalSegments: 2, segmentLimit: 100 },
      { month: "2025-05", totalMessages: 1, totalSegments: 1, segmentLimit: 50 },
    ]);
    expect(res.status).toBe(200);
  });

  it("returns an empty array if no messages exist", async () => {
    const res = await simulateRequest("org-1", "user");
    const data = await res.json();
    expect(data).toEqual([]);
    expect(res.status).toBe(200);
  });

  it("does not return usage from another organization", async () => {
    // Insert messages for two orgs, same month
    await db.prepare(
      `INSERT INTO message (uuid, organization_uuid, to_number, content, segments, current_status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind("msg-1", "org-1", "+123", "hi", 2, "sent", "2025-06-01T00:00:00Z", "2025-06-01T00:00:00Z").run();
    await db.prepare(
      `INSERT INTO message (uuid, organization_uuid, to_number, content, segments, current_status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind("msg-2", "org-2", "+456", "yo", 3, "sent", "2025-06-01T00:00:00Z", "2025-06-01T00:00:00Z").run();
    // Insert successful message attmempts
    await db.prepare(
      `INSERT INTO message_attempt (uuid, message_uuid, status, error_message, attempted_at) VALUES (?, ?, ?, ?, ?)`,
    )
      .bind(
        crypto.randomUUID(),
        "msg-1",
        "sent",
        "",
        "2025-06-01T00:00:00Z",
      )
      .run();
    await db.prepare(
      `INSERT INTO message_attempt (uuid, message_uuid, status, error_message, attempted_at) VALUES (?, ?, ?, ?, ?)`,
    )
      .bind(
        crypto.randomUUID(),
        "msg-2",
        "sent",
        "",
        "2025-06-01T00:00:00Z",
      )
      .run();
    // Insert monthly limits for both orgs
    await db.prepare(
      `INSERT INTO monthly_limit (organization_uuid, month, segment_limit, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`
    ).bind("org-1", "2025-06", 100, "2025-06-01T00:00:00Z", "2025-06-01T00:00:00Z").run();
    await db.prepare(
      `INSERT INTO monthly_limit (organization_uuid, month, segment_limit, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`
    ).bind("org-2", "2025-06", 200, "2025-06-01T00:00:00Z", "2025-06-01T00:00:00Z").run();

    // org-1 context should only see its own usage
    const res1 = await simulateRequest("org-1", "user");
    const data1 = await res1.json();
    expect(data1).toEqual([
      { month: "2025-06", totalMessages: 1, totalSegments: 2, segmentLimit: 100 },
    ]);
    expect(res1.status).toBe(200);

    // org-2 context should only see its own usage
    const res2 = await simulateRequest("org-2", "user");
    const data2 = await res2.json();
    expect(data2).toEqual([
      { month: "2025-06", totalMessages: 1, totalSegments: 3, segmentLimit: 200 },
    ]);
    expect(res2.status).toBe(200);
  });
});
