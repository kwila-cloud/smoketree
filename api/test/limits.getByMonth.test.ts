import { LimitsGetByMonth } from "../src/endpoints/limits";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createTestDb } from "./utils";

// Mock AppContext
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

describe("LimitsGetByMonth endpoint", () => {
  let db: any;

  beforeEach(() => {
    db = createTestDb();
    db.seedOrganizations(["org-1", "org-2"]);
  });

  afterEach(() => {
    db.close();
  });

  it("returns the monthly limit for the organization and month", async () => {
    await db.prepare(
      `INSERT INTO monthly_limit (month, segment_limit, updated_at, organization_uuid) VALUES (?, ?, ?, ?)`
    ).bind("2025-06", 1000, "2025-06-01T00:00:00Z", "org-1").run();

    const context = createMockContext(db, "org-1", "2025-06");
    const endpoint = new LimitsGetByMonth();
    const res = await endpoint.handle(context);
    expect(res.data).toEqual({
      month: "2025-06",
      segmentLimit: 1000,
      updatedAt: "2025-06-01T00:00:00Z",
    });
    expect(res.status).toBe(200);
  });

  it("returns 404 if the limit does not exist for the month", async () => {
    const context = createMockContext(db, "org-1", "2025-07");
    const endpoint = new LimitsGetByMonth();
    const res = await endpoint.handle(context);
    expect(res.data).toEqual({ error: "Not found" });
    expect(res.status).toBe(404);
  });

  it("does not return limits from another organization", async () => {
    await db.prepare(
      `INSERT INTO monthly_limit (month, segment_limit, updated_at, organization_uuid) VALUES (?, ?, ?, ?)`
    ).bind("2025-06", 9999, "2025-06-01T00:00:00Z", "org-2").run();

    const context = createMockContext(db, "org-1", "2025-06");
    const endpoint = new LimitsGetByMonth();
    const res = await endpoint.handle(context);
    expect(res.data).toEqual({ error: "Not found" });
    expect(res.status).toBe(404);
  });
});
