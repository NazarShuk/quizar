import { integer, json, pgTable, varchar, boolean } from "drizzle-orm/pg-core";

export const quizars = pgTable("quizars", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar().notNull(),
  path: varchar(),
  terms: json().notNull(),
  author: varchar().notNull(),
  searchable: boolean().notNull(),
});
