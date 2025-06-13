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
    const { messageUuid } = c.req.param();

    // Fetch the message for this organization
    const row = await DB.prepare(
      `SELECT uuid, organization_uuid as organizationUuid, to_number as "to", content, segments, current_status as currentStatus, created_at as createdAt, updated_at as updatedAt
       FROM message WHERE uuid = ? AND organization_uuid = ?`
    ).bind(messageUuid, organization.uuid).first();

    if (!row) {
      return c.json({ error: "Message not found" }, 404);
    }
    return c.json(row);
  }
}
