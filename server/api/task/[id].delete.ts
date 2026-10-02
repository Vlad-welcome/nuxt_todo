import * as schema from "../../db/schema";
import { useDrizzle } from "../../utils/drizzle";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (e) => {
  const id = Number(getRouterParam(e, "id"));

  const db = useDrizzle();
  const task = await db.delete(schema.tasks).where(eq(schema.tasks.id, id));

  return { task };
});
