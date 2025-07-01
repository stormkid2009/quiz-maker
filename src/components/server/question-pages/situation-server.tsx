import React from "react";
import SituationPageWrapper from "@/components/wrappers/question-pages/situation-page-wrapper";
import SituationWrapper from "@/components/wrappers/question-data/situation-wrapper";

export const metadata = {
  title: "Situation Question",
  description: "Practice situation with multiple-choice questions",
};

/**
 * Fetches a situation question from the backend API.
 *
 * @async
 * @returns {Promise<any | null>} The fetched question data or null if an error occurs.
 */
async function getSituationQuestion() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/situation`,
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
        `Failed to fetch grammaire question: ${response.statusText}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching situation question:", error);
    return null;
  }
}

/**
 * Next.js server component that renders a situation question page.
 * Fetches question data and displays it within a wrapper or shows a fallback.
 *
 * @async
 * @returns {Promise<JSX.Element>} The rendered SituationPageWrapper or a fallback message.
 */
export default async function SituationServer() {
  const question = await getSituationQuestion();

  if (!question) {
    return (
      <div className="p-4 bg-yellow-50 text-yellow-700 rounded-md">
        <p>No situation question available.</p>
      </div>
    );
  }

  return (
    <SituationPageWrapper
      title="Situation Questions"
      description="These questions present real-world situations and require multiple selections. Select all that apply in each situation."
      firstAnswer={question.rightAnswer[0]}
      secondAnswer={question.rightAnswer[1]}
    >
      <SituationWrapper question={question} />
    </SituationPageWrapper>
  );
}
