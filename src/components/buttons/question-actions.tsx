"use client";

import React from "react";

interface QuestionActionsProps {
  loadButtonText?: string;
  onShowAnswer?: () => void;
  onLoadNew?: () => void;
}

export default function QuestionActions({
  loadButtonText = "Load Another Question",
  onShowAnswer,
  onLoadNew,
}: QuestionActionsProps) {
  const handleShowAnswer = () => {
    if (onShowAnswer) {
      onShowAnswer();
    } else {
      // Default behavior: dispatch custom event
      window.dispatchEvent(new CustomEvent("showAnswer"));
    }
  };

  const handleLoadNew = () => {
    if (onLoadNew) {
      onLoadNew();
    } else {
      // Default behavior: reload page
      window.location.reload();
    }
  };

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
