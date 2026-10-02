import * as schema from "../../db/schema";
import { useDrizzle } from "../../utils/drizzle";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (e) => {
  const query = getQuery(e);
  const userId = Number(query.userId);

  const db = useDrizzle();
  const tasks = await db
    .select()
    .from(schema.tasks)
    .where(eq(schema.tasks.userId, userId))
    .limit(100)
    .all();

  return { tasks };
});
