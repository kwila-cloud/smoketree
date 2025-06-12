// Implements API key authentication middleware for Cloudflare Workers
import { Context, Next } from "hono";

export async function requireApiKey(c: Context, next: Next) {
  const apiKey = c.req.header("X-API-Key");
  if (!apiKey) {
    return c.json({ error: "Missing API key" }, 401);
  }
  // TODO: Lookup organization by API key in D1
  // Attach org info to context if found
  // If not found, return 401
  await next();
}
