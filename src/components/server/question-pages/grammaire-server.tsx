import React from "react";
import GrammairePageWrapper from "@/components/wrappers/question-pages/grammaire-page-wrapper";
import GrammaireWrapper from "@/components/wrappers/training-home/grammaire-wrapper";
import { getQuestion } from "@/utils/question-fetcher";
export const metadata = {
  title: "Grammar Question",
  description: "Practice grammar with multiple-choice questions",
};

export default async function GrammaireServer() {
  const question = await getQuestion("grammaire");

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
