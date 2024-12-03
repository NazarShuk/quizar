import { getTerms } from "@/app/db";

export default async function Terms({
  params,
}: {
  params: Promise<{ termID: string }>;
}) {
  const id = (await params).termID;
  const terms: Array<{ term: string; definition: string }> = await getTerms(
    parseInt(id),
  );

  return (
    <div>
      <ul>
        {terms.map((term, index) => (
          <li key={index} className="h-20">
            {term.term} - {term.definition}
          </li>
        ))}
      </ul>
    </div>
  );
}
