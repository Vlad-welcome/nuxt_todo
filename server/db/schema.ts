import { int, text, sqliteTable } from "drizzle-orm/sqlite-core";

export const fruitsTable = sqliteTable("fruits", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
});

export const usersTable = sqliteTable("users", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  password: text().notNull(),
});
