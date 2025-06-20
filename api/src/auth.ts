// Implements API key authentication middleware for Cloudflare Workers
import { Context, Next } from "hono";
import { AppContext, ApiKeyType } from "./types";
import { Organization } from "./entities";

export type AuthContext = AppContext & {
  Vars: {
    organization: Organization;
    apiKeyType: ApiKeyType;
  };
};

export async function requireApiKey(c: AuthContext, next: Next) {
    console.log('hi!!');
  // Special handling for openapi spec
  if (c.req.path === "/openapi.json" || c.req.path === "/") {
    return next();
  }
  
  // Check for API key in headers
  const apiKey = c.req.header("X-API-Key");
  if (!apiKey) {
    return c.json({ error: "Missing API key" }, 401);
  }

  const { DB } = c.env;

  // Find API key and join with organization
  const row = await DB.prepare(
    `SELECT o.*, k.type as apiKeyType FROM api_key k JOIN organization o ON k.organization_uuid = o.uuid WHERE k.key = ?`
  )
    .bind(apiKey)
    .first<{ apiKeyType: ApiKeyType } & Organization>();

  if (!row) {
    return c.json({ error: "Invalid API key" }, 401);
  }

  c.set("organization", row);
  c.set("apiKeyType", row.apiKeyType);

  await next();
}
