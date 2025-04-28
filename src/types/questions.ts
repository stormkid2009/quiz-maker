// src/types/questions.ts
export const QuestionTypes = {
    MCQ: 'MCQ',
    MULTI_MCQ: 'Multi-MCQ',
    OPEN_ENDED: 'Open-Ended',
    RC:"RC"      //Reading Comprehension
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
    options: string[]; //array of possible answers
    rightAnswer: string[]// array of one correct answerf
  }
 // Multi-select MCQ Question type (Situation Questions) 
  export interface MultiMCQQuestion extends BaseQuestion {
    type: typeof QuestionTypes.MULTI_MCQ;
    options: string[]; // array of possible answers 
    rightAnswer: string[]; // array with multiple correct answers
  }
 // Open-Ended Question type (Composition Questions) 
  export interface OpenEndedQuestion extends BaseQuestion {
    type: typeof QuestionTypes.OPEN_ENDED;
    elements: string[];
    answer: string;
  }
  
  // Now, let's properly extend BaseQuestion for our passage-related questions
  export interface PassageRelatedQuestion extends BaseQuestion {
   type: typeof QuestionTypes.MCQ; 
  options:string[]; // array of possible answers
  rightAnswer:string[]; // correct answer
  }


// Reading comprehension Question type with passage and related questions
 export interface ReadingComprehensionQuestion extends BaseQuestion {
    type: typeof QuestionTypes.RC;
    passage: string;  // The reading comprehension text
    relatedQuestions: PassageRelatedQuestion[];  // Array of questions about the passage
  }

  export type Question = 
| MCQQuestion 
| MultiMCQQuestion 
| OpenEndedQuestion 
| ReadingComprehensionQuestion;
