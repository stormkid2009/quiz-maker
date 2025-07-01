"use client";

import React from "react";

/**
 * Props for the ProgressBar component.
 *
 * @interface ProgressBarProps
 * @property {number} current - The current question index (1-based).
 * @property {number} total - The total number of questions.
 * @property {boolean} [percentage=true] - Whether to show the percentage text.
 */
interface ProgressBarProps {
  current: number;
  total: number;
  percentage?: boolean;
}

/**
 * ProgressBar component displays a visual progress bar and optional percentage text.
 *
 * @param {ProgressBarProps} props - Props for progress calculation and display.
 * @returns {JSX.Element} The rendered progress bar.
 */
const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  percentage = true,
}) => {
  const progress =
    total > 0 ? Math.min(Math.max(0, (current / total) * 100), 100) : 0;

  return (
    <div className="w-full mb-4">
      <div className="flex justify-between mb-1 text-sm">
        <span className="font-medium text-gray-700">
          Question {current} of {total}
        </span>
        {percentage && (
          <span className="text-blue-600 font-medium">
            {Math.round(progress)}%
          </span>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
