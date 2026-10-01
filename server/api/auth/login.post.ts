import { compare } from "bcrypt-ts";
import * as schema from "../../db/schema";
import { useDrizzle } from "../../utils/drizzle";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { loginSchema } from "#shared/validation/auth";

export default defineEventHandler(async (e) => {
  const body = await readBody(e);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    throw createError({ statusCode: 400, message: "Пароль, Email!" });
  }

  const { email, password } = parsed.data;

  const db = useDrizzle();
  const user = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, email))
    .limit(1)
    .get();

  if (!user) {
    throw createError({ statusCode: 404, message: "Неправильный email или пароль" });
  }

  if (!(await compare(password, user.password))) {
    throw createError({ statusCode: 401, message: "Неправильный email или пароль" });
  }

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email },
    process.env.JWT_PRIVATE!,
    {
      algorithm: "HS256",
      expiresIn: "24h",
    },
  );

  return { token };
});
