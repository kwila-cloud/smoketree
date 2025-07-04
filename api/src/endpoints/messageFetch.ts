// API endpoint: GET /api/v1/messages/:messageUuid
import { OpenAPIRoute } from "chanfana";
import { z } from "zod";
import type { AppContext } from "../types";

export class MessageFetch extends OpenAPIRoute {
  schema = {
    tags: ["Messages"],
    summary: "Get Message Status",
    request: {
      params: z.object({
        messageUuid: z.string(),
      }),
    },
    responses: {
      "200": {
        description: "Message status",
        content: {
          "application/json": {
            schema: z.object({
              uuid: z.string(),
              organizationUuid: z.string(),
              to: z.string(),
              content: z.string(),
              segments: z.number().nullable(),
              currentStatus: z.string(),
              createdAt: z.string(),
              updatedAt: z.string(),
            }),
          },
        },
      },
      "404": {
        description: "Not found",
        content: {
          "application/json": {
            schema: z.object({ error: z.string() }),
          },
        },
      },
    },
  };

  async handle(c: AppContext) {
    const organization = c.get("organization");
    const { DB } = c.env;
    const data = await this.getValidatedData<typeof this.schema>();
    const { messageUuid } = data.params;


  
    const row = await DB.prepare(
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
       WHERE m.uuid = ? AND m.organization_uuid = ?`
    ).bind(messageUuid, organization.uuid).first();

    if (!row) {
      return c.json({ error: "Message not found" }, 404);
    }

    return c.json(row);
  }
}
