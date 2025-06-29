import { useCallback } from "react";
import { Quiz as QuizType } from "@/shared/schemas/quiz";
import { Question as QuestionType } from "@/shared/schemas/question";
import type { MCQQuestion } from "@/shared/schemas/mcq";
import type { MultiMCQuestion } from "@/shared/schemas/multi-mcq";
import { QuestionTypes } from "@/shared/schemas/base-question";
import { ReadingComprehensionQuestion } from "@/shared/schemas/rc";
import getCorrectAnswer from "@/utils/get-correct-answer";

/**
 * Props for the useQuizScoring hook.
 * @property {QuizType | null} quiz - The quiz data to score.
 * @property {Record<string, string[]>} answers - Map of question or sub-question IDs to selected answer indices.
 */
interface UseQuizScoringProps {
  quiz: QuizType | null;
  answers: Record<string, string[]>;
}

/**
 * React hook to calculate the score of a quiz based on provided answers.
 *
 * @param {UseQuizScoringProps} props - The quiz object and user answers.
 * @returns {{ calculateScore: () => number }} An object containing the score calculation function.
 */
export const useQuizScoring = ({ quiz, answers }: UseQuizScoringProps) => {
  const isMCQ = (q: QuestionType): q is MCQQuestion =>
    q.type === QuestionTypes.MCQ;
  const isMultiMCQ = (q: QuestionType): q is MultiMCQuestion =>
    q.type === QuestionTypes.MULTI_MCQ;

  const compareArrays = (arr1: string[], arr2: string[]): boolean => {
    if (!arr1 || !arr2) return false;
    if (arr1.length !== arr2.length) return false;

    const sorted1 = [...arr1].map(String).sort();
    const sorted2 = [...arr2].map(String).sort();

    const result = sorted1.every((val, idx) => val === sorted2[idx]);
    console.log(
      `    Comparing arrays: ${JSON.stringify(sorted1)} vs ${JSON.stringify(
        sorted2
      )} = ${result}`
    );
    return result;
  };

  /**
   * Compute the quiz score as a percentage of correctly answered questions.
   * Includes support for MCQ, Multi-MCQ, and RC sub-questions.
   * @returns {number} The calculated score percentage (0-100).
   */
  const calculateScore = useCallback(() => {
    if (!quiz) return 0;

    let totalQuestions = 0;
    let correctAnswers = 0;

    console.log("=== SCORE CALCULATION DEBUG ===");
    console.log("Current answers:", answers);

    quiz.questions.forEach((question) => {
      if (isMCQ(question) || isMultiMCQ(question)) {
        totalQuestions++;
        const userAnswerIndices = answers[question.id] || [];
        const rightAnswer = getCorrectAnswer(question);

        const userAnswerValues = userAnswerIndices.map((index) => {
          const idx = parseInt(index);
          return question.options[idx] || index;
        });

        console.log(`Question ${question.id}:`);
        console.log(`  User selected indices:`, userAnswerIndices);
        console.log(`  User actual values:`, userAnswerValues);
        console.log(`  Correct answer:`, rightAnswer);

        const isCorrect = compareArrays(userAnswerValues, rightAnswer);
        console.log(`  Is correct:`, isCorrect);

        if (isCorrect) {
          correctAnswers++;
        }
      } else if (question.type === QuestionTypes.RC) {
        const rcQuestion = question as ReadingComprehensionQuestion;
        rcQuestion.relatedQuestions.forEach((subQuestion, index) => {
          totalQuestions++;
          const subQuestionId = `${question.id}-${index}`;
          const userAnswerIndices = answers[subQuestionId] || [];
          const rightAnswer = getCorrectAnswer(subQuestion);

          const userAnswerValues = userAnswerIndices.map((index) => {
            const idx = parseInt(index);
            return subQuestion.options[idx] || index;
          });

          console.log(`RC Sub-question ${subQuestionId}:`);
          console.log(`  User selected indices:`, userAnswerIndices);
          console.log(`  User actual values:`, userAnswerValues);
          console.log(`  Correct answer:`, rightAnswer);

          const isCorrect = compareArrays(userAnswerValues, rightAnswer);
          console.log(`  Is correct:`, isCorrect);

          if (isCorrect) {
            correctAnswers++;
          }
        });
      }
    });

    console.log(`Total questions processed: ${totalQuestions}`);
    console.log(`Correct answers: ${correctAnswers}`);

    const calculatedScore =
      totalQuestions > 0
        ? Math.round((correctAnswers / totalQuestions) * 100)
        : 0;
    console.log(`Final score: ${calculatedScore}%`);

    return calculatedScore;
  }, [quiz, answers]);

  return {
    calculateScore,
  };
};
