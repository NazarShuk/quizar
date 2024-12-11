import NotFound from "@/app/not-found";
import { db } from "@/db/index";
import { quizars } from "@/db/schema";
import { clerkClient } from "@/lib/clerk";
import { eq } from "drizzle-orm";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";

export default async function Terms({
  params,
}: {
  params: Promise<{ termID: string }>;
}) {
  const id = parseInt((await params).termID);

  return (
    <Suspense fallback={<TermsListLoading />}>
      <TermsList id={id} />
    </Suspense>
  );
}

async function TermsListLoading() {
  return (
    <div>
      <div
        className={`h-20 mb-1 bg-gray-200 dark:bg-gray-700 rounded animate-pulse`}
        role="status"
        aria-label="Loading..."
      />
      <div
        className={`h-5 mb-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/4`}
        role="status"
        aria-label="Loading..."
      />

      {Array(5)
        .fill(null)
        .map((_, index) => (
          <div
            className={`h-20 mb-1.5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse`}
            role="status"
            aria-label="Loading..."
            key={index}
          />
        ))}
    </div>
  );
}

async function TermsList({ id }: { id: number }) {
  const termsQuery = await db
    .select({
      terms: quizars.terms,
      name: quizars.name,
      author: quizars.author,
      path: quizars.path,
    })
    .from(quizars)
    .where(eq(quizars.id, id))
    .limit(1);

  if (termsQuery.length == 0) {
    return <NotFound />;
  }

  const terms = {
    name: termsQuery[0].name as string,
    terms: termsQuery[0].terms as Array<{ term: string; definition: string }>,
  };

  return (
    <div>
      <h1 className="text-4xl mb-1">{terms.name}</h1>
      {termsQuery[0].path && (
        <Link
          className="underline"
          href={"https://quizlet.com" + termsQuery[0].path}
        >
          Original set on Quizlet
        </Link>
      )}
      <User id={termsQuery[0].author as string} />

      <div className="mb-5 flex items-center justify-stretch gap-1 h-24 text-xl">
        <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-800 dark:text-white rounded p-1 h-full w-full">
          <Link href={`/terms/${id}/flashcards`}>Flashcards</Link>
        </div>
        <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-800 dark:text-white rounded p-1 h-full w-full">
          <Link href={`/terms/${id}/test`}>Test</Link>
        </div>
        <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-800 dark:text-white rounded p-1 h-full w-full">
          <h1 className="opacity-50">Match (coming soon)</h1>
        </div>
      </div>

      <ul>
        {terms.terms.map((term, index) => (
          <li
            key={index}
            className="min-h-20 bg-gray-100 dark:bg-gray-800 dark:text-white mb-1.5 p-1 flex flex-col items-center justify-center text-center rounded"
          >
            <span className="font-bold">{term.term}</span>
            {term.definition}
          </li>
        ))}
      </ul>
    </div>
  );
}

async function User({ id }: { id: string }) {
  let user;
  try {
    user = await clerkClient.users.getUser(id);
  } catch (e) {
    console.error(e);
    user = { username: "Unknown", imageUrl: "https://via.placeholder.com/150" };
  }

  return (
    <div className="mb-1 flex items-center gap-1">
      <h1>Made by</h1>
      <Image
        className="rounded-full"
        width={25}
        height={25}
        src={user.imageUrl}
        alt={"Profile"}
      />
      <h1>{user.username}</h1>
    </div>
  );
}
