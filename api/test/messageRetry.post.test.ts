import { MessageRetry } from "../src/endpoints/messageRetry";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Hono } from "hono";
import { fromHono } from "chanfana";
import { requireApiKey } from "../src/auth";
import { Env, ApiKeyType } from "../src/types";
import { Organization } from "../src/entities";
import { createTestDb } from "./utils";


describe("MessageRetry endpoint", () => {
  let db: any;
  let app: Hono<{
    Bindings: Env;
    Variables: { organization: Organization; apiKeyType: ApiKeyType };
  }>;

  beforeEach(() => {
    db = createTestDb();
    db.seedOrganizations(["org-1"]);
    app = new Hono();
    app.use(requireApiKey);
    const openapi = fromHono(app, { docs_url: "/" });
    openapi.post("/api/v1/messages/:messageUuid/retry", MessageRetry);
  });

  afterEach(() => {
    db.close();
  });

  async function simulateRequest(orgUuid: string, apiKeyType: string, messageUuid: string) {
    const req = new Request(`http://localhost/api/v1/messages/${messageUuid}/retry`, {
      method: "POST",
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

  it("retries a message and sets status to pending", async () => {
    // Insert a message with failed status
    await db.prepare(
      `INSERT INTO message (uuid, organization_uuid, to_number, content, segments, current_status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind("msg-1", "org-1", "+123", "retry me", 1, "failed", "2025-06-01T00:00:00Z", "2025-06-01T00:00:00Z").run();
    // Set a high segment limit
    await db.prepare(
      `INSERT INTO monthly_limit (organization_uuid, month, segment_limit, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`
    ).bind("org-1", "2025-06", 100, "2025-06-01T00:00:00Z", "2025-06-01T00:00:00Z").run();
    const res = await simulateRequest("org-1", "user", "msg-1");
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.uuid).toBe("msg-1");
    expect(data.currentStatus).toBe("pending");
  });

  it("returns 404 if the message does not exist", async () => {
    const res = await simulateRequest("org-1", "user", "not-exist");
    expect(res.status).toBe(404);
    const data = await res.json();
    expect(data.error).toBe("Message not found");
  });

  it("returns 400 if the message is already sent", async () => {
    await db.prepare(
      `INSERT INTO message (uuid, organization_uuid, to_number, content, segments, current_status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind("msg-2", "org-1", "+123", "already sent", 1, "sent", "2025-06-01T00:00:00Z", "2025-06-01T00:00:00Z").run();
    const res = await simulateRequest("org-1", "user", "msg-2");
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Message already sent");
  });

  it("rate limits the retry if over segment limit", async () => {
    await db.prepare(
      `INSERT INTO message (uuid, organization_uuid, to_number, content, segments, current_status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind("msg-3", "org-1", "+123", "over limit", 10, "failed", "2025-06-01T00:00:00Z", "2025-06-01T00:00:00Z").run();
    await db.prepare(
      `INSERT INTO monthly_limit (organization_uuid, month, segment_limit, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`
    ).bind("org-1", "2025-06", 5, "2025-06-01T00:00:00Z", "2025-06-01T00:00:00Z").run();
    const res = await simulateRequest("org-1", "user", "msg-3");
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.currentStatus).toBe("rate_limited");
    expect(data.error).toBe("Rate limited");
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
    const res = await simulateRequest("org-1", "user", "msg-rl");
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.uuid).toBe("msg-rl");
    expect(data.currentStatus).toBe("pending");
  });
});
