import React from "react";
import GrammairePageWrapper from "@/components/wrappers/question-pages/grammaire-page-wrapper";
import GrammaireWrapper from "@/components/wrappers/question-data/grammaire-wrapper";
import { getQuestion } from "@/utils/question-fetcher";

/**
 * Page metadata for the grammar (grammaire) question page.
 * @property {string} title - The page title.
 * @property {string} description - The page description for SEO.
 */
export const metadata = {
  title: "Grammar Question",
  description: "Practice grammar with multiple-choice questions",
};

/**
 * Next.js server component for grammar (grammaire) questions.
 * Fetches question data via getQuestion and renders it within GrammairePageWrapper,
 * or displays a fallback message if no question is available.
 *
 * @async
 * @returns {Promise<JSX.Element>} The rendered page content.
 */
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
