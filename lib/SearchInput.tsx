export default function SearchInput() {
  return (
    <form action={"/search"}>
      <input
        className="p-2.5 "
        type="text"
        name="query"
        placeholder="Search..."
      />
    </form>
  );
}
