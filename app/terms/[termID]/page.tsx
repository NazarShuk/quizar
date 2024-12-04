import { db } from "@/db/index";
import { quizars } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function Terms({
  params,
}: {
  params: Promise<{ termID: string }>;
}) {
  const id = parseInt((await params).termID);

  const termsQuery = await db
    .select({
      terms: quizars.terms,
      name: quizars.name,
    })
    .from(quizars)
    .where(eq(quizars.id, id));

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
