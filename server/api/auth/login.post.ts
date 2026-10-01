import { compare } from "bcrypt-ts";
import { usersTable } from "../../db/schema";
import { useDrizzle } from "../../utils/drizzle";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

export default defineEventHandler(async (e) => {
  const { password, name } = await readBody(e);
  if (!(name && password)) {
    throw createError({ statusCode: 400, message: "Name and Password!" });
  }

  const db = useDrizzle();
  const user = await db.select().from(usersTable).where(eq(usersTable.name, name)).limit(1).get();

  if (!user) {
    throw createError({ statusCode: 404, message: "User not found" });
  }

  if (!(await compare(password, user.password))) {
    throw createError({ statusCode: 401, message: "Invalid password" });
  }

  const token = jwt.sign({ id: user.id, name: user.name }, process.env.JWT_PRIVATE!, {
    algorithm: "HS256",
    expiresIn: "24h",
  });

  return { token };
});
