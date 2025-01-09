"use client";
import { LoaderCircle } from "lucide-react";
import { useFormStatus } from "react-dom";

export default function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      className="p-2.5 rounded bg-gray-100 w-32 dark:bg-gray-800 dark:text-white"
      disabled={pending}
      type="submit"
    >
      {pending ? <LoadingSpinner /> : "Submit"}
    </button>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex flex-row justify-center items-center gap-2.5">
      <LoaderCircle className="animate-spin" />
      <div>Loading...</div>
    </div>
  );
}
