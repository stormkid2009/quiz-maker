"use client";

// client component wrapper for grammaire question in home training page
import React from "react";
import Question from "@/components/inputs/question";
import { MCQQuestion } from "@/shared/schemas/mcq";

/**
 * Component wrapper for grammar (MCQ) questions on the training page.
 *
 * @param {{ question: MCQQuestion }} props - Component props.
 * @param {MCQQuestion} props.question - The MCQ question object to render.
 * @returns {JSX.Element} The rendered GrammaireWrapper component.
 */
const GrammaireWrapper = ({ question }: { question: MCQQuestion }) => {
  /**
   * Callback invoked when the question's answers change.
   *
   * @param {string} questionId - Identifier of the question.
   * @param {string[]} answers - Array of selected answer values or indices.
   * @returns {void}
   */
  const handleAnswerChange = (questionId: string, answers: string[]) => {
    // Handle answer changes here
    console.log(`Question ${questionId} answers changed to:`, answers);
    // You can add your logic here, such as:
    // - Storing answers in local state
    // - Sending to a parent component via context
    // - Making API calls
    // - Updating global state
  };

  return <Question question={question} onAnswerChange={handleAnswerChange} />;
};

export default GrammaireWrapper;
