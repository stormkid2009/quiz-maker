"use client";

import React from "react";
import { useQuestionActions } from "@/hooks/use-question-actions";

/**
 * Props for the QuestionActions component, which provides action buttons for quiz questions.
 *
 * @interface QuestionActionsProps
 * @property {string} [loadButtonText="Load Another Question"] - Text for the load new question button.
 * @property {() => void} [onShowAnswer] - Callback invoked when the Show Answer button is clicked.
 * @property {() => void} [onLoadNew] - Callback invoked when the Load Another Question button is clicked.
 * @property {string} [customEventName] - Custom event name to dispatch on actions.
 */
interface QuestionActionsProps {
  loadButtonText?: string;
  onShowAnswer?: () => void;
  onLoadNew?: () => void;
  customEventName?: string;
}

/**
 * QuestionActions component renders buttons for showing answers and loading new questions.
 *
 * @param {QuestionActionsProps} props - Configuration for button texts and callbacks.
 * @returns {JSX.Element} The rendered action buttons.
 */
export default function QuestionActions({
  loadButtonText = "Load Another Question",
  onShowAnswer,
  onLoadNew,
  customEventName,
}: QuestionActionsProps) {
  const { handleShowAnswer, handleLoadNew } = useQuestionActions({
    onShowAnswer,
    onLoadNew,
    customEventName,
  });

  return (
    <div className="mt-8 text-center space-x-4">
      <button
        onClick={handleShowAnswer}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
      >
        Show Answer
      </button>
      <button
        onClick={handleLoadNew}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        {loadButtonText}
      </button>
    </div>
  );
}
