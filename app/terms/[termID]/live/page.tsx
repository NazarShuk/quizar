import Live from "./Live";
import { db } from "@/db";
import { quizars } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function LivePage({
    params,
  }: {
    params: Promise<{ termID: string }>;
  }){

      const id = parseInt((await params).termID);
    
      const terms = await db
        .select({
          terms: quizars.terms,
        })
        .from(quizars)
        .where(eq(quizars.id, id));


    return <Live terms={terms[0].terms as Array<{term: string, definition: string}>} />
}