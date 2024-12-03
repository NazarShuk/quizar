import { searchTerms } from "../db";
import Link from "next/link";
import SearchInput from "../lib/SearchInput";
import { Suspense } from "react";

export default async function Search({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <Suspense fallback={"..."}>
      <SearchResults query={(await searchParams).query as string} />
    </Suspense>
  );
}

async function SearchResults({ query }: { query: string }) {
  const terms = await searchTerms(query);

  if (terms.length == 0) {
    return (
      <div>
        <h1 className="text-2xl">
          There were no search results for
          <span className="font-bold"> {query}</span>
        </h1>

        <h2>Maybe search for something else:</h2>
        <SearchInput />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl">
        Search results for <span className="font-bold">{query}</span>
      </h1>
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
