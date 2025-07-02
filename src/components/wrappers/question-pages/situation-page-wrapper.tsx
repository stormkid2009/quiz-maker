"use client";

// client component wrapper for situation question in question pages
import React from "react";
import Link from "next/link";
import { useState } from "react";
import QuestionActions from "@/components/buttons/question-actions";
import BackToQuestions from "@/components/buttons/back-to-questions";

/**
 * Props for the SituationPageWrapper component.
 * @property {string} title - Title of the situation question page.
 * @property {string} description - Description or prompt for the situation.
 * @property {React.ReactNode} children - JSX content for rendering the question.
 * @property {string} firstAnswer - The first correct answer to reveal.
 * @property {string} secondAnswer - The second correct answer to reveal.
 */
interface SituationPageWrapperProps {
  title: string;
  description: string;
  children: React.ReactNode;
  firstAnswer: string;
  secondAnswer: string;
}

/**
 * React client component wrapper for situation question pages.
 * Renders title, description, question content, answer reveal, and navigation actions.
 *
 * @param {SituationPageWrapperProps} props - Component properties.
 * @returns {JSX.Element} The rendered page layout.
 */
export default function SituationPageWrapper({
  title,
  description,
  children,
  firstAnswer,
  secondAnswer,
}: SituationPageWrapperProps) {
  const [isAnswerVisible, setIsAnswerVisible] = useState(false);

  /**
   * Reveal the correct answer by setting visibility flag.
   */
  const showTheAnswer = () => {
    //console.log("Setting answer to visible!");
    setIsAnswerVisible(true);
  };

  /**
   * Load a new situation question, resetting state or reloading.
   */
  const loadNewSituationQuestion = () => {
    //console.log("Fetching a new situation question...");
    // In a real app, you'd fetch data here and reset state
    window.location.reload(); // Or use the default behavior
  };
  return (
    <main className="container mx-auto py-8 px-4">
      <BackToQuestions />
      <h1 className="text-3xl font-bold mb-6">{title}</h1>
      <p className="text-gray-600 mb-8">{description}</p>

      <div className="bg-white p-6 rounded-lg shadow-sm">{children}</div>
      {isAnswerVisible && (
        <p className="text-purple-600 p-2 bg-black">
          The correct answers are : {firstAnswer} + {secondAnswer}
        </p>
      )}

      {/* 
  We pass our logic functions as props to QuestionActions.
  QuestionActions will then pass them to the useQuestionActions hook.
*/}

      <QuestionActions
        onShowAnswer={showTheAnswer}
        onLoadNew={loadNewSituationQuestion}
      />
    </main>
  );
}
