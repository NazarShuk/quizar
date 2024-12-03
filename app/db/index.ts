import { drizzle } from "drizzle-orm/neon-http";
import { quizarsTable } from "./schema";
import { eq, ilike } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL as string);

export async function putNewTerm(
  name: string,
  path: string,
  jsonTerms: string,
) {
  const terms: typeof quizarsTable.$inferInsert = {
    name: name,
    terms: jsonTerms,
    path: path,
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
      name: quizarsTable.name,
    })
    .from(quizarsTable)
    .where(eq(quizarsTable.id, id));

  return {
    name: terms[0].name as string,
    terms: terms[0].terms as Array<{ term: string; definition: string }>,
  };
}

export async function getTermsPage(page: number) {
  const items_per_page = 10;

  const terms = await db
    .select({
      name: quizarsTable.name,
      id: quizarsTable.id,
    })
    .from(quizarsTable)
    .limit(items_per_page)
    .offset(page * items_per_page);

  console.log(terms);

  return terms;
}

export async function searchTerms(query: string, maxItems: number = 10) {
  const terms = await db
    .select({
      name: quizarsTable.name,
      id: quizarsTable.id,
    })
    .from(quizarsTable)
    .where(ilike(quizarsTable.name, `%${query}%`))
    .limit(maxItems);

  return terms;
}

export async function termsExistFromPath(path: string) {
  const terms = await db
    .select({
      id: quizarsTable.id,
    })
    .from(quizarsTable)
    .where(ilike(quizarsTable.path, `${path}`))
    .limit(1);

  return {
    exists: terms.length > 0,
    id: terms.length > 0 ? terms[0].id : -1,
  };
}
