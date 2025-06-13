// API endpoint: GET/PUT /api/v1/limits and /api/v1/limits/:month
import { OpenAPIRoute } from "chanfana";
import { z } from "zod";
import type { AppContext, AuthContext } from "../types";

export class LimitsGetAll extends OpenAPIRoute {
  schema = {
    tags: ["Limits"],
    summary: "Get All Monthly Limits",
    responses: {
      "200": {
        description: "Monthly limits",
        content: {
          "application/json": {
            schema: z.array(
              z.object({
                month: z.string(),
                segmentLimit: z.number(),
                updatedAt: z.string(),
              })
            ),
          },
        },
      },
    },
  };
  async handle(c: AppContext) {
    // Get the organization from context (set by auth middleware)
    const organization = c.get("organization");
    const { DB } = c.env;
    // Query all monthly limits for this organization
    const rows = await DB.prepare(
      `SELECT month, segment_limit as segmentLimit, updated_at as updatedAt FROM monthly_limit WHERE organization_uuid = ? ORDER BY month DESC`
    )
      .bind(organization.uuid)
      .all();
    return c.json(rows.results);
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
    const organization = c.get("organization");
    const { DB } = c.env;
    const { month } = c.req.param();
    const row = await DB.prepare(
      `SELECT month, segment_limit as segmentLimit, updated_at as updatedAt FROM monthly_limit WHERE organization_uuid = ? AND month = ?`
    )
      .bind(organization.uuid, month)
      .first();
    if (!row) {
      return c.json({
        month,
        segmentLimit: 0,
        updatedAt: null,
      });
    }
    return c.json({
      month: row.month,
      segmentLimit: row.segmentLimit,
      updatedAt: row.updatedAt,
    });
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
  async handle(c: AuthContext) {
    if (c.get("apiKeyType") !== "admin") {
      return c.json({ error: "Forbidden", code: "FORBIDDEN" }, 403);
    }
    // TODO: Implement set limit logic
    return c.json({ error: "Not implemented" }, 501);
  }
}
