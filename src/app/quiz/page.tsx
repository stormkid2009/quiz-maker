import React from "react";
import QuizContainer from "@/components/quiz/quiz-container";

/**
 * Page metadata for the quiz challenge page.
 * @property {string} title - The page title.
 * @property {string} description - The page description for SEO.
 */
export const metadata = {
  title: "Quiz",
  description: "Take a quiz with different types of questions",
};

/**
 * QuizPage component renders the main quiz interface with the QuizContainer.
 *
 * @component
 * @returns {JSX.Element} The rendered quiz page with a title and the quiz container.
 */
export default function QuizPage() {
  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Quiz Challenge</h1>
      <QuizContainer />
    </main>
  );
}
