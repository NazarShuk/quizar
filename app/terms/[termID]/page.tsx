import { getTerms } from "@/app/db";

export default async function Terms({
  params,
}: {
  params: Promise<{ termID: string }>;
}) {
  const id = (await params).termID;
  const terms = await getTerms(parseInt(id));

  return (
    <div>
      <h1 className="text-4xl">{terms.name}</h1>
      <ul>
        {terms.terms.map((term, index) => (
          <li key={index} className="h-20">
            {term.term} - {term.definition}
          </li>
        ))}
      </ul>
    </div>
  );
}
