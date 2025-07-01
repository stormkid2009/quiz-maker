import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { useQuizContainer } from "../use-quiz-container";

// Mock all sub-hooks
jest.mock("../use-quiz-data", () => ({
  useQuizData: () => ({
    quiz: { id: "quiz1", questions: [{ id: "q1" }, { id: "q2" }] },
    loading: false,
    error: null,
    refetch: jest.fn(),
    totalQuestions: 2,
  }),
}));
jest.mock("../use-quiz-answers", () => ({
  useQuizAnswers: () => ({
    answers: { q1: ["a"] },
    questionStatus: { q1: true, q2: false },
    completedCount: 1,
    handleAnswerChange: jest.fn(),
  }),
}));
jest.mock("../use-quiz-scoring", () => ({
  useQuizScoring: () => ({
    calculateScore: () => 100,
  }),
}));
jest.mock("../use-question-navigation", () => ({
  useQuestionNavigation: () => ({
    currentQuestionIndex: 0,
    handlePrevious: jest.fn(),
    handleNext: jest.fn(),
    isFirstQuestion: true,
    isLastQuestion: false,
  }),
}));
jest.mock("../use-quiz-submission", () => ({
  useQuizSubmission: () => ({
    submitted: false,
    score: null,
    handleSubmit: jest.fn(),
  }),
}));

describe("useQuizContainer", () => {
  function TestComponent() {
    const state = useQuizContainer();
    return (
      <div>
        <span data-testid="quizId">{state.quiz?.id}</span>
        <span data-testid="loading">{state.loading ? "true" : "false"}</span>
        <span data-testid="error">{state.error || ""}</span>
        <span data-testid="totalQuestions">{state.totalQuestions}</span>
        <span data-testid="completedCount">{state.completedCount}</span>
        <span data-testid="currentQuestionIndex">
          {state.currentQuestionIndex}
        </span>
        <span data-testid="progressPercentage">{state.progressPercentage}</span>
        <span data-testid="submitted">
          {state.submitted ? "true" : "false"}
        </span>
        <span data-testid="score">
          {state.score === null ? "" : state.score}
        </span>
        <button onClick={() => state.handleAnswerChange("q2", ["b"])}>
          Answer Q2
        </button>
        <button onClick={state.handleNext}>Next</button>
        <button onClick={state.handlePrevious}>Previous</button>
        <button onClick={state.handleSubmit}>Submit</button>
      </div>
    );
  }

  it("returns initial state and handles actions", () => {
    const { getByTestId, getByText } = render(<TestComponent />);
    expect(getByTestId("quizId").textContent).toBe("quiz1");
    expect(getByTestId("loading").textContent).toBe("false");
    expect(getByTestId("error").textContent).toBe("");
    expect(getByTestId("totalQuestions").textContent).toBe("2");
    expect(getByTestId("completedCount").textContent).toBe("1");
    expect(getByTestId("currentQuestionIndex").textContent).toBe("0");
    expect(getByTestId("progressPercentage").textContent).toBe("50");
    expect(getByTestId("submitted").textContent).toBe("false");
    expect(getByTestId("score").textContent).toBe("");

    // Simulate answering, navigation, and submission
    fireEvent.click(getByText("Answer Q2"));
    fireEvent.click(getByText("Next"));
    fireEvent.click(getByText("Previous"));
    fireEvent.click(getByText("Submit"));
    // No assertion for these as handlers are mocked, but no error should occur
  });
});
