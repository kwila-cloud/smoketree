import { MessageCreate } from "../src/endpoints/messageCreate";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createTestDb } from "./utils";

function createMockContext(db: any, orgUuid: string, body: any = {}) {
  return {
    get: vi.fn((key: string) => {
      if (key === "organization") return { uuid: orgUuid };
    }),
    env: { DB: db },
    req: {
      json: async () => body,
    },
    json: (data: any, status = 200) => ({ data, status }),
  } as any;
}

describe("MessageCreate endpoint", () => {
  let db: any;

  beforeEach(() => {
    db = createTestDb();
    db.seedOrganizations(["org-1"]);
  });

  afterEach(() => {
    db.close();
  });

  it("sends a single message and returns result", async () => {
    // Set a high enough segment limit for the org/month so the message is not rate limited
    await db.prepare(
      `INSERT INTO monthly_limit (organization_uuid, month, segment_limit, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`
    ).bind("org-1", "2025-06", 100, "2025-06-01T00:00:00Z", "2025-06-01T00:00:00Z").run();
    const context = createMockContext(db, "org-1", {
      messages: [
        { to: "+123", content: "hello world" },
      ],
    });
    const endpoint = new MessageCreate();
    const res = await endpoint.handle(context);
    expect(res.status).toBe(200);
    expect(res.data.results.length).toBe(1);
    expect(res.data.results[0].to).toBe("+123");
    expect(res.data.results[0].content).toBe("hello world");
    expect(res.data.results[0].currentStatus).toBe("pending");
  });

  it("sends multiple messages and returns results", async () => {
    const context = createMockContext(db, "org-1", {
      messages: [
        { to: "+123", content: "msg1" },
        { to: "+456", content: "msg2" },
      ],
    });
    const endpoint = new MessageCreate();
    const res = await endpoint.handle(context);
    expect(res.status).toBe(200);
    expect(res.data.results.length).toBe(2);
    expect(res.data.results[0].to).toBe("+123");
    expect(res.data.results[1].to).toBe("+456");
  });

  it("rate limits only the message that exceeds the segment limit", async () => {
    // Set a segment limit of 4
    await db.prepare(
      `INSERT INTO monthly_limit (organization_uuid, month, segment_limit, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`
    ).bind("org-1", "2025-06", 4, "2025-06-01T00:00:00Z", "2025-06-01T00:00:00Z").run();
    // Insert a message that uses 1 segment
    await db.prepare(
      `INSERT INTO message (uuid, organization_uuid, to_number, content, segments, current_status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind("msg-1", "org-1", "+111", "hi", 1, "sent", "2025-06-01T00:00:00Z", "2025-06-01T00:00:00Z").run();
    const context = createMockContext(db, "org-1", {
      messages: [
        { to: "+123", content: "a" }, // 1 segment
        { to: "+456", content: "b".repeat(301) }, // 3 segments
      ],
    });
    const endpoint = new MessageCreate();
    const res = await endpoint.handle(context);
    expect(res.status).toBe(200);
    expect(res.data.results.length).toBe(2);
    expect(res.data.results[0].currentStatus).toBe("pending");
    expect(res.data.results[1].currentStatus).toBe("rate_limited");
  });
});
