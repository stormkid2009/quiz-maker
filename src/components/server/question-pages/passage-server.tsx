import React from "react";
import PassagePageWrapper from "@/components/wrappers/question-pages/passage-page-wrapper";
import PassageWrapper from "@/components/wrappers/question-data/passage-wrapper";
import { getQuestion } from "@/utils/question-fetcher";

/**
 * Page metadata for the reading comprehension (passage) question page.
 * @property {string} title - The page title.
 * @property {string} description - The page description for SEO.
 */
export const metadata = {
  title: "Passage Question",
  description: "Practice reading comprehension with multiple-choice questions",
};

/**
 * Next.js server component for reading comprehension (passage) questions.
 * Fetches question data via getQuestion and renders it within PassagePageWrapper,
 * or displays a fallback message if no question is available.
 *
 * @async
 * @returns {Promise<JSX.Element>} The rendered page content.
 */
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
