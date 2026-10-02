import * as schema from "../../db/schema";
import { useDrizzle } from "../../utils/drizzle";

export default defineEventHandler(async (e) => {
  const body = await readBody(e);
  const { text, userId } = body;

  const db = useDrizzle();
  const task = await db.insert(schema.tasks).values({ text: text, userId: userId }).returning();

  return { task };
});
