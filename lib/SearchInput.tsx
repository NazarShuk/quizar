export default function SearchInput() {
  return (
    <form action={"/search"}>
      <input
        className="p-2.5 dark:bg-gray-700 dark:text-white rounded"
        type="text"
        name="query"
        placeholder="Search..."
      />
    </form>
  );
}
