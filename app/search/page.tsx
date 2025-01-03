import { db } from "@/db/index";
import { quizars } from "@/db/schema";
import { ilike, eq, and } from "drizzle-orm";
import Link from "next/link";
import { Suspense } from "react";
import Image from "next/image";
import { clerkClient } from "@/lib/clerk";

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
      <Suspense fallback={<Searching />}>
        <SearchResults query={(await searchParams).query as string} />
      </Suspense>
    </div>
  );
}

async function Searching() {
  return (
    <div>
      {Array(5)
        .fill(null)
        .map((_, index) => (
          <div
            className={`h-20 mb-1 bg-gray-200 dark:bg-gray-700 dark:text-white rounded animate-pulse`}
            role="status"
            aria-label="Loading..."
            key={index}
          />
        ))}
    </div>
  );
}

async function SearchResults({ query }: { query: string }) {
  const terms = await db
    .select({
      name: quizars.name,
      id: quizars.id,
      author: quizars.author,
    })
    .from(quizars)
    .where(and(ilike(quizars.name, `%${query}%`), eq(quizars.searchable, true)))
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
          <li
            key={index}
            className="underline h-16 bg-gray-100 dark:bg-gray-800 dark:text-white flex flex-row justify-between items-center p-1 rounded mb-1"
          >
            <Link href={`/terms/${termsItem.id}`}>{termsItem.name}</Link>
            <User className="no-underline" id={termsItem.author} />
          </li>
        ))}
      </ul>
    </div>
  );
}

async function User({ id, className }: { id: string; className: string }) {
  let user;
  try {
    user = await clerkClient.users.getUser(id);
  } catch (e) {
    console.error(e);
    return;
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      Made by
      <Image
        className="rounded-full"
        width={25}
        height={25}
        src={user.imageUrl}
        alt={"Profile"}
      />
      <Link href={`/users/${user.id}`}>{user.username}</Link>
    </div>
  );
}
