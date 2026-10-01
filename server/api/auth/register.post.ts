import { hash } from "bcrypt-ts";
import * as schema from "../../db/schema";
import { useDrizzle } from "../../utils/drizzle";
import { registerSchema } from "#shared/validation/auth";

export default defineEventHandler(async (e) => {
  const body = await readBody(e);
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    throw createError({ statusCode: 400, message: "Имя, Пароль, Email!" });
  }

  const { name, email, password } = parsed.data;
  const hashPassword = await hash(password, 9);
  const db = useDrizzle();

  const [result] = await db
    .insert(schema.users)
    .values({ name, email, password: hashPassword })
    .onConflictDoNothing({ target: schema.users.email })
    .returning({ id: schema.users.id, name: schema.users.name, email: schema.users.email });

  if (!result) {
    throw createError({
      statusCode: 409,
      message: "Пользователь с таким email уже существует",
    });
  }

  return { user: result };
});
