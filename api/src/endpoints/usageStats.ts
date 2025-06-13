// API endpoint: GET /api/v1/usage and /api/v1/usage/:month
import { OpenAPIRoute } from "chanfana";
import { z } from "zod";
import type { AppContext } from "../types";

export class UsageStatsGetAll extends OpenAPIRoute {
  schema = {
    tags: ["Usage"],
    summary: "Get All Usage Statistics",
    responses: {
      "200": {
        description: "All usage stats",
        content: {
          "application/json": {
            schema: z.array(z.object({
              month: z.string(),
              totalMessages: z.number(),
              totalSegments: z.number(),
              segmentLimit: z.number(),
            })),
          },
        },
      },
    },
  };

  async handle(c: AppContext) {
    // TODO: Implement get all usage stats logic
    return c.json({ error: "Not implemented" }, 501);
  }
}

export class UsageStatsGetByMonth extends OpenAPIRoute {
  schema = {
    tags: ["Usage"],
    summary: "Get Usage Statistics by Month",
    request: {
      params: z.object({
        month: z.string(),
      }),
    },
    responses: {
      "200": {
        description: "Usage stats for a specific month",
        content: {
          "application/json": {
            schema: z.object({
              month: z.string(),
              totalMessages: z.number(),
              totalSegments: z.number(),
              segmentLimit: z.number(),
            }),
          },
        },
      },
    },
  };

  async handle(c: AppContext) {
    // TODO: Implement usage stats by month logic
    return c.json({ error: "Not implemented" }, 501);
  }
}
