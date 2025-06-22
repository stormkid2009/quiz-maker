import React from "react";
import GrammairePageWrapper from "@/components/wrappers/question-pages/grammaire-wrapper";
import GrammaireWrapper from "@/components/wrappers/training-home/grammaire-wrapper";

export const metadata = {
  title: "Grammar Questions",
  description: "Practice grammar with multiple-choice questions",
};

async function getGrammaireQuestion() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/grammaire`,
      {
        method: "GET",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    if (!response.ok) {
      throw new Error(
        `Failed to fetch grammaire question: ${response.statusText}`,
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching grammaire question:", error);
    return null;
  }
}

export default async function GrammairePage() {
  const question = await getGrammaireQuestion();

  if (!question) {
    return (
      <div className="p-4 bg-yellow-50 text-yellow-700 rounded-md">
        <p>No grammaire question available.</p>
      </div>
    );
  }

  return (
    <GrammairePageWrapper
      title="Grammar Questions"
      description="Test your grammar knowledge with these multiple-choice questions. Each question has one correct answer."
      rightAnswer={question.rightAnswer[0]}
    >
      <GrammaireWrapper question={question} />
    </GrammairePageWrapper>
  );
}
