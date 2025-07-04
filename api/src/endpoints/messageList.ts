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
    const data = await this.getValidatedData<typeof this.schema>();
     let { status, limit = 50, offset = 0 } = data.query;
    // Enforce maximum limit of 50
    limit = Math.min(Number(limit) || 50, 50);
    offset = Number(offset) || 0;

    // Build query parts
    let where = "WHERE organizationUuid = ?";
    let params: any[] = [organization.uuid];
    if (status) {
      where += " AND currentStatus = ?";
      params.push(status);
    }

    // Get paginated messages with latest status from message_attempt
    const rows = await DB.prepare(
      `SELECT m.uuid,
              m.organization_uuid as organizationUuid,
              m.to_number as "to",
              m.content,
              m.segments,
              m.created_at as createdAt,
              m.updated_at as updatedAt,
              (
                SELECT status
                FROM message_attempt ma
                WHERE ma.message_uuid = m.uuid
                ORDER BY attempted_at DESC
                LIMIT 1
              ) as currentStatus
       FROM message m
       ${where}
       ORDER BY createdAt DESC
       LIMIT ? OFFSET ?`
    ).bind(...params, limit, offset).all();

    return c.json({
      messages: rows.results,
      total: rows.results.length,
      limit,
      offset,
    });
  }
}
