import { fromHono } from "chanfana";
import { Hono } from "hono";
import { MessageCreate } from "./endpoints/messageCreate";
import { MessageFetch } from "./endpoints/messageFetch";
import { MessageRetry } from "./endpoints/messageRetry";
import { MessageList } from "./endpoints/messageList";
import { UsageStats } from "./endpoints/usageStats";
import { LimitsGet, LimitsPut } from "./endpoints/limits";

// Start a Hono app
const app = new Hono<{ Bindings: Env }>();

// Setup OpenAPI registry
const openapi = fromHono(app, {
	docs_url: "/",
});

// Register OpenAPI endpoints
// SMS API endpoints
openapi.post("/api/v1/messages", MessageCreate);
openapi.get("/api/v1/messages/:messageUuid", MessageFetch);
openapi.post("/api/v1/messages/:messageUuid/retry", MessageRetry);
openapi.get("/api/v1/messages", MessageList);
openapi.get("/api/v1/usage", UsageStats);
openapi.get("/api/v1/usage/:month", UsageStats);
openapi.get("/api/v1/limits", LimitsGet);
openapi.get("/api/v1/limits/:month", LimitsGet);
openapi.put("/api/v1/limits/:month", LimitsPut);

// You may also register routes for non OpenAPI directly on Hono
// app.get('/test', (c) => c.text('Hono!'))

// Export the Hono app
export default app;
