// src/types/questions.ts

// Define all available question types
export const QuestionTypes = {
  MCQ: 'MCQ',
  MULTI_MCQ: 'Multi-MCQ',
  OPEN_ENDED: 'Open-Ended',
  RC: 'RC' // Reading Comprehension
} as const;

export type QuestionType = typeof QuestionTypes[keyof typeof QuestionTypes];

// Base type for all questions with common properties
export interface BaseQuestion {
  id?: string;
  content: string;
  type: QuestionType;
  createdAt?: Date;
  updatedAt?: Date;
}

// MCQ Question type (Grammar questions)
export interface MCQQuestion extends BaseQuestion {
  type: typeof QuestionTypes.MCQ;
  options: string[]; // Array of possible answers
  rightAnswer: string[]; // Array with one correct answer
}

// Multi-select MCQ Question type (Situation questions)
export interface MultiMCQQuestion extends BaseQuestion {
  type: typeof QuestionTypes.MULTI_MCQ;
  options: string[]; // Array of possible answers
  rightAnswer: string[]; // Array with multiple correct answers
}

// Open-ended Question type (Composition questions)
export interface OpenEndedQuestion extends BaseQuestion {
  type: typeof QuestionTypes.OPEN_ENDED;
  elements: string[]; // Required elements to include in the answer
  answer: string; // Sample or user answer
}

// Question related to a reading passage
export interface PassageRelatedQuestion extends BaseQuestion {
  options: string[]; // Array of possible answers
  rightAnswer: string[]; // Correct answer(s)
}

// Reading Comprehension Question type with passage and related questions
export interface ReadingComprehensionQuestion extends BaseQuestion {
  type: typeof QuestionTypes.RC;
  passage: string; // The reading comprehension text
  relatedQuestions: PassageRelatedQuestion[]; // Questions about the passage
}

// Union type that represents any valid question
export type Question = 
  | MCQQuestion 
  | MultiMCQQuestion 
  | OpenEndedQuestion 
  | ReadingComprehensionQuestion;

// Type guards for question types (helper functions)
export const isMCQQuestion = (question: Question): question is MCQQuestion => 
  question.type === QuestionTypes.MCQ;

export const isMultiMCQQuestion = (question: Question): question is MultiMCQQuestion => 
  question.type === QuestionTypes.MULTI_MCQ;

export const isOpenEndedQuestion = (question: Question): question is OpenEndedQuestion => 
  question.type === QuestionTypes.OPEN_ENDED;

export const isReadingComprehensionQuestion = (question: Question): question is ReadingComprehensionQuestion => 
  question.type === QuestionTypes.RC;
