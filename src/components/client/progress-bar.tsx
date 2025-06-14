"use client";

import React from "react";

interface ProgressBarProps {
  current: number;
  total: number;
  percentage?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  current, 
  total, 
  percentage = true 
}) => {
  const progress = Math.min(Math.max(0, (current / total) * 100), 100);
  
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
