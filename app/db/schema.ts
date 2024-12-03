import { integer, json, pgTable, varchar } from "drizzle-orm/pg-core";

export const quizarsTable = pgTable("quizars", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar().notNull(),
  terms: json().notNull()
});
