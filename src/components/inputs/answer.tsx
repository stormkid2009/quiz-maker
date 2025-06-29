"use client";

import React from "react";

/**
 * Props for the Answer component, representing a single answer option.
 *
 * @interface AnswerOption
 * @property {number} index - Index of the option.
 * @property {string} content - The text content of the option.
 * @property {boolean} checked - Whether the option is currently selected.
 * @property {(newChecked: boolean, index: number) => void} onToggle - Callback invoked when the option is toggled.
 */
interface AnswerOption {
  index: number;
  content: string;
  checked: boolean;
  onToggle: (newChecked: boolean, index: number) => void;
}

/**
 * Answer component renders a memoized checkbox option for a question.
 *
 * @param {AnswerOption} props - Props for the answer option.
 * @returns {JSX.Element} The rendered answer option element.
 */
const Answer: React.FC<AnswerOption> = React.memo(
  ({ index, content, checked, onToggle }) => {
    /**
     * Handles change events for the checkbox input.
     *
     * @param {React.ChangeEvent<HTMLInputElement>} e - The change event.
     * @returns {void}
     */
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
