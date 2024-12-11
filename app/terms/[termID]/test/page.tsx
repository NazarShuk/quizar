import { db } from "@/db";
import { quizars } from "@/db/schema";
import { eq } from "drizzle-orm";
import Test from "./Test";
import { clerkClient } from "@/lib/clerk";

export default async function TestPage({
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
      <Test
        terms={terms[0].terms as Array<{ term: string; definition: string }>}
        name={terms[0].name as string}
        authorName={(user.username as string) || "Unknown"}
        authorImageURL={user.imageUrl || "https://via.placeholder.com/150"}
      />
    </div>
  );
}
