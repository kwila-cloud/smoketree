// API endpoint: POST /api/v1/messages/:messageUuid/retry
import { OpenAPIRoute } from "chanfana";
import { z } from "zod";
import type { AppContext } from "../types";

export class MessageRetry extends OpenAPIRoute {
  schema = {
    tags: ["Messages"],
    summary: "Retry Message",
    request: {
      params: z.object({
        messageUuid: z.string(),
      }),
    },
    responses: {
      "200": {
        description: "Message retried",
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
    // TODO: Implement retry logic
    return c.json({ error: "Not implemented" }, 501);
  }
}
