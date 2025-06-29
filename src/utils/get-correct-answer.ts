// Helper function to get the correct answer from a question
/**
 * Mapping of answer letter keys to their corresponding option indices.
 *
 * @constant {Record<string, number>}
 */
const indexOfAnswer = {
  a: 0,
  b: 1,
  c: 2,
  d: 3,
  e: 4,
} as const;

/**
 * Represents a quiz question with options and one or more correct answers identified by letter keys.
 *
 * @interface QuizQuestion
 * @property {string | number} [id] - Optional unique identifier for the question.
 * @property {string[]} options - List of possible answer options.
 * @property {string | string[]} [rightAnswer] - Letter key(s) representing the correct option(s).
 * @property {string | string[]} [answer] - Alternative field for the correct answer key(s).
 */
interface QuizQuestion {
  id?: string | number;
  options: string[];
  rightAnswer?: string | string[];
  answer?: string | string[];
}

/**
 * Retrieves the correct answer(s) for a given quiz question by mapping letter keys to option strings.
 *
 * @param {QuizQuestion} question - The quiz question object containing options and answer key(s).
 * @returns {string[]} Array of correct answer strings corresponding to the provided answer key(s).
 */
export const getCorrectAnswer = (question: QuizQuestion): string[] => {
  // Try different possible property names for the correct answer
  const possibleAnswerProps: (keyof QuizQuestion)[] = ["rightAnswer", "answer"];

  for (const prop of possibleAnswerProps) {
    const answerValue = question[prop];
    if (answerValue !== undefined && answerValue !== null) {
      // Ensure it's always an array
      const answerKeys = Array.isArray(answerValue)
        ? answerValue
        : [answerValue];

      // Map answer keys to actual answer strings from options
      const correctAnswers = answerKeys
        .map((key) => {
          const index = indexOfAnswer[key as keyof typeof indexOfAnswer];
          return question.options[index];
        })
        .filter((answer) => answer !== undefined); // Filter out invalid indices

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
