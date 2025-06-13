import { MessageFetch } from "../src/endpoints/messageFetch";
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

describe("MessageFetch endpoint", () => {
  let db: any;

  beforeEach(() => {
    db = createTestDb();
    db.seedOrganizations(["org-1", "org-2"]);
  });

  afterEach(() => {
    db.close();
  });

  it("returns the message if it exists and belongs to the org", async () => {
    await db.prepare(
      `INSERT INTO message (uuid, organization_uuid, to_number, content, segments, current_status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind("msg-1", "org-1", "+123", "hi", 2, "sent", "2025-06-01T00:00:00Z", "2025-06-01T00:00:00Z").run();
    const context = createMockContext(db, "org-1", { messageUuid: "msg-1" });
    const endpoint = new MessageFetch();
    const res = await endpoint.handle(context);
    expect(res.status).toBe(200);
    expect(res.data.uuid).toBe("msg-1");
    expect(res.data.organizationUuid).toBe("org-1");
    expect(res.data.to).toBe("+123");
    expect(res.data.content).toBe("hi");
    expect(res.data.segments).toBe(2);
    expect(res.data.currentStatus).toBe("sent");
  });

  it("returns 404 if the message does not exist", async () => {
    const context = createMockContext(db, "org-1", { messageUuid: "not-exist" });
    const endpoint = new MessageFetch();
    const res = await endpoint.handle(context);
    expect(res.status).toBe(404);
    expect(res.data.error).toBe("Message not found");
  });

  it("returns 404 if the message belongs to another org", async () => {
    await db.prepare(
      `INSERT INTO message (uuid, organization_uuid, to_number, content, segments, current_status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind("msg-2", "org-2", "+456", "yo", 1, "sent", "2025-06-01T00:00:00Z", "2025-06-01T00:00:00Z").run();
    const context = createMockContext(db, "org-1", { messageUuid: "msg-2" });
    const endpoint = new MessageFetch();
    const res = await endpoint.handle(context);
    expect(res.status).toBe(404);
    expect(res.data.error).toBe("Message not found");
  });
});
