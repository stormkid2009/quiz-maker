import React from "react";
import PassagePageWrapper from "@/components/wrappers/question-pages/passage-page-wrapper";
import PassageWrapper from "@/components/wrappers/training-home/passage-wrapper";
import { getQuestion } from "@/utils/question-fetcher";

export const metadata = {
  title: "Passage Question",
  description: "Practice reading comprehension with multiple-choice questions",
};
export default async function PassageServer() {
  const question = await getQuestion("passage");
  if (!question) {
    return (
      <div className="p-4 bg-yellow-50 text-yellow-700 rounded-md">
        <p>No passage question available.</p>
      </div>
    );
  }
  return (
    <PassagePageWrapper
      title="Reading Comprehension"
      description="These questions test your ability to understand and analyze written passages. Read the passage carefully and answer the related questions."
      firstAnswer={question.relatedQuestions[0].rightAnswer[0]}
      secondAnswer={question.relatedQuestions[1].rightAnswer[0]}
    >
      <PassageWrapper question={question} />
    </PassagePageWrapper>
  );
}
