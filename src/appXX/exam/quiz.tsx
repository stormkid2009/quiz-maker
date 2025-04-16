'use client';
// Modified version of your CompositionClient component with logging

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useExamContext } from 'src/app/exam-context';
import { CompositionQuestion } from 'src/types/questions';

interface CompositionClientProps {
  questionData: CompositionQuestion & { _id?: string };
}

export default function CompositionClient({ questionData }: CompositionClientProps) {
  const router = useRouter();
  const { addQuestion } = useExamContext();
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  
  // Add this effect to log the data when the component renders
  useEffect(() => {
    console.log('Composition Question Data:', questionData);
  }, [questionData]);
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    router.refresh();
    setIsRefreshing(false);
  };
  
  const handleAddToExam = () => {
    if (questionData && questionData._id) {
      addQuestion({
        _id: questionData._id,
        type: questionData.type,
        content: questionData.content,
      });
      console.log('Added question to exam:', questionData);
    }else {
    console.log('questionData is undefined or missing _id');
  };
  };
  
  return (
    <div className="composition-container">
      <div className="mb-6">
        {questionData && questionData.content && (
          <p className="text-gray-600 mb-6">{questionData.content}</p>
        )}

        {questionData && questionData.elements && questionData.elements.length > 0 && (
          <div className="mb-6">
            <p className="font-medium text-gray-700 mb-2">Elements to include:</p>
            <ul className="space-y-2">
              {questionData.elements.map((element, index) => (
                <li
                  key={index}
                  className="bg-gray-50 p-3 rounded border border-gray-200 hover:bg-gray-100 transition-colors"
                >
                  {element}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      <div className="flex justify-end mt-4 space-x-2">
        <button 
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="px-4 py-2 bg-gray-50 text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors disabled:opacity-50"
        >
          {isRefreshing ? 'Loading...' : 'Refresh Question'}
        </button>
        
        <button 
          onClick={handleAddToExam}
          className="px-4 py-2 bg-green-50 text-green-700 rounded-lg border border-green-200 hover:bg-green-100 transition-colors"
        >
          Add to Exam
        </button>
      </div>
    </div>
  );
}
