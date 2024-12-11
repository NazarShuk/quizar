import NotFound from "@/app/not-found";
import { db } from "@/db";
import { quizars } from "@/db/schema";
import { clerkClient } from "@/lib/clerk";
import { User } from "@clerk/backend";
import { eq } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link"
import { Suspense } from "react";


export default async function UserPage({ params } : { params : Promise<{ userID : string }> }) {
    const id = (await params).userID;

    let user;
    try {
        user = await clerkClient.users.getUser(id);
    } catch (e) {
        console.error(e);
        return <NotFound />;
    }

    return (
        <div>
            <div className="mb-1 flex items-center gap-1">
                <Image className="rounded-full" width={100} height={100} src={user.imageUrl} alt={"Profile"} />
                <h1 className="text-2xl font-bold">{user.username}</h1>
            </div>
            <Suspense fallback={<TermsLoading />}>
                <UserTerms user={user} />
            </Suspense>
        </div>
    );
}

function TermsLoading(){
    return (
        <div>
        {Array(3).fill(null).map((_, index) => (
            <div
                className={`h-16 mb-1 bg-gray-200 dark:bg-gray-700 dark:text-white rounded animate-pulse`}
                role="status"
                aria-label="Loading..."
                key={index}
            />
        ))}
        </div>
    )
}

async function UserTerms({user} : { user: User }) {

    const terms = await db
        .select()
        .from(quizars)
        .where(eq(quizars.author, user.id))
        .limit(10)
    
    if (terms.length === 0) {
        return <div>He has noting 😭</div>
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
          </li>
        ))}
      </ul>
    </div>
    )

}