import React from "react";
import Question from "../inputs/question";

async function getSituationQuestion() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1/situation`,
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
        `Failed to fetch situation question: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching situation question:", error);
    return null;
  }
}

interface SituationProps {
  onAnswerChange?: (questionId: string, answers: string[]) => void;
}

export default async function Situation({
  onAnswerChange = () => {},
}: SituationProps) {
  const question = await getSituationQuestion();

  if (!question) {
    return (
      <div className="p-4 bg-yellow-50 text-yellow-700 rounded-md">
        <p>No situation question available.</p>
      </div>
    );
  }

  // Convert to client component through a wrapper
  return (
    <div className="situation-question p-4 border border-purple-200 rounded-lg bg-purple-50">
      <h2 className="text-lg font-semibold mb-2">
        Situation Question (Multi-Choice)
      </h2>

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
  question: any;
  onAnswerChange: (questionId: string, answers: string[]) => void;
}) {
  return <Question question={question} onAnswerChange={onAnswerChange} />;
}
