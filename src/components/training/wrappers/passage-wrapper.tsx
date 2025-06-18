"use client";

import Question from "@/components/inputs/question";
import { ReadingComprehensionQuestion } from "@/shared/schemas/rc";

const PassageWrapper = ({
  question,
  onAnswerChange,
}: {
  question: ReadingComprehensionQuestion;
  onAnswerChange: (questionId: string, answers: string[]) => void;
}) => {
  return <Question question={question} onAnswerChange={onAnswerChange} />;
};

export default PassageWrapper;
