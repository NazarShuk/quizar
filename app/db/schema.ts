import { integer, json, pgTable } from "drizzle-orm/pg-core";

export const quizarsTable = pgTable("quizars", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  terms: json().notNull(),
});
