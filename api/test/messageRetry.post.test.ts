import { MessageRetry } from "../src/endpoints/messageRetry";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createTestDb } from "./utils";

function createMockContext(db: any, orgUuid: string, params: any = {}) {
  return {
    get: vi.fn((key: string) => {
      if (key === "organization") return { uuid: orgUuid };
    }),
    env: { DB: db },
    req: {
      param: () => params,
    },
    json: (data: any, status = 200) => ({ data, status }),
  } as any;
}

describe("MessageRetry endpoint", () => {
  let db: any;

  beforeEach(() => {
    db = createTestDb();
    db.seedOrganizations(["org-1"]);
  });

  afterEach(() => {
    db.close();
  });

  it("retries a message and sets status to pending", async () => {
    // Insert a message with failed status
    await db.prepare(
      `INSERT INTO message (uuid, organization_uuid, to_number, content, segments, current_status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind("msg-1", "org-1", "+123", "retry me", 1, "failed", "2025-06-01T00:00:00Z", "2025-06-01T00:00:00Z").run();
    // Set a high segment limit
    await db.prepare(
      `INSERT INTO monthly_limit (organization_uuid, month, segment_limit, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`
    ).bind("org-1", "2025-06", 100, "2025-06-01T00:00:00Z", "2025-06-01T00:00:00Z").run();
    const context = createMockContext(db, "org-1", { messageUuid: "msg-1" });
    const endpoint = new MessageRetry();
    const res = await endpoint.handle(context);
    expect(res.status).toBe(200);
    expect(res.data.uuid).toBe("msg-1");
    expect(res.data.currentStatus).toBe("pending");
  });

  it("returns 404 if the message does not exist", async () => {
    const context = createMockContext(db, "org-1", { messageUuid: "not-exist" });
    const endpoint = new MessageRetry();
    const res = await endpoint.handle(context);
    expect(res.status).toBe(404);
    expect(res.data.error).toBe("Message not found");
  });

  it("returns 400 if the message is already sent", async () => {
    await db.prepare(
      `INSERT INTO message (uuid, organization_uuid, to_number, content, segments, current_status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind("msg-2", "org-1", "+123", "already sent", 1, "sent", "2025-06-01T00:00:00Z", "2025-06-01T00:00:00Z").run();
    const context = createMockContext(db, "org-1", { messageUuid: "msg-2" });
    const endpoint = new MessageRetry();
    const res = await endpoint.handle(context);
    expect(res.status).toBe(400);
    expect(res.data.error).toBe("Message already sent");
  });

  it("rate limits the retry if over segment limit", async () => {
    await db.prepare(
      `INSERT INTO message (uuid, organization_uuid, to_number, content, segments, current_status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind("msg-3", "org-1", "+123", "over limit", 10, "failed", "2025-06-01T00:00:00Z", "2025-06-01T00:00:00Z").run();
    await db.prepare(
      `INSERT INTO monthly_limit (organization_uuid, month, segment_limit, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`
    ).bind("org-1", "2025-06", 5, "2025-06-01T00:00:00Z", "2025-06-01T00:00:00Z").run();
    const context = createMockContext(db, "org-1", { messageUuid: "msg-3" });
    const endpoint = new MessageRetry();
    const res = await endpoint.handle(context);
    expect(res.status).toBe(200);
    expect(res.data.currentStatus).toBe("rate_limited");
    expect(res.data.error).toBe("Rate limited");
  });

  it("retries a message that was previously rate limited and sets status to pending if under limit", async () => {
    // Insert a message with rate_limited status
    await db.prepare(
      `INSERT INTO message (uuid, organization_uuid, to_number, content, segments, current_status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind("msg-rl", "org-1", "+123", "try again", 1, "rate_limited", "2025-06-01T00:00:00Z", "2025-06-01T00:00:00Z").run();
    // Set a high enough segment limit for retry to succeed
    await db.prepare(
      `INSERT INTO monthly_limit (organization_uuid, month, segment_limit, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`
    ).bind("org-1", "2025-06", 100, "2025-06-01T00:00:00Z", "2025-06-01T00:00:00Z").run();
    const context = createMockContext(db, "org-1", { messageUuid: "msg-rl" });
    const endpoint = new MessageRetry();
    const res = await endpoint.handle(context);
    expect(res.status).toBe(200);
    expect(res.data.uuid).toBe("msg-rl");
    expect(res.data.currentStatus).toBe("pending");
  });
});
