// API endpoint: GET /api/v1/usage and /api/v1/usage/:month
import { OpenAPIRoute } from "chanfana";
import { z } from "zod";
import type { AppContext } from "../types";
import { getCurrentMonth } from "../utils";

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
    const currentMonth = getCurrentMonth();

    // Query usage stats grouped by month (YYYY-MM)
    const rows = await DB.prepare(
      `SELECT 
        strftime('%Y-%m', m.created_at) as month,
        COUNT(m.uuid) as totalMessages,
        COALESCE(SUM(COALESCE(m.segments, 0)), 0) as totalSegments
      FROM message m
      WHERE m.organization_uuid = ?
      AND (SELECT status FROM message_attempt WHERE message_uuid = m.uuid ORDER BY attempted_at DESC LIMIT 1) = 'sent'
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
        limits[row.month as string] = row.segmentLimit as number;
      }
    }

    // Merge usage and limits
    const result = rows.results.map((row: any) => ({
      month: row.month,
      totalMessages: row.totalMessages,
      totalSegments: row.totalSegments,
      segmentLimit: limits[row.month] ?? 0,
    }));

    // Ensure current month is included
    const currentMonthExists = result.some(item => item.month === currentMonth);
    if (!currentMonthExists) {
      result.unshift({
        month: currentMonth,
        totalMessages: 0,
        totalSegments: 0,
        segmentLimit: limits[currentMonth] ?? 0,
      });
    }

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
    const organization = c.get("organization");
    const { DB } = c.env;
    const data = await this.getValidatedData<typeof this.schema>();
    const { month } = data.params;
    // Query usage stats for the given month (YYYY-MM)
    const row = await DB.prepare(
      `SELECT 
        strftime('%Y-%m', m.created_at) as month,
        COUNT(m.uuid) as totalMessages,
        COALESCE(SUM(COALESCE(m.segments, 0)), 0) as totalSegments
      FROM message m
      WHERE m.organization_uuid = ? AND strftime('%Y-%m', m.created_at) = ?
      AND (SELECT status FROM message_attempt WHERE message_uuid = m.uuid ORDER BY attempted_at DESC LIMIT 1) = 'sent'`
    ).bind(organization.uuid, month).first();

    // Get segment limit for the month
    const limitRow = await DB.prepare(
      `SELECT segment_limit as segmentLimit FROM monthly_limit WHERE organization_uuid = ? AND month = ?`
    ).bind(organization.uuid, month).first();

    return c.json({
      month,
      totalMessages: row ? row.totalMessages : 0,
      totalSegments: row ? row.totalSegments : 0,
      segmentLimit: limitRow ? limitRow.segmentLimit : 0,
    });
  }
}
