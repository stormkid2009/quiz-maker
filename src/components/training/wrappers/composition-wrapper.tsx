"use client";

import React from "react";
import Question from "@/components/inputs/question";

const CompositionWrapper = ({ question }: { question: any }) => {
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

export default CompositionWrapper;
