// API endpoint: POST /api/v1/messages
import { OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { attemptSendMessage, estimateSegments } from "../utils";
import type { AppContext } from "../types";
import type { Message } from "../entities";

export class MessageCreate extends OpenAPIRoute {
  schema = {
    tags: ["Messages"],
    summary: "Send SMS Messages",
    request: {
      body: {
        content: {
          "application/json": {
            schema: z.object({
              messages: z.array(z.object({
                to: z.string(),
                content: z.string(),
              })).min(1),
            }),
          },
        },
      },
    },
    responses: {
      "200": {
        description: "Messages created",
        content: {
          "application/json": {
            schema: z.object({
              results: z.array(z.object({
                uuid: z.string(),
                organizationUuid: z.string(),
                to: z.string(),
                content: z.string(),
                segments: z.number().nullable(),
                currentStatus: z.string(),
                createdAt: z.string(),
                updatedAt: z.string(),
                error: z.string().optional(),
              })),
            }),
          },
        },
      },
      "429": {
        description: "Rate limited",
        content: {
          "application/json": {
            schema: z.object({
              error: z.string(),
              messageUuid: z.string(),
              currentUsage: z.number(),
              monthlyLimit: z.number(),
            }),
          },
        },
      },
    },
  };

  async handle(c: AppContext) {
    const organization = c.get("organization");
    const { DB } = c.env;
    const { messages } = await c.req.json();
    const results = [];
    for (const msg of messages) {
      const messageUuid = crypto.randomUUID();
      // We include the estimated segments in the message creation, to avoid the user creating a bunch of messages that would exceed their limit.
      await DB.prepare(
        `INSERT INTO message (uuid, organization_uuid, to_number, content, segments, current_status) VALUES (?, ?, ?, ?, ?, ?)`
      ).bind(messageUuid, organization.uuid, msg.to, msg.content, estimateSegments(msg.content), 'pending').run();
      const result = await attemptSendMessage(DB, messageUuid);
      results.push(result);
    }
    return c.json({ results });
  }
}
