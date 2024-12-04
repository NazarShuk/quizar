import { db } from "@/db/index";
import { quizars } from "@/db/schema";
import Link from "next/link";

export default async function Terms() {
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
