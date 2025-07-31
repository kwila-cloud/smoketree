// API endpoint: POST /api/v1/messages
import { OpenAPIRoute, contentJson } from "chanfana";
import { z } from "zod";
import { attemptSendMessage, estimateSegments } from "../utils";
import type { AppContext } from "../types";
import type { Message } from "../entities";

export class MessageCreate extends OpenAPIRoute {
  schema = {
    tags: ["Messages"],
    summary: "Send SMS Messages",
    request: {
      body: contentJson(z.object({
        messages: z.array(z.object({
          to: z.string(),
          content: z.string(),
        })).min(1),
      })),
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
    const data = await this.getValidatedData<typeof this.schema>();
    const { messages } = data.body;

    const inserts = messages.map(msg => {
      return {
        uuid: crypto.randomUUID(),
        organization_uuid: organization.uuid,
        to_number: msg.to,
        content: msg.content,
        segments: estimateSegments(msg.content),
        current_status: 'pending'
      };
    });

    const insertStmt = DB.prepare(
      `INSERT INTO message (uuid, organization_uuid, to_number, content, segments, current_status) VALUES (?, ?, ?, ?, ?, ?)`
    );

    const batch = DB.batch(inserts.map(i => insertStmt.bind(i.uuid, i.organization_uuid, i.to_number, i.content, i.segments, i.current_status)));

    await batch; // Execute the batch insert

    const results = [];
    for (const insert of inserts) {
      const result = await attemptSendMessage(DB, insert.uuid);
      results.push(result);
    }

    return c.json({ results });
  }
}
