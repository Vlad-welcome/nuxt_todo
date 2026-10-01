import jwt from "jsonwebtoken";
import { JwtUserInfo } from "~~/shared/types/JwtUserInfo";

export default defineEventHandler(async (e) => {
  const { token } = await readBody(e);

  if (!token) {
    throw createError({ statusCode: 400, message: "No token" });
  }

  const user = jwt.verify(token, process.env.JWT_PRIVATE!) as JwtUserInfo;
  if (user) {
    return {
      success: true,
      user,
    };
  }

  throw createError({ statusCode: 401 });
});
