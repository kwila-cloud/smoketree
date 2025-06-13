// API endpoint: GET/PUT /api/v1/limits and /api/v1/limits/:month
import { OpenAPIRoute } from "chanfana";
import { z } from "zod";
import type { AppContext } from "../types";

export class LimitsGetAll extends OpenAPIRoute {
  schema = {
    tags: ["Limits"],
    summary: "Get All Monthly Limits",
    responses: {
      "200": {
        description: "Monthly limits",
        content: {
          "application/json": {
            schema: z.array(z.object({
              month: z.string(),
              segmentLimit: z.number(),
              updatedAt: z.string(),
            })),
          },
        },
      },
    },
  };
  async handle(c: AppContext) {
    // TODO: Implement get all limits logic
    return c.json({ error: "Not implemented" }, 501);
  }
}

export class LimitsGetByMonth extends OpenAPIRoute {
  schema = {
    tags: ["Limits"],
    summary: "Get Monthly Limit by Month",
    request: {
      params: z.object({
        month: z.string(),
      }),
    },
    responses: {
      "200": {
        description: "Monthly limit",
        content: {
          "application/json": {
            schema: z.object({
              month: z.string(),
              segmentLimit: z.number(),
              updatedAt: z.string(),
            }),
          },
        },
      },
    },
  };
  async handle(c: AppContext) {
    // TODO: Implement get limits by month logic
    return c.json({ error: "Not implemented" }, 501);
  }
}

export class LimitsPut extends OpenAPIRoute {
  schema = {
    tags: ["Limits"],
    summary: "Set Monthly Limit (Admin Only)",
    request: {
      params: z.object({
        month: z.string(),
      }),
      body: {
        content: {
          "application/json": {
            schema: z.object({ segmentLimit: z.number() }),
          },
        },
      },
    },
    responses: {
      "200": {
        description: "Limit updated",
        content: {
          "application/json": {
            schema: z.object({
              month: z.string(),
              segmentLimit: z.number(),
              updatedAt: z.string(),
            }),
          },
        },
      },
    },
  };
  async handle(c: AppContext) {
    // TODO: Implement set limit logic
    return c.json({ error: "Not implemented" }, 501);
  }
}
