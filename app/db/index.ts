import { drizzle } from "drizzle-orm/neon-http";
import { quizarsTable } from "./schema";
import { eq } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL as string);

export async function putNewTerm(jsonTerms: string) {
  const terms: typeof quizarsTable.$inferInsert = {
    name: "skib",
    terms: jsonTerms,
  };

  const id = await db
    .insert(quizarsTable)
    .values(terms)
    .returning({ id: quizarsTable.id });

  return id[0].id;
}

export async function getTerms(id: number) {
  const terms = await db
    .select({
      terms: quizarsTable.terms,
    })
    .from(quizarsTable)
    .where(eq(quizarsTable.id, id));

  return terms[0].terms as Array<{ term: string; definition: string }>;
}

export async function getTermsPage(page : number){
  const items_per_page = 10

  const terms = await db.select({
    terms: quizarsTable.terms
  })
  .from(quizarsTable)
  .limit(items_per_page)
  .offset(page * items_per_page)

  console.log(terms)

  return terms
}