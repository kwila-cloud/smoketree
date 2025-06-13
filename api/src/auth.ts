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
  const apiKey = c.req.header("X-API-Key");
  if (!apiKey) {
    return c.json({ error: "Missing API key" }, 401);
  }

  const { DB } = c.env;

  // Try to find by admin API key
  let organization = await DB.prepare(
    "SELECT * FROM organization WHERE admin_api_key = ?"
  )
    .bind(apiKey)
    .first<Organization>();

  let apiKeyType: ApiKeyType = "admin";

  if (!organization) {
    // Try to find by user API key
    organization = await DB.prepare(
      "SELECT * FROM organization WHERE user_api_key = ?"
    )
      .bind(apiKey)
      .first<Organization>();
    apiKeyType = "user";
  }

  if (!organization) {
    return c.json({ error: "Invalid API key" }, 401);
  }

  c.set("organization", organization);
  c.set("apiKeyType", apiKeyType);

  await next();
}
