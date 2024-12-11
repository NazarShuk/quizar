"use client";
import Image from "next/image";
import { useState, useMemo } from "react";

export default function Test({
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
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: string;
  }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Generate options for each term only once using useMemo
  const quizOptions = useMemo(() => {
    return terms.map((currentTerm) => {
      // Shuffle the terms to get random incorrect options
      const shuffledTerms = [...terms].sort(() => 0.5 - Math.random());

      // Create an array of incorrect definitions, ensuring no duplicates
      const incorrectOptions = shuffledTerms
        .filter((item) => item.definition !== currentTerm.definition)
        .slice(0, 3)
        .map((item) => item.definition);

      // Combine correct and incorrect options, then shuffle
      const allOptions = [
        { text: currentTerm.definition, isCorrect: true },
        ...incorrectOptions.map((def) => ({ text: def, isCorrect: false })),
      ].sort(() => 0.5 - Math.random());

      return allOptions;
    });
  }, [terms]);

  // Handle answer selection
  const handleAnswerSelect = (questionIndex: number, optionText: string) => {
    if (!isSubmitted) {
      setSelectedAnswers((prev) => ({
        ...prev,
        [questionIndex]: optionText,
      }));
    }
  };

  // Submit quiz
  const handleSubmit = () => {
    // Calculate score
    const newScore = terms.reduce((total, term, index) => {
      const selectedOption = selectedAnswers[index];
      const options = quizOptions[index];
      const correctOption = options.find((opt) => opt.isCorrect);

      return total + (selectedOption === correctOption?.text ? 1 : 0);
    }, 0);

    setScore(newScore);
    setIsSubmitted(true);
  };

  // Check if all questions are answered
  const allQuestionsAnswered =
    Object.keys(selectedAnswers).length === terms.length;

  return (
    <div className="p-4">
      <h1 className="text-4xl">{name}</h1>
      <User
        className="mb-4"
        userName={authorName}
        userImageURL={authorImageURL}
      />

      <div className="space-y-6">
        {terms.map((term, questionIndex) => {
          const options = quizOptions[questionIndex];
          const selectedAnswer = selectedAnswers[questionIndex];

          return (
            <div
              key={questionIndex}
              className="border-b dark:border-gray-700 pb-4"
            >
              <p className="text-xl mb-3">{term.term}</p>

              <div className="space-y-2">
                {options.map((option, optionIndex) => {
                  const isSelected = selectedAnswer === option.text;
                  const showCorrectness = isSubmitted && option.isCorrect;
                  const showIncorrectness =
                    isSubmitted && isSelected && !option.isCorrect;

                  return (
                    <button
                      key={optionIndex}
                      onClick={() =>
                        handleAnswerSelect(questionIndex, option.text)
                      }
                      disabled={isSubmitted}
                      className={`
                        w-full p-2 text-left border dark:border-gray-700 rounded
                        ${showCorrectness ? "bg-green-200 dark:bg-green-700 border-green-600" : ""}
                        ${showIncorrectness ? "bg-red-200 dark:bg-red-700 border-red-600" : ""}
                        ${!isSubmitted && isSelected ? "bg-blue-100 dark:bg-blue-700" : ""}
                        ${!isSubmitted ? "hover:bg-gray-100 dark:hover:bg-gray-800" : ""}
                        active:scale-95
                        transition
                      `}
                    >
                      {option.text}
                      {showCorrectness && (
                        <span className="float-right text-green-700">✓</span>
                      )}
                      {showIncorrectness && (
                        <span className="float-right text-red-700">✗</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {!isSubmitted && allQuestionsAnswered && (
        <button
          onClick={handleSubmit}
          className="mt-4 w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Submit Quiz
        </button>
      )}

      {isSubmitted && (
        <div className="mt-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
          <p className="text-xl">
            Your Score: {score} / {terms.length}
          </p>
        </div>
      )}
    </div>
  );
}

function User({
  userName,
  userImageURL,
  className,
}: {
  userName: string;
  userImageURL: string;
  className?: string;
}) {
  return (
    <div className={`mb-1 flex items-center gap-2 ${className}`}>
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
