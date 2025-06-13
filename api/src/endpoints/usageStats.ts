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
    const organization = c.get("organization");
    const { DB } = c.env;
    // Query usage stats grouped by month (YYYY-MM)
    const rows = await DB.prepare(
      `SELECT 
        strftime('%Y-%m', created_at) as month,
        COUNT(*) as totalMessages,
        COALESCE(SUM(COALESCE(segments, 0)), 0) as totalSegments
      FROM message
      WHERE organization_uuid = ?
      GROUP BY month
      ORDER BY month DESC`
    ).bind(organization.uuid).all();

    // Get segment limits for all months in one query
    const months = rows.results.map((r: any) => r.month);
    let limits: Record<string, number> = {};
    if (months.length > 0) {
      const placeholders = months.map(() => '?').join(',');
      const limitRows = await DB.prepare(
        `SELECT month, segment_limit as segmentLimit FROM monthly_limit WHERE organization_uuid = ? AND month IN (${placeholders})`
      ).bind(organization.uuid, ...months).all();
      for (const row of limitRows.results) {
        limits[row.month] = row.segmentLimit;
      }
    }

    // Merge usage and limits
    const result = rows.results.map((row: any) => ({
      month: row.month,
      totalMessages: row.totalMessages,
      totalSegments: row.totalSegments,
      segmentLimit: limits[row.month] ?? 0,
    }));
    return c.json(result);
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
