// API endpoint: POST /api/v1/messages/:messageUuid/retry
import { OpenAPIRoute } from "chanfana";
import { z } from "zod";
import type { AppContext } from "../types";
import { attemptSendMessage } from "../utils";

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
    const { DB } = c.env;
    const { messageUuid } = c.req.param();
    // Use the shared attemptSendMessage logic
    const result = await attemptSendMessage(DB, messageUuid);
    if (result.error === 'Message not found') {
      return c.json(result, 404);
    }
    if (result.error === 'Message already sent') {
      return c.json(result, 400);
    }
    return c.json(result);
  }
}
