import { MessageList } from "../src/endpoints/messageList";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createTestDb } from "./utils";

function createMockContext(db: any, orgUuid: string, query: any = {}) {
  return {
    get: vi.fn((key: string) => {
      if (key === "organization") return { uuid: orgUuid };
    }),
    env: { DB: db },
    req: {
      query: () => query,
    },
    json: (data: any, status = 200) => ({ data, status }),
  } as any;
}

describe("MessageList endpoint", () => {
  let db: any;

  beforeEach(() => {
    db = createTestDb();
    db.seedOrganizations(["org-1", "org-2"]);
  });

  afterEach(() => {
    db.close();
  });

  it("returns messages for the organization", async () => {
    await db.prepare(
      `INSERT INTO message (uuid, organization_uuid, to_number, content, segments, current_status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind("msg-1", "org-1", "+123", "hi", 2, "sent", "2025-06-01T00:00:00Z", "2025-06-01T00:00:00Z").run();
    await db.prepare(
      `INSERT INTO message (uuid, organization_uuid, to_number, content, segments, current_status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind("msg-2", "org-1", "+456", "yo", 1, "failed", "2025-06-02T00:00:00Z", "2025-06-02T00:00:00Z").run();
    await db.prepare(
      `INSERT INTO message (uuid, organization_uuid, to_number, content, segments, current_status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind("msg-3", "org-2", "+789", "no", 1, "sent", "2025-06-03T00:00:00Z", "2025-06-03T00:00:00Z").run();

    const context = createMockContext(db, "org-1");
    const endpoint = new MessageList();
    const res = await endpoint.handle(context);
    expect(res.data.messages.length).toBe(2);
    expect(res.data.total).toBe(2);
    expect(res.data.messages[0].organizationUuid).toBe("org-1");
    expect(res.status).toBe(200);
  });

  it("filters by status", async () => {
    await db.prepare(
      `INSERT INTO message (uuid, organization_uuid, to_number, content, segments, current_status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind("msg-1", "org-1", "+123", "hi", 2, "sent", "2025-06-01T00:00:00Z", "2025-06-01T00:00:00Z").run();
    await db.prepare(
      `INSERT INTO message (uuid, organization_uuid, to_number, content, segments, current_status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind("msg-2", "org-1", "+456", "yo", 1, "failed", "2025-06-02T00:00:00Z", "2025-06-02T00:00:00Z").run();

    const context = createMockContext(db, "org-1", { status: "failed" });
    const endpoint = new MessageList();
    const res = await endpoint.handle(context);
    expect(res.data.messages.length).toBe(1);
    expect(res.data.messages[0].currentStatus).toBe("failed");
    expect(res.data.total).toBe(1);
    expect(res.status).toBe(200);
  });

  it("applies limit", async () => {
    // Insert 15 messages
    for (let i = 0; i < 15; i++) {
      await db.prepare(
        `INSERT INTO message (uuid, organization_uuid, to_number, content, segments, current_status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        `msg-${i}`,
        "org-1",
        "+123",
        `msg${i}`,
        1,
        "sent",
        "2025-06-01T00:00:00Z",
        "2025-06-01T00:00:00Z"
      ).run();
    }
    const endpoint = new MessageList();
    // Request limit 10
    const context = createMockContext(db, "org-1", { limit: 10 });
    const res = await endpoint.handle(context);
    expect(res.data.messages.length).toBe(10);
    expect(res.data.limit).toBe(10);
  });

  it("enforces max limit of 50", async () => {
    // Insert 55 messages
    for (let i = 0; i < 55; i++) {
      await db.prepare(
        `INSERT INTO message (uuid, organization_uuid, to_number, content, segments, current_status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        `msg-${i}`,
        "org-1",
        "+123",
        `msg${i}`,
        1,
        "sent",
        "2025-06-01T00:00:00Z",
        "2025-06-01T00:00:00Z"
      ).run();
    }
    const endpoint = new MessageList();
    // Request limit 100 (should cap at 50)
    const context = createMockContext(db, "org-1", { limit: 100 });
    const res = await endpoint.handle(context);
    expect(res.data.messages.length).toBe(50);
    expect(res.data.limit).toBe(50);
  });

  it("applies offset", async () => {
    // Insert 20 messages
    for (let i = 0; i < 20; i++) {
      await db.prepare(
        `INSERT INTO message (uuid, organization_uuid, to_number, content, segments, current_status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        `msg-${i}`,
        "org-1",
        "+123",
        `msg${i}`,
        1,
        "sent",
        "2025-06-01T00:00:00Z",
        "2025-06-01T00:00:00Z"
      ).run();
    }
    const endpoint = new MessageList();
    // Offset
    const context = createMockContext(db, "org-1", { limit: 10, offset: 10 });
    const res = await endpoint.handle(context);
    expect(res.data.offset).toBe(10);
    expect(res.data.messages.length).toBe(10);
  });

  it("returns empty array if no messages exist", async () => {
    const context = createMockContext(db, "org-1");
    const endpoint = new MessageList();
    const res = await endpoint.handle(context);
    expect(res.data.messages).toEqual([]);
    expect(res.data.total).toBe(0);
    expect(res.status).toBe(200);
  });
});
