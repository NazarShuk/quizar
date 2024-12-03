import { getTermsPage } from "../db";
import Link from "next/link";

export default async function Terms() {
  const terms = await getTermsPage(0);

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
