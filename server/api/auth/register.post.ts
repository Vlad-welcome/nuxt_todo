import { hash } from "bcrypt-ts";
import { usersTable } from "../../db/schema";
import { useDrizzle } from "../../utils/drizzle";

export default defineEventHandler(async (e) => {
  const { password, name } = await readBody(e);
  if (!(name && password)) {
    throw createError({ statusCode: 400, message: "Name and Password!" });
  }

  const hashPassword = await hash(password, 9);

  const db = useDrizzle();
  const [insertResult] = await db
    .insert(usersTable)
    .values({
      name: name,
      password: hashPassword,
    })
    .returning();

  return { insertResult };
});
