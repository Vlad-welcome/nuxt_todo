import { int, text, sqliteTable } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  password: text().notNull(),
  email: text().notNull().unique(),
});

export const tasks = sqliteTable("tasks", {
  id: int().primaryKey({ autoIncrement: true }),
  text: text().notNull(),
  completed: int({ mode: "boolean" }).default(false),
  userId: int()
    .notNull()
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
});

export const usersRelations = relations(users, ({ many }) => ({
  tasks: many(tasks),
}));
export const tasksRelations = relations(tasks, ({ one }) => ({
  author: one(users, {
    fields: [tasks.userId],
    references: [users.id],
  }),
}));
