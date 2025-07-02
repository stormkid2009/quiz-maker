"use client";

// client component wrapper for composition question in question pages
import React from "react";
import Link from "next/link";
import { useState } from "react";
import QuestionActions from "@/components/buttons/question-actions";
import BackToQuestions from "@/components/buttons/back-to-questions";

/**
 * Props for the CompositionPageWrapper component.
 * @property {string} title - Title of the composition question page.
 * @property {string} description - Description or prompt for the composition.
 * @property {React.ReactNode} children - JSX content for rendering the composition question.
 * @property {string} answer - The correct answer to reveal.
 */
interface CompositionPageWrapperProps {
  title: string;
  description: string;
  children: React.ReactNode;
  answer: string;
}

/**
 * React client component wrapper for composition question pages.
 * Renders title, description, question content, answer reveal, and navigation actions.
 *
 * @param {CompositionPageWrapperProps} props - Component properties.
 * @returns {JSX.Element} The rendered page layout.
 */
export default function CompositionPageWrapper({
  title,
  description,
  children,
  answer,
}: CompositionPageWrapperProps) {
  const [isAnswerVisible, setIsAnswerVisible] = useState(false);

  /**
   * Reveal the correct answer by setting visibility flag.
   */
  const showTheAnswer = () => {
    //console.log("Setting answer to visible!");
    setIsAnswerVisible(true);
  };

  /**
   * Load a new composition question, resetting state or reloading the page.
   */
  const loadNewCompositionQuestion = () => {
    //console.log("Fetching a new composition question...");
    // In a real app, you'd fetch data here and reset state
    window.location.reload();
  };
  return (
    <main className="container mx-auto py-8 px-4">
      <BackToQuestions />
      <h1 className="text-3xl font-bold mb-6">{title}</h1>
      <p className="text-gray-600 mb-8">{description}</p>

      <div className="bg-white p-6 rounded-lg shadow-sm">{children}</div>
      {isAnswerVisible && (
        <p className="bg-black text-purple-600 p-2 ">
          This is the Answer : {answer}
        </p>
      )}

      {/* 
  We pass our logic functions as props to QuestionActions.
  QuestionActions will then pass them to the useQuestionActions hook.
*/}
      <QuestionActions
        onShowAnswer={showTheAnswer}
        onLoadNew={loadNewCompositionQuestion}
      />
    </main>
  );
}
