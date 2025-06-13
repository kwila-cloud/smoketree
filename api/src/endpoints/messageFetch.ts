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
    // TODO: Implement DB fetch logic
    return c.json({ error: "Not implemented" }, 501);
  }
}
