export default function SearchInput() {
  return (
    <form action={"/search"}>
      <input type="text" name="query" placeholder="Search..." />
    </form>
  );
}
