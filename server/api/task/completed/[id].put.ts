import * as schema from "../../../db/schema";
import { useDrizzle } from "../../../utils/drizzle";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (e) => {
  const body = await readBody(e);
  const { completed } = body;
  const id = Number(getRouterParam(e, "id"));

  const db = useDrizzle();
  const [task] = await db
    .update(schema.tasks)
    .set({ completed })
    .where(eq(schema.tasks.id, id))
    .returning();

  return { task };
});
