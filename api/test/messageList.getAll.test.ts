import { MessageList } from "../src/endpoints/messageList";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Hono } from "hono";
import { fromHono } from "chanfana";
import { requireApiKey } from "../src/auth";
import { Env, ApiKeyType } from "../src/types";
import { Organization } from "../src/entities";
import { createTestDb } from "./utils";


describe("MessageList endpoint", () => {
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
    openapi.get("/api/v1/messages", MessageList);
  });

  afterEach(() => {
    db.close();
  });

  async function simulateRequest(orgUuid: string, apiKeyType: string, query: Record<string, any> = {}) {
    const url = new URL("http://localhost/api/v1/messages");
    Object.entries(query).forEach(([k, v]) => url.searchParams.set(k, String(v)));
    const req = new Request(url.toString(), {
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

    const res = await simulateRequest("org-1", "user", {});
    const data = await res.json();
    expect(data.messages.length).toBe(2);
    expect(data.total).toBe(2);
    expect(data.messages[0].organizationUuid).toBe("org-1");
    expect(res.status).toBe(200);
  });

  it("filters by status", async () => {
    await db.prepare(
      `INSERT INTO message (uuid, organization_uuid, to_number, content, segments, current_status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind("msg-1", "org-1", "+123", "hi", 2, "sent", "2025-06-01T00:00:00Z", "2025-06-01T00:00:00Z").run();
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
      `INSERT INTO message (uuid, organization_uuid, to_number, content, segments, current_status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind("msg-2", "org-1", "+456", "yo", 1, "failed", "2025-06-02T00:00:00Z", "2025-06-02T00:00:00Z").run();
    await db.prepare(
      `INSERT INTO message_attempt (uuid, message_uuid, status, error_message, attempted_at) VALUES (?, ?, ?, ?, ?)`,
    )
      .bind(
        crypto.randomUUID(),
        "msg-2",
        "failed",
        "",
        "2025-06-01T00:00:00Z",
      )
      .run();

    const res = await simulateRequest("org-1", "user", { status: "failed" });
    const data = await res.json();
    expect(data.messages.length).toBe(1);
    expect(data.messages[0].currentStatus).toBe("failed");
    expect(data.total).toBe(1);
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
    // Request limit 10
    const res = await simulateRequest("org-1", "user", { limit: 10 });
    const data = await res.json();
    expect(data.messages.length).toBe(10);
    expect(data.limit).toBe(10);
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
    // Request limit 100 (should cap at 50)
    const res = await simulateRequest("org-1", "user", { limit: 100 });
    const data = await res.json();
    expect(data.messages.length).toBe(50);
    expect(data.limit).toBe(50);
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
    // Offset
    const res = await simulateRequest("org-1", "user", { limit: 10, offset: 10 });
    const data = await res.json();
    expect(data.offset).toBe(10);
    expect(data.messages.length).toBe(10);
  });

  it("returns empty array if no messages exist", async () => {
    const res = await simulateRequest("org-1", "user", {});
    const data = await res.json();
    expect(data.messages).toEqual([]);
    expect(data.total).toBe(0);
    expect(res.status).toBe(200);
  });
});
