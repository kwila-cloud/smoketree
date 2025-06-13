// API endpoint: GET /api/v1/messages (list)
import { OpenAPIRoute } from "chanfana";
import { z } from "zod";
import type { AppContext } from "../types";

export class MessageList extends OpenAPIRoute {
  schema = {
    tags: ["Messages"],
    summary: "List Messages",
    request: {
      query: z.object({
        status: z.string().optional(),
        limit: z.number().default(50),
        offset: z.number().default(0),
      }),
    },
    responses: {
      "200": {
        description: "List of messages",
        content: {
          "application/json": {
            schema: z.object({
              messages: z.array(z.object({
                uuid: z.string(),
                organizationUuid: z.string(),
                to: z.string(),
                content: z.string(),
                segments: z.number().nullable(),
                currentStatus: z.string(),
                createdAt: z.string(),
                updatedAt: z.string(),
              })),
              total: z.number(),
              limit: z.number(),
              offset: z.number(),
            }),
          },
        },
      },
    },
  };

  async handle(c: AppContext) {
    const organization = c.get("organization");
    const { DB } = c.env;
    let { status, limit = 50, offset = 0 } = c.req.query();

    // Enforce maximum limit of 50
    limit = Math.min(Number(limit) || 50, 50);
    offset = Number(offset) || 0;

    // Build query parts
    let where = "WHERE organization_uuid = ?";
    let params: any[] = [organization.uuid];
    if (status) {
      where += " AND current_status = ?";
      params.push(status);
    }

    // Get total count
    const totalRow = await DB.prepare(
      `SELECT COUNT(*) as total FROM message ${where}`
    ).bind(...params).first();
    const total = totalRow ? totalRow.total : 0;

    // Get paginated messages
    const rows = await DB.prepare(
      `SELECT uuid, organization_uuid as organizationUuid, to_number as "to", content, segments, current_status as currentStatus, created_at as createdAt, updated_at as updatedAt
       FROM message
       ${where}
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`
    ).bind(...params, limit, offset).all();

    return c.json({
      messages: rows.results,
      total,
      limit,
      offset,
    });
  }
}
