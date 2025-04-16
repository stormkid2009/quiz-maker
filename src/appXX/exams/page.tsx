'use client';
// app/components/exam-builder.tsx

import React, { useState } from 'react';
import { QuestionTypes } from 'src/types/questions';
import { ExamProvider } from 'src/pages/context';

// The server components now handle passing data to their respective client components
import Composition from 'src/components/exams/server/composition';
// import Grammaire from './grammaire';
// import Situation from './situation';
// import Passage from './passage';

// Define the structure for our question sections
const QUESTION_SECTIONS = [
  { 
    id: "composition", 
    title: "Composition Questions", 
    type: QuestionTypes.OPEN_ENDED,
    description: "Open-ended writing questions using provided elements",
    component: Composition
  },
  // Add other sections similarly
];

export function ExamBuilder() {
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  
  // Count questions by type
  const questionCounts = {};
  Object.values(QuestionTypes).forEach(type => {
    questionCounts[type] = selectedQuestions.filter(q => q.type === type).length;
  });
  
  // Total count
  const totalCount = selectedQuestions.length;
  
  const contextValue = {
    selectedQuestions,
    addQuestion: (question) => {
      setSelectedQuestions(prev => [...prev, question]);
    },
    removeQuestion: (id) => {
      setSelectedQuestions(prev => prev.filter(q => q.id !== id));
    },
    clearAllQuestions: () => {
      setSelectedQuestions([]);
    }
  };
  
  return (
    <ExamProvider value={contextValue}>
      <div className="container mx-auto px-4 py-8 mb-20">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Build Your Exam</h1>
          <p className="text-gray-600">
            Select questions from each category to create a custom exam
          </p>
        </header>

        {/* Question Type Navigation */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          {QUESTION_SECTIONS.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="px-4 py-2 bg-blue-50 rounded-lg text-blue-700 font-medium whitespace-nowrap hover:bg-blue-100 transition-colors"
            >
              {section.title}
            </a>
          ))}
        </div>

        {/* Question Sections */}
        <div className="space-y-12">
          {QUESTION_SECTIONS.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-8">
              <div className="border-b border-gray-200 mb-6">
                <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                  {section.title}
                </h2>
                <p className="text-gray-500 mb-4 text-sm">
                  {section.description}
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow border border-gray-100 p-6">
                {/* The server component now passes data directly to its client component */}
                <section.component />
              </div>
            </section>
          ))}
        </div>

        {/* Selected Questions Summary */}
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 p-4 z-10">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <div>
                <span className="font-medium">Selected:</span> <span className="text-blue-600 font-medium">{totalCount}</span> questions
              </div>
              <div className="hidden md:flex space-x-2">
                {Object.entries(questionCounts).map(([type, count]) => (
                  <span key={type} className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                    {type}: {count}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => contextValue.clearAllQuestions()}
                className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                Clear All
              </button>
              <button 
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                onClick={() => {/* Navigate to review page */}}
              >
                Review & Finalize Exam
              </button>
            </div>
          </div>
        </div>
      </div>
    </ExamProvider>
  );
}

// Make sure to create a simple server component that renders this client component
export default function Exam() {
  return <ExamBuilder />;
}
