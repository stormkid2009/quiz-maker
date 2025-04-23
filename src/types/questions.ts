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
    content: string;
    type: QuestionType;
  }
  
  // Specialized interface for questions with options
  export interface OptionsQuestion extends BaseQuestion {
    options: string[];
  }
  
  // More specific question types with strict typing
  export interface GrammaireQuestion extends BaseQuestion {
    type: typeof QuestionTypes.MCQ;
    options: [string, string, string, string];
    rightAnswer: [string];
  }
  
  export interface SituationQuestion extends BaseQuestion {
    type: typeof QuestionTypes.MULTI_MCQ;
    options: [string, string, string, string, string];
    rightAnswer: [string, string];
  }
  
  export interface CompositionQuestion extends BaseQuestion {
    type: typeof QuestionTypes.OPEN_ENDED;
    elements: string[];
    answer: string;
  }
  
  // Now, let's properly extend BaseQuestion for our passage-related questions
  interface PassageRelatedQuestion extends GrammaireQuestion {
    
  }


// Now we can define the complete PassageQuestion structure
export interface PassageQuestion {
    type: typeof QuestionTypes.RC;
    passage: string;  // The reading comprehension text
    relatedQuestions: PassageRelatedQuestion[];  // Array of questions about the passage
  }
