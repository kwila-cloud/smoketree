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
    // TODO: Implement DB list logic
    return c.json({ error: "Not implemented" }, 501);
  }
}
