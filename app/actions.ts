"use server";
import { db } from "@/db/index";
import { quizars } from "@/db/schema";
import { ilike } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { load } from "cheerio";
import AISetGenerator from "@/lib/aiSetGenerator";

interface QuizletTerm {
  term: string;
  definition: string;
}
export async function cloneQuizlet(data: FormData) {
  "use server";

  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  const url = data.get("url") as string;
  if (!url) throw new Error("No URL found");

  const parsedUrl = new URL(url);
  if (parsedUrl.hostname !== "quizlet.com")
    throw new Error("The URL must be a quizlet.com URL");

  const existingTerms = await db
    .select({ id: quizars.id })
    .from(quizars)
    .where(ilike(quizars.path, `${parsedUrl.pathname}`))
    .limit(1);

  if (existingTerms.length > 0) return existingTerms[0].id;

  console.log(`Clone request for ${url}`);

  try {
    const response = await fetch(`https://api.scraperapi.com?api_key=${process.env.SCRAPERAPI_KEY}&url=${encodeURIComponent(url)}`);
    const html = await response.text();

    const $ = load(html);

    const terms: QuizletTerm[] = [];
    $(".SetPageTerms-term").each((i, elem) => {
      const termElement = $(elem).find(
        '.s1mdxb3l[data-testid="set-page-card-side"] .s1q0b356 .TermText'
      );
      const definitionElement = $(elem).find(
        '.s1mdxb3l[data-testid="set-page-card-side"].l150nly7 .TermText'
      );

      const term = termElement.text().trim();
      const definition = definitionElement.text().trim();

      if (term && definition) {
        terms.push({ term, definition });
      }
    });

    const name =
      $(".SetPage-setIntro .tz2ipyx").text().trim() || "Unnamed Quizlet Set";

    console.log(`Extracted ${terms.length} terms`);

    const searchable = data.get("searchable") as string;

    const termsInsert: typeof quizars.$inferInsert = {
      name: name,
      terms: JSON.stringify(terms),
      path: parsedUrl.pathname,
      author: userId,
      searchable: searchable === "true",
    };

    const [insertedRecord] = await db
      .insert(quizars)
      .values(termsInsert)
      .returning({ id: quizars.id });

    return insertedRecord.id;
  } catch (error) {
    console.error("Scraping error:", error);
    throw new Error("Failed to clone Quizlet set");
  }
}

export async function submitCustomTerms(data: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  const name = data.get("name") as string;

  if (!name) throw new Error("Name is invalid");

  const terms = data.get("terms") as string;

  if (!terms) throw new Error("Terms are invalid");

  const searchable = data.get("searchable") as string;

  const termsInsert: typeof quizars.$inferInsert = {
    name: name,
    terms: terms,
    author: userId,
    searchable: searchable === "true",
  };

  const id = await db
    .insert(quizars)
    .values(termsInsert)
    .returning({ id: quizars.id });

  return id[0].id;
}

export async function generateFlashcards(data: FormData) {
  "use server";

  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  const prompt = data.get("prompt") as string;
  if (!prompt) throw new Error("Prompt is invalid");

  const generator = new AISetGenerator();

  return generator.generate(prompt);
}
