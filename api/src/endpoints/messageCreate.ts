// API endpoint: POST /api/v1/messages
import { OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { estimateSegments, getCurrentMonth } from "../utils";
import { sendSms } from "../twilio";
import type { AppContext } from "../types";
import type { Message } from "../entities";

export class MessageCreate extends OpenAPIRoute {
  schema = {
    tags: ["Messages"],
    summary: "Send SMS Message",
    request: {
      body: {
        content: {
          "application/json": {
            schema: z.object({
              to: z.string(),
              content: z.string(),
            }),
          },
        },
      },
    },
    responses: {
      "200": {
        description: "Message created",
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
    // TODO: Implement DB logic, rate limit, Twilio call, and response
    return c.json({ error: "Not implemented" }, 501);
  }
}
