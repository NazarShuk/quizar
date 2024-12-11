"use client";
import { useFormStatus } from "react-dom";

export default function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      className="p-2.5 rounded bg-gray-100 w-32 dark:bg-gray-800 dark:text-white"
      disabled={pending}
      type="submit"
    >
      {pending ? "Loading..." : "Submit"}
    </button>
  );
}
