"use client";

import React from "react";
import Answer from "./answer";
import { Question as QuestionType } from "@/shared/schemas/question";
import { MCQQuestion } from "@/shared/schemas/mcq";
import { QuestionTypes } from "@/shared/schemas/base-question";
import { ReadingComprehensionQuestion } from "@/shared/schemas/rc";

/**
 * Props for the Question component, representing the question data and answer callback.
 *
 * @interface QuestionProps
 * @property {QuestionType} question - The question object (MCQ, multi-MCQ, or RC).
 * @property {(questionId: string, answers: string[]) => void} onAnswerChange - Callback invoked when answers change.
 */
interface QuestionProps {
  question: QuestionType;
  onAnswerChange: (questionId: string, answers: string[]) => void;
}

/**
 * Question component renders various question types and handles answer updates.
 *
 * @param {QuestionProps} props - Props including question data and answer change handler.
 * @returns {JSX.Element} The rendered question input UI.
 */
const Question: React.FC<QuestionProps> = ({ question, onAnswerChange }) => {
  const [selectedAnswers, setSelectedAnswers] = React.useState<
    Record<string, string[]>
  >({});

  /**
   * Handles toggling a single-choice option for MCQ questions.
   *
   * @param {boolean} checked - Whether the option is selected.
   * @param {number} index - Index of the option in the options array.
   * @returns {void}
   */
  const handleMCQAnswerToggle = React.useCallback(
    (checked: boolean, index: number) => {
      const mcqQuestion = question as MCQQuestion;
      const selectedOption = mcqQuestion.options[index];
      const newAnswers = checked ? [selectedOption] : [];

      setSelectedAnswers({ ...selectedAnswers, [mcqQuestion.id]: newAnswers });
      onAnswerChange(mcqQuestion.id, newAnswers);
    },
    [question, selectedAnswers, onAnswerChange]
  );

  /**
   * Handles toggling options for multiple-select MCQ questions.
   *
   * @param {boolean} checked - Whether the option is selected.
   * @param {number} index - Index of the option in the options array.
   * @returns {void}
   */
  const handleMultiMCQAnswerToggle = React.useCallback(
    (checked: boolean, index: number) => {
      const multiMcqQuestion = question as { id: string; options: string[] };
      const selectedOption = multiMcqQuestion.options[index];
      let currentAnswers = selectedAnswers[multiMcqQuestion.id] || [];

      let newAnswers: string[];
      if (checked) {
        newAnswers = [...currentAnswers, selectedOption];
      } else {
        newAnswers = currentAnswers.filter(
          (answer) => answer !== selectedOption
        );
      }

      setSelectedAnswers({
        ...selectedAnswers,
        [multiMcqQuestion.id]: newAnswers,
      });
      onAnswerChange(multiMcqQuestion.id, newAnswers);
    },
    [question, selectedAnswers, onAnswerChange]
  );

  /**
   * Handles answer changes for reading comprehension questions.
   *
   * @param {boolean} checked - Whether the option is selected.
   * @param {string} option - The selected option.
   * @param {number} subQuestionIndex - Index of the sub-question.
   * @returns {void}
   */
  const handleRCAnswerToggle = React.useCallback(
    (checked: boolean, option: string, subQuestionIndex: number) => {
      const rcQuestion = question as ReadingComprehensionQuestion;
      const subQuestionId = `${rcQuestion.id}-${subQuestionIndex}`;
      const newAnswers = checked ? [option] : [];

      setSelectedAnswers({ ...selectedAnswers, [subQuestionId]: newAnswers });
      onAnswerChange(subQuestionId, newAnswers);
    },
    [question, selectedAnswers, onAnswerChange]
  );

  // Force TypeScript to recognize the type property
  const questionType = question.type as string;

  // Render based on question type
  if (questionType === QuestionTypes.OPEN_ENDED) {
    const openEndedQuestion = question as { id: string; content: string };
    return (
      <div className="question open-ended">
        <h3 className="text-lg font-medium mb-2">
          {openEndedQuestion.content}
        </h3>
        <textarea
          className="w-full p-2 border border-gray-300 rounded"
          rows={5}
          placeholder="Type your answer here..."
          onChange={(e) =>
            onAnswerChange(openEndedQuestion.id, [e.target.value])
          }
        />
      </div>
    );
  }

  if (questionType === QuestionTypes.RC) {
    const rcQuestion = question as ReadingComprehensionQuestion;
    return (
      <div className="question reading-comprehension">
        <div className="mb-4 p-4 bg-gray-50 rounded">
          <h3 className="text-lg font-medium mb-2">Reading Passage</h3>
          <p className="whitespace-pre-line">{rcQuestion.passage}</p>
        </div>
        <div className="space-y-4">
          {rcQuestion.relatedQuestions.map((subQuestion, qIndex) => (
            <div key={qIndex} className="p-4 border border-gray-200 rounded">
              <p className="mb-2">{subQuestion.content}</p>
              <div className="space-y-2">
                {subQuestion.options.map((option, oIndex) => {
                  const subQuestionId = `${rcQuestion.id}-${qIndex}`;
                  const isChecked = (
                    selectedAnswers[subQuestionId] || []
                  ).includes(option);

                  return (
                    <Answer
                      key={oIndex}
                      index={oIndex}
                      content={option}
                      checked={isChecked}
                      onToggle={(checked) => {
                        handleRCAnswerToggle(checked, option, qIndex);
                      }}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (questionType === QuestionTypes.MCQ) {
    const mcqQuestion = question as MCQQuestion;
    return (
      <div className="question mcq">
        <h3 className="text-lg font-medium mb-2">{mcqQuestion.content}</h3>
        <div className="space-y-2">
          {mcqQuestion.options.map((option, index) => {
            const isChecked = (selectedAnswers[mcqQuestion.id] || []).includes(
              option
            );

            return (
              <Answer
                key={index}
                index={index}
                content={option}
                checked={isChecked}
                onToggle={handleMCQAnswerToggle}
              />
            );
          })}
        </div>
      </div>
    );
  }

  if (questionType === QuestionTypes.MULTI_MCQ) {
    const multiMcqQuestion = question as {
      id: string;
      content: string;
      options: string[];
    };
    return (
      <div className="question multi-mcq">
        <h3 className="text-lg font-medium mb-2">{multiMcqQuestion.content}</h3>
        <div className="space-y-2">
          {multiMcqQuestion.options.map((option, index) => {
            const isChecked = (
              selectedAnswers[multiMcqQuestion.id] || []
            ).includes(option);

            return (
              <Answer
                key={index}
                index={index}
                content={option}
                checked={isChecked}
                onToggle={handleMultiMCQAnswerToggle}
              />
            );
          })}
        </div>
      </div>
    );
  }

  // Fallback for unknown question types
  return (
    <div className="question unknown-type">
      <p className="text-red-500">Unknown question type: {questionType}</p>
    </div>
  );
};

Question.displayName = "Question";

export default Question;
