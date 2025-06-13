import { UsageStatsGetByMonth } from "../src/endpoints/usageStats";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createTestDb } from "./utils";

function createMockContext(db: any, orgUuid: string, month: string) {
  return {
    get: vi.fn((key: string) => {
      if (key === "organization") return { uuid: orgUuid };
    }),
    env: { DB: db },
    req: { param: () => ({ month }) },
    json: (data: any, status = 200) => ({ data, status }),
  } as any;
}

describe("UsageStatsGetByMonth endpoint", () => {
  let db: any;

  beforeEach(() => {
    db = createTestDb();
    db.seedOrganizations(["org-1", "org-2"]);
  });

  afterEach(() => {
    db.close();
  });

  it("returns usage stats for the given month", async () => {
    await db.prepare(
      `INSERT INTO message (uuid, organization_uuid, to_number, content, segments, current_status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind("msg-1", "org-1", "+123", "hi", 2, "sent", "2025-06-01T00:00:00Z", "2025-06-01T00:00:00Z").run();
    await db.prepare(
      `INSERT INTO monthly_limit (organization_uuid, month, segment_limit, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`
    ).bind("org-1", "2025-06", 100, "2025-06-01T00:00:00Z", "2025-06-01T00:00:00Z").run();

    const context = createMockContext(db, "org-1", "2025-06");
    const endpoint = new UsageStatsGetByMonth();
    const res = await endpoint.handle(context);
    expect(res.data).toEqual({
      month: "2025-06",
      totalMessages: 1,
      totalSegments: 2,
      segmentLimit: 100,
    });
    expect(res.status).toBe(200);
  });

  it("returns 0s if no messages or limits exist for the month", async () => {
    const context = createMockContext(db, "org-1", "2025-05");
    const endpoint = new UsageStatsGetByMonth();
    const res = await endpoint.handle(context);
    expect(res.data).toEqual({
      month: "2025-05",
      totalMessages: 0,
      totalSegments: 0,
      segmentLimit: 0,
    });
    expect(res.status).toBe(200);
  });

  it("does not return usage from another organization", async () => {
    await db.prepare(
      `INSERT INTO message (uuid, organization_uuid, to_number, content, segments, current_status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind("msg-1", "org-1", "+123", "hi", 2, "sent", "2025-06-01T00:00:00Z", "2025-06-01T00:00:00Z").run();
    await db.prepare(
      `INSERT INTO message (uuid, organization_uuid, to_number, content, segments, current_status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind("msg-2", "org-2", "+456", "yo", 3, "sent", "2025-06-01T00:00:00Z", "2025-06-01T00:00:00Z").run();
    await db.prepare(
      `INSERT INTO monthly_limit (organization_uuid, month, segment_limit, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`
    ).bind("org-1", "2025-06", 100, "2025-06-01T00:00:00Z", "2025-06-01T00:00:00Z").run();
    await db.prepare(
      `INSERT INTO monthly_limit (organization_uuid, month, segment_limit, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`
    ).bind("org-2", "2025-06", 200, "2025-06-01T00:00:00Z", "2025-06-01T00:00:00Z").run();

    // org-1 context
    const context1 = createMockContext(db, "org-1", "2025-06");
    const endpoint = new UsageStatsGetByMonth();
    const res1 = await endpoint.handle(context1);
    expect(res1.data).toEqual({
      month: "2025-06",
      totalMessages: 1,
      totalSegments: 2,
      segmentLimit: 100,
    });
    expect(res1.status).toBe(200);

    // org-2 context
    const context2 = createMockContext(db, "org-2", "2025-06");
    const res2 = await endpoint.handle(context2);
    expect(res2.data).toEqual({
      month: "2025-06",
      totalMessages: 1,
      totalSegments: 3,
      segmentLimit: 200,
    });
    expect(res2.status).toBe(200);
  });
});
