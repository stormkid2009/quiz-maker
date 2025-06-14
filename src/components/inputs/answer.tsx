"use client";

import React from "react";

interface AnswerOption {
  index: number;
  content: string;
  checked: boolean;
  onToggle: (newChecked: boolean, index: number) => void;
}

const Answer: React.FC<AnswerOption> = React.memo(
  ({ index, content, checked, onToggle }) => {
    const handleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onToggle(e.target.checked, index);
      },
      [onToggle, index]
    );

    return (
      <div className="answer-option">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={checked}
            onChange={handleChange}
            className="form-checkbox"
          />
          <span>{content}</span>
        </label>
      </div>
    );
  }
);

Answer.displayName = "Answer";

export default Answer;
