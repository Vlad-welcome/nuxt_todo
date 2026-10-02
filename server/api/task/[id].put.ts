import * as schema from "../../db/schema";
import { useDrizzle } from "../../utils/drizzle";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (e) => {
  const body = await readBody(e);
  const { text, userId } = body;
  const id = Number(getRouterParam(e, "id"));

  const db = useDrizzle();
  const [task] = await db
    .update(schema.tasks)
    .set({ text, userId })
    .where(eq(schema.tasks.id, id))
    .returning();

  return { task };
});
