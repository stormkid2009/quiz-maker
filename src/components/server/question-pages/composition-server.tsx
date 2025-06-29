import React from "react";
import CompositionPageWrapper from "@/components/wrappers/question-pages/composition-page-wrapper";
import CompositionWrapper from "@/components/wrappers/question-data/composition-wrapper";
import { getQuestion } from "@/utils/question-fetcher";

/**
 * Page metadata for the composition question page.
 * @property {string} title - The page title.
 * @property {string} description - The page description for SEO.
 */
export const metadata = {
  title: "Composition Question",
  description: "Practice writing with open-ended questions",
};

/**
 * Next.js server component for composition questions.
 * Fetches question data via getQuestion and renders it within CompositionPageWrapper,
 * or displays a fallback message if no question is available.
 *
 * @async
 * @returns {Promise<JSX.Element>} The rendered page content.
 */
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
