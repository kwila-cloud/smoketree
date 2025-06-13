import { LimitsGetAll } from "../src/endpoints/limits";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createTestDb } from "./utils";

// Mock AppContext
function createMockContext(db: any, orgUuid: string) {
  return {
    get: vi.fn((key: string) => {
      if (key === "organization") return { uuid: orgUuid };
    }),
    env: {
      DB: db,
    },
    json: (data: any, status = 200) => ({ data, status }),
  } as any;
}

describe("LimitsGetAll endpoint", () => {
  let db: any;

  beforeEach(() => {
    db = createTestDb();
    db.seedOrganizations(["org-1", "org-2"]);
  });

  afterEach(() => {
    db.close();
  });

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

    const context = createMockContext(db, "org-1");
    const endpoint = new LimitsGetAll();
    const res = await endpoint.handle(context);
    expect(res.data).toEqual([
      { month: "2025-06", segmentLimit: 1000, updatedAt: "2025-06-01T00:00:00Z" },
      { month: "2025-05", segmentLimit: 900, updatedAt: "2025-05-01T00:00:00Z" },
    ]);
    expect(res.status).toBe(200);
  });

  it("returns an empty array if no limits exist", async () => {
    const context = createMockContext(db, "org-1");
    const endpoint = new LimitsGetAll();
    const res = await endpoint.handle(context);
    expect(res.data).toEqual([]);
    expect(res.status).toBe(200);
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

    const context = createMockContext(db, "org-2");
    const endpoint = new LimitsGetAll();
    const res = await endpoint.handle(context);
    expect(res.data).toEqual([
      { month: "2025-06", segmentLimit: 9999, updatedAt: "2025-06-01T00:00:00Z" }
    ]);
    expect(res.status).toBe(200);
  });
});
