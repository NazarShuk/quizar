"use client";
import { useState } from "react";
import { cloneQuizlet } from "@/app/actions";
import { useRouter } from "next/navigation";

export default function ClonePage() {
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
    if (isSubmitting) {
      return;
    }

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
    <div className="w-full m-auto text-center">
      <h1 className={"text-3xl"}>Clone a quizlet</h1>
      <form
        action={submitForm}
        className="flex flex-col justify-start w-1/2 m-auto"
      >
        <input
          className="p-1 bg-gray-100 rounded dark:bg-gray-700 dark:text-white"
          name="url"
          placeholder="Quizlet link"
          required
        ></input>
        <div className="flex justify-between p-1">
          <label>Public: </label>
          <input type="checkbox" name="searchable" defaultValue="true"></input>
        </div>
        <button
          className="bg-gray-100 rounded w-32 p-1 m-auto dark:bg-gray-700 dark:text-white"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
