"use client";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";
import Image from "next/image";

export default function Flashcards({
  terms,
  name,
  authorName,
  authorImageURL,
}: {
  terms: Array<{ term: string; definition: string }>;
  name: string;
  authorName: string;
  authorImageURL: string;
}) {
  const [currentTerm, setCurrentTerm] = useState(0);
  const [flipped, setFlipped] = useState(false);

  function switchTerm(increment: number) {
    setFlipped(false);
    const newIndex = currentTerm + increment;
    if (newIndex >= 0 && newIndex < terms.length) {
      setCurrentTerm(newIndex);
    }
  }

  return (
    <div className="perspective-1000">
      <h1 className="text-4xl mb-1">{name}</h1>
      <User userName={authorName} userImageURL={authorImageURL} />

      <div className="relative w-full h-48">
        <motion.div
          className="w-full h-full absolute cursor-pointer preserve-3d"
          onClick={() => setFlipped(!flipped)}
          animate={{ rotateX: flipped ? 180 : 0 }}
          transition={{
            duration: 0.6,
            type: "spring",
            stiffness: 500,
            damping: 30,
          }}
        >
          {/* Front of card */}
          <div className="w-full h-full absolute bg-gray-100 dark:bg-gray-800 dark:text-white flex justify-center items-center frontface-hidden">
            <h1 className="text-xl p-4 text-center">
              {terms[currentTerm].term}
            </h1>
          </div>

          {/* Back of card */}
          <div className="w-full h-full absolute bg-gray-100 dark:bg-gray-800 flex justify-center items-center backface-hidden rotate-x-180">
            <h1 className="text-xl p-4 text-center">
              {terms[currentTerm].definition}
            </h1>
          </div>
        </motion.div>
      </div>

      <div className="flex justify-between items-center w-full mt-4">
        <button
          onClick={() => switchTerm(-1)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
          disabled={currentTerm === 0}
        >
          <ArrowLeft />
        </button>
        <span className="text-sm text-gray-500">
          {currentTerm + 1} / {terms.length}
        </span>
        <button
          onClick={() => switchTerm(1)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
          disabled={currentTerm === terms.length - 1}
        >
          <ArrowRight />
        </button>
      </div>
    </div>
  );
}

function User({
  userName,
  userImageURL,
}: {
  userName: string;
  userImageURL: string;
}) {
  return (
    <div className="mb-1 flex items-center gap-1">
      <h1>Made by</h1>
      <Image
        className="rounded-full"
        width={25}
        height={25}
        src={userImageURL}
        alt={"Profile"}
      />
      <h1>{userName}</h1>
    </div>
  );
}
