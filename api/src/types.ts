import { DateTime, Str } from "chanfana";
import type { Context } from "hono";
import { z } from "zod";
import { D1Database } from "@cloudflare/workers-types";
import { Organization } from "./entities";

export type Env = {
  DB: D1Database;
};

export type ApiKeyType = "admin" | "user";

export type AppContext = Context<{
  Bindings: Env;
  Variables: {
    organization: Organization;
    apiKeyType: ApiKeyType;
  };
}>;

export const Task = z.object({
	name: Str({ example: "lorem" }),
	slug: Str(),
	description: Str({ required: false }),
	completed: z.boolean().default(false),
	due_date: DateTime(),
});
