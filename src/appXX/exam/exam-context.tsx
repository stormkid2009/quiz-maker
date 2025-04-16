'use client';
// app/context/index.tsx

import React, { createContext, useContext, ReactNode } from 'react';
import { BaseQuestion } from 'src/types/questions';

// add I need to add generic instead of Question type to make add question suitable for all kinds of questions
interface Question extends BaseQuestion {
  _id:string
}


interface ExamContextType {
  selectedQuestions: Question[];
  addQuestion: (question: Question) => void;
  removeQuestion: (id: string) => void;
  clearAllQuestions: () => void;
}

// Create context with default values
const ExamContext = createContext<ExamContextType>({
  selectedQuestions: [],
  addQuestion: () => {},
  removeQuestion: () => {},
  clearAllQuestions: () => {}
});

// Provider component
export function ExamProvider({ 
  children, 
  value 
}: { 
  children: ReactNode;
  value: ExamContextType;
}) {
  return (
    <ExamContext.Provider value={value}>
      {children}
    </ExamContext.Provider>
  );
}

// Hook for using the context
export function useExamContext() {
  const context = useContext(ExamContext);
  if (context === undefined) {
    throw new Error('useExamContext must be used within an ExamProvider');
  }
  return context;
}
