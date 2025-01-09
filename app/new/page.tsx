"use client";
import { ChangeEvent, useRef, useState } from "react";
import { submitCustomTerms } from "../actions";
import { useRouter } from "next/navigation";
import { Trash } from "lucide-react";
import SubmitButton from "@/lib/SubmitButton";
import { generateFlashcards } from "@/app/actions";

export default function TermsCreator() {
  const [terms, setTerms] = useState<
    Array<{ term: string; definition: string }>
  >([]);
  const nameInput = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function submitTerms(data: FormData) {
    try {
      const id = await submitCustomTerms(data);

      router.push(`/terms/${id}`);
    } catch (e) {
      alert(e);
    }
  }

  return (
    <div className={"text-center"}>
      <h1 className={"text-2xl"}>Create new Quizar</h1>

      <div className="mb-5 flex flex-row justify-center items-center gap-5">
        <form
          action={submitTerms}
          className=" flex flex-col justify-start w-1/2"
        >
          <input
            className="bg-gray-100 p-1 rounded dark:bg-gray-700 dark:text-white"
            name="name"
            placeholder="Name"
            ref={nameInput}
            required
          ></input>
          <div className="w-full flex justify-between p-1">
            <label>Public: </label>
            <input
              type="checkbox"
              name="searchable"
              defaultValue="true"
            ></input>
          </div>
          <input
            readOnly
            value={JSON.stringify(terms)}
            hidden
            name="terms"
          ></input>
          <SubmitButton />
        </form>

        <AIForm
          setTerms={(setName, terms) => {
            nameInput.current!.value = setName;
            setTerms(terms);
          }}
        />
      </div>

      <TermsList
        getTerms={() => {
          const termsWithId = JSON.parse(JSON.stringify(terms));
          for (let i = 0; i < termsWithId.length; i++) {
            termsWithId[i].id = i + 1;
          }
          return termsWithId;
        }}
        onUpdate={(t) => setTerms(t)}
      />
    </div>
  );
}

function AIForm({
  setTerms,
}: {
  setTerms: (
    setName: string,
    terms: Array<{ term: string; definition: string }>
  ) => void;
}) {
  async function submit(data: FormData) {
    try {
      const result = await generateFlashcards(data);

      console.log(result);
      setTerms(result.cards_set_name, result.cards);
    } catch (e) {
      alert(e);
    }
  }

  return (
    <form
      className="flex flex-col justify-between h-full w-1/2"
      action={submit}
    >
      <input
        className="bg-gray-100 p-1 rounded dark:bg-gray-700 dark:text-white"
        name="prompt"
        placeholder="Ask AI to generate flashcards"
        required
      ></input>
      <SubmitButton />
    </form>
  );
}

function TermsList({
  getTerms,
  onUpdate,
}: {
  getTerms: () => Array<{ id: number; term: string; definition: string }>;
  onUpdate: (terms: Array<{ term: string; definition: string }>) => void;
}) {
  const terms = getTerms(); // Get the transformed terms when needed

  function addTerm() {
    const newId =
      terms.length > 0 ? Math.max(...terms.map((t) => t.id)) + 1 : 1;
    const newTerms = [...terms, { id: newId, term: "", definition: "" }];
    //eslint-disable-next-line
    onUpdate(newTerms.map(({ id, ...rest }) => rest));
  }

  function removeTerm(idToRemove: number) {
    const newTerms = terms.filter((term) => term.id !== idToRemove);
    // eslint-disable-next-line
    onUpdate(newTerms.map(({ id, ...rest }) => rest));
  }

  function updateTerm(id: number, term: string, definition: string) {
    const newTerms = terms.map((t) =>
      t.id === id ? { ...t, term, definition } : t
    );
    // eslint-disable-next-line
    onUpdate(newTerms.map(({ id, ...rest }) => rest));
  }

  return (
    <div>
      <ul>
        {terms.map((term) => (
          <Term
            onRemove={() => removeTerm(term.id)}
            onUpdate={(termS, definition) =>
              updateTerm(term.id, termS, definition)
            }
            key={term.id}
            Defaultterm={term.term}
            Defaultdefinition={term.definition}
          />
        ))}
      </ul>
      <button
        onClick={addTerm}
        className="p-2.5 bg-gray-100 rounded dark:bg-gray-800 dark:text-white"
      >
        Add more terms
      </button>
    </div>
  );
}

function Term({
  onRemove,
  onUpdate,
  Defaultterm,
  Defaultdefinition,
}: {
  onRemove: () => void;
  onUpdate: (term: string, definition: string) => void;
  Defaultterm: string;
  Defaultdefinition: string;
}) {
  const [term, setTerm] = useState(Defaultterm || "");
  const [definition, setDefinition] = useState(Defaultdefinition || "");

  function onTermChange(e: ChangeEvent<HTMLTextAreaElement>) {
    onUpdate(e.target.value, definition);
    setTerm(e.target.value);
  }

  function onDefinitionChange(e: ChangeEvent<HTMLTextAreaElement>) {
    onUpdate(term, e.target.value);
    setDefinition(e.target.value);
  }

  return (
    <li className="min-h-20 bg-gray-100 dark:bg-gray-800 dark:text-white mb-1.5 p-1 flex flex-col items-end justify-between text-center rounded">
      <button className="w-fit h-full right-0 mb-1" onClick={onRemove}>
        <Trash width={20} height={20} />
      </button>
      <div className="flex items-center justify-between gap-2.5 h-full w-full">
        <textarea
          onChange={onTermChange}
          className="resize-none h-full w-full dark:bg-gray-700 dark:text-white rounded p-1"
          placeholder="Term"
          value={term}
        ></textarea>
        <textarea
          onChange={onDefinitionChange}
          className="resize-none h-full w-full dark:bg-gray-700 dark:text-white rounded p-1"
          placeholder="Definition"
          value={definition}
        ></textarea>
      </div>
    </li>
  );
}
