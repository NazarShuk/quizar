import { db } from "@/db/index";
import { quizars } from "@/db/schema";
import Link from "next/link";

export default async function TermsPage() {
  try {
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
          {terms.map((termsItem) => (
            <li key={termsItem.id}>
              <Link href={`/terms/${termsItem.id}`}>{termsItem.name}</Link>
            </li>
          ))}
        </ul>
      </div>
    );
  } catch (error) {
    console.error("Error fetching terms:", error);
    return <div>Error loading terms. Please try again later.</div>;
  }
}
