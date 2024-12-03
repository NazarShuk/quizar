import { integer, json, pgTable, varchar } from "drizzle-orm/pg-core";

export const quizarsTable = pgTable("quizars", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar().notNull(),
  path: varchar(),
  terms: json().notNull(),
});
