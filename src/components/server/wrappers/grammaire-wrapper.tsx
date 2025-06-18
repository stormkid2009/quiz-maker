
"use client";


import React from "react";
import Question from "@/components/inputs/question";
import { MCQQuestion } from "@/shared/schemas/mcq";

const GrammaireWrapper = ({
  question,
  onAnswerChange,
}: {
  question: MCQQuestion;
  onAnswerChange: (questionId: string, answers: string[]) => void;
}) => {
  return <Question question={question} onAnswerChange={onAnswerChange} />;
};

export default GrammaireWrapper;
