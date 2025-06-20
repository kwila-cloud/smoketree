import { MessageCreate } from "../src/endpoints/messageCreate";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { requireApiKey } from "../src/auth";
import { Hono } from "hono";
import { fromHono } from "chanfana";
import { Env, ApiKeyType } from "../src/types";
import { Organization } from "../src/entities";
import { createTestDb } from "./utils";


describe("MessageCreate endpoint", () => {
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
    openapi.post("/api/v1/messages", MessageCreate);
  });

  afterEach(() => {
    db.close();
  });

  async function simulateRequest(
    orgUuid: string,
    apiKeyType: string,
    body: any
  ) {
    const req = new Request(`http://localhost/api/v1/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": orgUuid + "-" + apiKeyType,
      },
      body: JSON.stringify(body),
    });

    // Mock the c.env.DB for the Hono app
    const originalFetch = app.fetch;
    app.fetch = async (request, env, ...rest) => {
      return originalFetch(request, { ...(env || {}), DB: db }, ...rest);
    };

    const res = await app.request(req);
    return res;
  }

  it("sends a single message and returns result", async () => {
    // Set a high enough segment limit for the org/month so the message is not rate limited
    await db.prepare(
      `INSERT INTO monthly_limit (organization_uuid, month, segment_limit, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`
    ).bind("org-1", "2025-06", 100, "2025-06-01T00:00:00Z", "2025-06-01T00:00:00Z").run();
    const res = await simulateRequest("org-1", "user", {
      messages: [
        { to: "+123", content: "hello world" },
      ],
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.results.length).toBe(1);
    expect(data.results[0].to).toBe("+123");
    expect(data.results[0].content).toBe("hello world");
    expect(data.results[0].currentStatus).toBe("pending");
  });

  it("sends multiple messages and returns results", async () => {
    const res = await simulateRequest("org-1", "user", {
      messages: [
        { to: "+123", content: "msg1" },
        { to: "+456", content: "msg2" },
      ],
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.results.length).toBe(2);
    expect(data.results[0].to).toBe("+123");
    expect(data.results[1].to).toBe("+456");
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
    const res = await simulateRequest("org-1", "user", {
      messages: [
        { to: "+123", content: "a" }, // 1 segment
        { to: "+456", content: "b".repeat(301) }, // 3 segments
      ],
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.results.length).toBe(2);
    expect(data.results[0].currentStatus).toBe("pending");
    expect(data.results[1].currentStatus).toBe("rate_limited");
  });
});
