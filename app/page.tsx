import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div className="w-full h-screen translate-y-[-3em] flex justify-center items-center flex-col">
        <h1 className="text-4xl bg-gradient-to-r from-black to-blue-500 bg-clip-text text-transparent font-extrabold">Study for your test easier and simpler</h1>
        
        <div className="w-full h-fit p-1 flex justify-center items-center gap-2.5 text-xl text-blue-500">
          <Link className="text-black bg-gray-100 p-2.5 rounded" href={"/new"}>
            Create your own
          </Link>
          <Link className="text-black bg-gray-100 p-2.5 rounded" href={"/new/clone"}>
            Clone from Quizlet
          </Link>
        </div>
      </div>

    </div>
  );
}
