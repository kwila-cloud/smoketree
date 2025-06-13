import { LimitsPut } from "../src/endpoints/limits";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createTestDb } from "./utils";

function createMockContext(db: any, orgUuid: string, month: string, apiKeyType: string, segmentLimit: number) {
  return {
    get: vi.fn((key: string) => {
      if (key === "organization") return { uuid: orgUuid };
      if (key === "apiKeyType") return apiKeyType;
    }),
    env: { DB: db },
    req: {
      param: () => ({ month }),
      json: async () => ({ segmentLimit }),
    },
    json: (data: any, status = 200) => ({ data, status }),
  } as any;
}

describe("LimitsPut endpoint", () => {
  let db: any;

  beforeEach(() => {
    db = createTestDb();
    db.seedOrganizations(["org-1"]);
  });

  afterEach(() => {
    db.close();
  });

  it("forbids non-admin API keys", async () => {
    const context = createMockContext(db, "org-1", "2025-06", "user", 1234);
    const endpoint = new LimitsPut();
    const res = await endpoint.handle(context);
    expect(res.status).toBe(403);
    expect(res.data.error).toBe("Forbidden");
  });

  it("inserts a new monthly limit for admin", async () => {
    const context = createMockContext(db, "org-1", "2025-06", "admin", 1500);
    const endpoint = new LimitsPut();
    const res = await endpoint.handle(context);
    expect(res.status).toBe(200);
    expect(res.data.month).toBe("2025-06");
    expect(res.data.segmentLimit).toBe(1500);
    expect(typeof res.data.updatedAt).toBe("string");
    // Check DB
    const row = await db.prepare(
      `SELECT segment_limit FROM monthly_limit WHERE organization_uuid = ? AND month = ?`
    ).bind("org-1", "2025-06").first();
    expect(row.segment_limit).toBe(1500);
  });

  it("updates an existing monthly limit for admin", async () => {
    // Insert initial value
    await db.prepare(
      `INSERT INTO monthly_limit (month, segment_limit, updated_at, organization_uuid) VALUES (?, ?, CURRENT_TIMESTAMP, ?)`
    ).bind("2025-06", 1000, "org-1").run();
    const context = createMockContext(db, "org-1", "2025-06", "admin", 2000);
    const endpoint = new LimitsPut();
    const res = await endpoint.handle(context);
    expect(res.status).toBe(200);
    expect(res.data.month).toBe("2025-06");
    expect(res.data.segmentLimit).toBe(2000);
    expect(typeof res.data.updatedAt).toBe("string");
    // Check DB
    const row = await db.prepare(
      `SELECT segment_limit FROM monthly_limit WHERE organization_uuid = ? AND month = ?`
    ).bind("org-1", "2025-06").first();
    expect(row.segment_limit).toBe(2000);
  });
});
