"use client";

// client component wrapper for passage question in home training page
import React from "react";
import Question from "@/components/inputs/question";
import { ReadingComprehensionQuestion } from "@/shared/schemas/rc";

/**
 * Component wrapper for passage (reading comprehension) questions on the training page.
 *
 * @param {{ question: ReadingComprehensionQuestion }} props - Props containing the question data.
 * @param {ReadingComprehensionQuestion} props.question - The passage question object.
 * @returns {JSX.Element} The rendered PassageWrapper component.
 */
const PassageWrapper = ({
  question,
}: {
  question: ReadingComprehensionQuestion;
}) => {
  /**
   * Callback invoked when the question's answers change.
   *
   * @param {string} questionId - Identifier of the question.
   * @param {string[]} answers - Array of selected answer strings.
   */
  const handleAnswerChange = (questionId: string, answers: string[]) => {
    // Handle answer changes here
    //console.log(`Question ${questionId} answers changed to:`, answers);
    // You can add your logic here, such as:
    // - Storing answers in local state
    // - Sending to a parent component via context
    // - Making API calls
    // - Updating global state
  };

  return <Question question={question} onAnswerChange={handleAnswerChange} />;
};

export default PassageWrapper;
