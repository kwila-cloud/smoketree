// API endpoint: GET /api/v1/usage and /api/v1/usage/:month
import { OpenAPIRoute } from "chanfana";
import { z } from "zod";
import type { AppContext } from "../types";

export class UsageStats extends OpenAPIRoute {
  schema = {
    tags: ["Usage"],
    summary: "Get Usage Statistics",
    request: {
      params: z.object({
        month: z.string().optional(),
      }),
    },
    responses: {
      "200": {
        description: "Usage stats",
        content: {
          "application/json": {
            schema: z.object({
              month: z.string(),
              totalMessages: z.number(),
              totalSegments: z.number(),
              segmentLimit: z.number(),
              isLimitExceeded: z.boolean(),
              remainingSegments: z.number(),
            }),
          },
        },
      },
    },
  };

  async handle(c: AppContext) {
    // TODO: Implement usage stats logic
    return c.json({ error: "Not implemented" }, 501);
  }
}
