import React from "react";
import Question from "../inputs/question";
import { ReadingComprehensionQuestion } from "@/shared/schemas/rc";

async function getPassageQuestion() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1/passage`,
      {
        method: "GET",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch passage question: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching passage question:", error);
    return null;
  }
}

interface PassageProps {
  onAnswerChange?: (questionId: string, answers: string[]) => void;
}

export default async function Passage({
  onAnswerChange = () => {},
}: PassageProps) {
  const question = await getPassageQuestion();

  if (!question) {
    return (
      <div className="p-4 bg-yellow-50 text-yellow-700 rounded-md">
        <p>No reading passage available.</p>
      </div>
    );
  }

  // Convert to client component through a wrapper
  return (
    <div className="passage-question p-4 border border-amber-200 rounded-lg bg-amber-50">
      <h2 className="text-lg font-semibold mb-2">Reading Comprehension</h2>

      <ClientQuestionWrapper
        question={question}
        onAnswerChange={onAnswerChange}
      />
    </div>
  );
}

// Client component wrapper to handle the client-side interactions
("use client");

function ClientQuestionWrapper({
  question,
  onAnswerChange,
}: {
  question: ReadingComprehensionQuestion;
  onAnswerChange: (questionId: string, answers: string[]) => void;
}) {
  return <Question question={question} onAnswerChange={onAnswerChange} />;
}
