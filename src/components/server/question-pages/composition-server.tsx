import React from "react";
import CompositionPageWrapper from "@/components/wrappers/question-pages/composition-page-wrapper";
import CompositionWrapper from "@/components/wrappers/question-data/composition-wrapper";
import { getQuestion } from "@/utils/question-fetcher";

export const metadata = {
  title: "Composition Question",
  description: "Practice writing with open-ended questions",
};
export default async function CompositionServer() {
  const question = await getQuestion("composition");
  if (!question) {
    return (
      <div className="p-4 bg-yellow-50 text-yellow-700 rounded-md">
        <p>No composition question available.</p>
      </div>
    );
  }
  return (
    <CompositionPageWrapper
      title="Composition Question"
      description="Practice writing with open-ended questions"
      answer={question.answer}
    >
      <CompositionWrapper question={question} />
    </CompositionPageWrapper>
  );
}
