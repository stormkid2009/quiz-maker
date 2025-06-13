// Helper function to get the correct answer from a question
const indexOfAnswer = {
  a: 0,
  b: 1,
  c: 2,
  d: 3,
  e: 4,
} as const;

type AnswerKey = keyof typeof indexOfAnswer;

interface Question {
  id?: string | number;
  options: string[];
  rightAnswer?: AnswerKey | AnswerKey[];
  answer?: AnswerKey | AnswerKey[];
}

export const getCorrectAnswer = (question: Question): string[] => {
  // Try different possible property names for the correct answer
  const possibleAnswerProps: (keyof Question)[] = ["rightAnswer", "answer"];

  for (const prop of possibleAnswerProps) {
    const answerValue = question[prop];
    if (answerValue !== undefined && answerValue !== null) {
      // Ensure it's always an array
      const answerKeys = Array.isArray(answerValue) ? answerValue : [answerValue];
      
      // Map answer keys to actual answer strings from options
      const correctAnswers = answerKeys
        .map(key => {
          const index = indexOfAnswer[key as AnswerKey];
          return question.options[index];
        })
        .filter(answer => answer !== undefined); // Filter out invalid indices
      
      if (correctAnswers.length > 0) {
        return correctAnswers;
      }
    }
  }

  console.warn(`No correct answer found for question ${question.id}`, question);
  return [];
};

// Also provide default export for backward compatibility
export default getCorrectAnswer;
