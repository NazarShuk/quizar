"use client";
import { useState } from "react";
import { cloneQuizlet } from "./actions";
import { useRouter } from "next/navigation";

export default function Home() {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <CloneForm />
    </div>
  );
}

function CloneForm() {
  const [isSubmitting, setSubmitting] = useState(false);
  const router = useRouter();

  async function submitForm(formData: FormData) {
    console.log("started submit");
    setSubmitting(true);

    try {
      const result = await cloneQuizlet(formData);

      setSubmitting(false);
      router.push(`/terms/${result}`);
    } catch (e) {
      setSubmitting(false);
      alert(e);
    }
  }

  if (isSubmitting) {
    return (
      <div className="flex bg-gray-300 justify-center items-center">
        <h1 className="animate-spin">Loading</h1>
      </div>
    );
  }

  return (
    <div>
      <h1 className={"text-3xl"}>Clone a quizlet</h1>
      <form action={submitForm}>
        <input name="url" placeholder="Quizlet link" required></input>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
