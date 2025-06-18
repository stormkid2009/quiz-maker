"use client";

import React from "react";
import Question from "@/components/inputs/question";

const CompositionWrapper = ({
  question,
  onAnswerChange,
}: {
  question: any;
  onAnswerChange: (questionId: string, answers: string[]) => void;
}) => {
  return <Question question={question} onAnswerChange={onAnswerChange} />;
};

export default CompositionWrapper;
