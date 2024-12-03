export default async function Search({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <div>
      <h1>search for {(await searchParams).query}</h1>
    </div>
  );
}
