import { fromHono } from "chanfana";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { MessageCreate } from "./endpoints/messageCreate";
import { MessageFetch } from "./endpoints/messageFetch";
import { MessageRetry } from "./endpoints/messageRetry";
import { MessageList } from "./endpoints/messageList";
import { UsageStatsGetAll, UsageStatsGetByMonth } from "./endpoints/usageStats";
import { LimitsGetByMonth, LimitsGetAll, LimitsPut } from "./endpoints/limits";

// Start a Hono app
import { requireApiKey } from "./auth";
import { scheduled } from "./scheduled";
const app = new Hono<{ Bindings: Env }>();

app.use(cors());

// Apply authentication middleware to all routes
app.use(requireApiKey);

// Setup OpenAPI registry
const openapi = fromHono(app, {
    schema: {
        info: {
            title: 'Smoketree',
            version: '0.0.1',
            contact: {
                name: 'API Support',
                url: 'https://kwila.cloud',
                email: 'support@kwila.cloud',
            },
            license: {
                name: 'MIT',
                url: 'https://github.com/kwila-cloud/smoketree/blob/main/LICENSE',
            },
        },
        servers: [
            { url: 'https://smoketree.kwila.cloud', description: 'Production server' },
            { url: 'http://localhost:8787', description: 'Development server' },
        ],
        security: [{'ApiKeyAuth': []}]
    },
    docs_url: "/",
});

// Register OpenAPI security scheme
openapi.registry.registerComponent(
  'securitySchemes',
  'ApiKeyAuth',
  {
    type: 'apiKey',
    in: 'header',
    name: 'X-API-Key',
  },
);

// Register OpenAPI endpoints
// SMS API endpoints
openapi.post("/api/v1/messages", MessageCreate);
openapi.get("/api/v1/messages/:messageUuid", MessageFetch);
openapi.post("/api/v1/messages/:messageUuid/retry", MessageRetry);
openapi.get("/api/v1/messages", MessageList);
openapi.get("/api/v1/usage", UsageStatsGetAll);
openapi.get("/api/v1/usage/:month", UsageStatsGetByMonth);
openapi.get("/api/v1/limits", LimitsGetAll);
openapi.get("/api/v1/limits/:month", LimitsGetByMonth);
openapi.put("/api/v1/limits/:month", LimitsPut);

// You may also register routes for non OpenAPI directly on Hono
// app.get('/test', (c) => c.text('Hono!'))

export default {
    fetch: app.fetch,
    scheduled,
}
