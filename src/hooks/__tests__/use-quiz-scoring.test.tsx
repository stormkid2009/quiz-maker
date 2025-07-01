import React from "react";
import { render } from "@testing-library/react";
import { useQuizScoring } from "../use-quiz-scoring";
import { QuestionTypes } from "@/shared/schemas/base-question";

describe("useQuizScoring", () => {
  // Mock MCQ question
  const mcqQuestion = {
    id: "q1",
    type: QuestionTypes.MCQ,
    options: ["A", "B", "C"],
    answer: ["b"],
  };

  // Mock Multi-MCQ question
  const multiMcqQuestion = {
    id: "q2",
    type: QuestionTypes.MULTI_MCQ,
    options: ["X", "Y", "Z"],
    answer: ["a", "c"],
  };

  // Mock RC question with sub-questions
  const rcQuestion = {
    id: "q3",
    type: QuestionTypes.RC,
    relatedQuestions: [
      {
        id: "q3-0",
        type: QuestionTypes.MCQ,
        options: ["True", "False"],
        answer: ["a"],
      },
      {
        id: "q3-1",
        type: QuestionTypes.MCQ,
        options: ["Yes", "No"],
        answer: ["b"],
      },
    ],
  };

  const quiz = {
    id: "quiz1",
    title: "Test Quiz",
    questions: [mcqQuestion, multiMcqQuestion, rcQuestion],
  };

  function TestComponent({ quiz, answers }: any) {
    const { calculateScore } = useQuizScoring({ quiz, answers });
    return <span data-testid="score">{calculateScore()}</span>;
  }

  it("returns 0 if no quiz is provided", () => {
    const { getByTestId } = render(<TestComponent quiz={null} answers={{}} />);
    expect(getByTestId("score").textContent).toBe("0");
  });

  it("scores MCQ, Multi-MCQ, and RC questions correctly", () => {
    // All correct answers
    const answers = {
      q1: ["1"], // B
      q2: ["0", "2"], // X, Z
      "q3-0": ["0"], // True
      "q3-1": ["1"], // No
    };
    const { getByTestId } = render(
      <TestComponent quiz={quiz} answers={answers} />
    );
    expect(getByTestId("score").textContent).toBe("100");
  });

  it("scores partially correct answers", () => {
    // Only MCQ is correct
    const answers = {
      q1: ["1"], // B
      q2: ["1", "2"], // Y, Z (only Z is correct)
      "q3-0": ["1"], // False (wrong)
      "q3-1": ["1"], // No (correct)
    };
    const { getByTestId } = render(
      <TestComponent quiz={quiz} answers={answers} />
    );
    // 2/4 correct = 50
    expect(getByTestId("score").textContent).toBe("50");
  });

  it("returns 0 if all answers are wrong", () => {
    const answers = {
      q1: ["0"], // A
      q2: ["1"], // Y
      "q3-0": ["1"], // False
      "q3-1": ["0"], // Yes
    };
    const { getByTestId } = render(
      <TestComponent quiz={quiz} answers={answers} />
    );
    expect(getByTestId("score").textContent).toBe("0");
  });
});
