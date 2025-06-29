"use client";

// client component wrapper for grammaire question in home training page
import React from "react";
import Question from "@/components/inputs/question";
import { MCQQuestion } from "@/shared/schemas/mcq";

const GrammaireWrapper = ({ question }: { question: MCQQuestion }) => {
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
