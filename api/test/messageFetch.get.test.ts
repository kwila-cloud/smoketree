import { MessageFetch } from "../src/endpoints/messageFetch";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Hono } from "hono";
import { fromHono } from "chanfana";
import { requireApiKey } from "../src/auth";
import { Env, ApiKeyType } from "../src/types";
import { Organization } from "../src/entities";
import { createTestDb } from "./utils";


describe("MessageFetch endpoint", () => {
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
    openapi.get("/api/v1/messages/:messageUuid", MessageFetch);
  });

  afterEach(() => {
    db.close();
  });

  async function simulateRequest(orgUuid: string, apiKeyType: string, messageUuid: string) {
    const req = new Request(`http://localhost/api/v1/messages/${messageUuid}`, {
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

  it("returns the message if it exists and belongs to the org", async () => {
    await db.prepare(
      `INSERT INTO message (uuid, organization_uuid, to_number, content, segments, current_status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind("msg-1", "org-1", "+123", "hi", 2, "sent", "2025-06-01T00:00:00Z", "2025-06-01T00:00:00Z").run();
    const res = await simulateRequest("org-1", "user", "msg-1");
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.uuid).toBe("msg-1");
    expect(data.organizationUuid).toBe("org-1");
    expect(data.to).toBe("+123");
    expect(data.content).toBe("hi");
    expect(data.segments).toBe(2);
  });

  it("returns 404 if the message does not exist", async () => {
    const res = await simulateRequest("org-1", "user", "not-exist");
    expect(res.status).toBe(404);
    const data = await res.json();
    expect(data.error).toBe("Message not found");
  });

  it("returns 404 if the message belongs to another org", async () => {
    await db.prepare(
      `INSERT INTO message (uuid, organization_uuid, to_number, content, segments, current_status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind("msg-2", "org-2", "+456", "yo", 1, "sent", "2025-06-01T00:00:00Z", "2025-06-01T00:00:00Z").run();
    const res = await simulateRequest("org-1", "user", "msg-2");
    expect(res.status).toBe(404);
    const data = await res.json();
    expect(data.error).toBe("Message not found");
  });
});
