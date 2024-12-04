import { db } from "@/db/index";
import { quizars } from "@/db/schema";
import { ilike } from "drizzle-orm";
import Link from "next/link";
import { Suspense } from "react";

export default async function Search({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <div>
      <h1 className="text-2xl">
        Search results for
        <span className="font-bold"> {(await searchParams).query}</span>
      </h1>
      <Suspense fallback={"Searching..."}>
        <SearchResults query={(await searchParams).query as string} />
      </Suspense>
    </div>
  );
}

async function SearchResults({ query }: { query: string }) {
  const terms = await db
    .select({
      name: quizars.name,
      id: quizars.id,
    })
    .from(quizars)
    .where(ilike(quizars.name, `%${query}%`))
    .limit(10);

  if (terms.length == 0) {
    return (
      <div>
        <h1>I have noting 😭</h1>
      </div>
    );
  }

  return (
    <div>
      <ul>
        {terms.map((termsItem, index) => (
          <li key={index} className="underline">
            <Link href={`/terms/${termsItem.id}`}>{termsItem.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
