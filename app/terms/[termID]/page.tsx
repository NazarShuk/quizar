import NotFound from "@/app/not-found";
import { db } from "@/db/index";
import { quizars } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Suspense } from "react";

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
        className={`h-24 mb-5 bg-gray-200 rounded animate-pulse`}
        role="status"
        aria-label="Loading..."
      />

      {Array(20)
        .fill(null)
        .map((_, index) => (
          <div
            className={`h-20 mb-1.5 bg-gray-200 rounded animate-pulse`}
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
    })
    .from(quizars)
    .where(eq(quizars.id, id));

  if(termsQuery.length == 0){
    return <NotFound />
  }
  
  const terms = {
    name: termsQuery[0].name as string,
    terms: termsQuery[0].terms as Array<{ term: string; definition: string }>,
  };


  return (
    <div>
      <h1 className="text-4xl mb-5">{terms.name}</h1>
      <ul>
        {terms.terms.map((term, index) => (
          <li
            key={index}
            className="min-h-20 bg-gray-100 mb-1.5 p-1 flex flex-col items-center justify-center text-center rounded"
          >
            <span className="font-bold">{term.term}</span>
            {term.definition}
          </li>
        ))}
      </ul>
    </div>
  );
}
