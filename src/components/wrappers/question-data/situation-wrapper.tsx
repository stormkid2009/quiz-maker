"use client";

// client component wrapper for situation question in home training page
import React from "react";
import Question from "@/components/inputs/question";

/**
 * Component wrapper for situation questions on the training page.
 *
 * @param {{ question: any }} props - Props containing the question data.
 * @param {any} props.question - The situation question object.
 * @returns {JSX.Element} The rendered SituationWrapper component.
 */
const SituationWrapper = ({ question }: { question: any }) => {
  /**
   * Callback invoked when the question's answers change.
   *
   * @param {string} questionId - Identifier of the question.
   * @param {string[]} answers - Array of selected answer strings.
   * @returns {void}
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

export default SituationWrapper;
