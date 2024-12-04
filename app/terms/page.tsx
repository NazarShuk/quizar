import { db } from "@/db/index";
import { quizars } from "@/db/schema";
import Link from "next/link";
import { Suspense } from "react";

export default async function Terms() {
  return (
    <Suspense fallback={"Loading..."}>
      <TermsList />
    </Suspense>
  );
}

async function TermsList() {
  const terms = await db
    .select({
      name: quizars.name,
      id: quizars.id,
    })
    .from(quizars)
    .limit(10);

  return (
    <div>
      <ul>
        {terms.map((termsItem, index) => (
          <li key={index}>
            <Link href={`/terms/${termsItem.id}`}>{termsItem.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
