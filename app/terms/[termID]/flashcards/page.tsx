import { db } from "@/db";
import { quizars } from "@/db/schema";
import { eq } from "drizzle-orm";
import Flashcards from "./Flashcards";
import { clerkClient } from "@/lib/clerk";

export default async function FlashcardsPage({
  params,
}: {
  params: Promise<{ termID: string }>;
}) {
  const id = parseInt((await params).termID);

  const terms = await db
    .select({
      terms: quizars.terms,
      name: quizars.name,
      author: quizars.author,
    })
    .from(quizars)
    .where(eq(quizars.id, id));

  let user;
  try {
    user = await clerkClient.users.getUser(terms[0].author as string);
  } catch (e) {
    console.error(e);
    user = { username: "Unknown", imageUrl: "https://via.placeholder.com/150" };
  }

  return (
    <div>
      <Flashcards
        terms={terms[0].terms as Array<{ term: string; definition: string }>}
        name={terms[0].name as string}
        authorName={user.username as string}
        authorImageURL={user.imageUrl}
      />
    </div>
  );
}
