import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <h1 className="text-4xl">Study for your test easier and simpler</h1>
      <div className="w-full h-fit p-1 flex justify-between items-center gap-2.5 text-xl text-blue-500">
        <Link className="underline" href={"/new"}>Create your own</Link>
        <Link className="underline" href={"/new/clone"}>Clone from Quizlet</Link>
        <Link className="underline" href={"/terms"}>Look at other</Link>
      </div>
    </div>
  );
}