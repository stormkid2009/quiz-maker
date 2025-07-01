import React from "react";
import { render } from "@testing-library/react";
import QuizContainer from "../quiz-container";

const useQuizData = require("@/hooks/use-quiz-data").useQuizData;
import * as quizSubmissionModule from "@/hooks/use-quiz-submission";
jest.mock("@/hooks/use-quiz-data");
jest.mock("@/hooks/use-quiz-answers", () => ({
  useQuizAnswers: () => ({
    answers: {},
    questionStatus: { q1: false },
    completedCount: 0,
    handleAnswerChange: jest.fn(),
  }),
}));
jest.mock("@/hooks/use-quiz-scoring", () => ({
  useQuizScoring: () => ({
    calculateScore: () => 100,
  }),
}));
jest.mock("@/hooks/use-question-navigation", () => ({
  useQuestionNavigation: () => ({
    currentQuestionIndex: 0,
    handlePrevious: jest.fn(),
    handleNext: jest.fn(),
    isFirstQuestion: true,
    isLastQuestion: true,
  }),
}));
jest.mock("@/hooks/use-quiz-submission", () => ({
  useQuizSubmission: jest.fn(() => ({
    submitted: false,
    score: null,
    handleSubmit: jest.fn(),
  })),
}));

describe("QuizContainer", () => {
  it("renders loading spinner", () => {
    useQuizData.mockReturnValue({
      loading: true,
      quiz: null,
      error: null,
      refetch: jest.fn(),
      totalQuestions: 0,
    });
    const { container } = render(<QuizContainer />);
    expect(container.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("renders error message and retry button", () => {
    useQuizData.mockReturnValue({
      loading: false,
      quiz: null,
      error: "Error!",
      refetch: jest.fn(),
      totalQuestions: 0,
    });
    const { getByText } = render(<QuizContainer />);
    expect(getByText("Error")).toBeInTheDocument();
    expect(getByText("Error!")).toBeInTheDocument();
    expect(getByText("Try Again")).toBeInTheDocument();
  });

  it("renders no quiz data message", () => {
    useQuizData.mockReturnValue({
      loading: false,
      quiz: null,
      error: null,
      refetch: jest.fn(),
      totalQuestions: 0,
    });
    const { getByText } = render(<QuizContainer />);
    expect(getByText("No quiz data available.")).toBeInTheDocument();
  });

  it("renders active quiz UI", () => {
    useQuizData.mockReturnValue({
      quiz: {
        questions: [
          { id: "q1", type: "MCQ", content: "Q1", options: ["A", "B"] },
        ],
      },
      loading: false,
      error: null,
      refetch: jest.fn(),
      totalQuestions: 1,
    });
    const { getByText } = render(<QuizContainer />);
    expect(getByText("Question 1")).toBeInTheDocument();
    expect(getByText("Q1")).toBeInTheDocument();
    expect(getByText("Previous")).toBeInTheDocument();
    expect(getByText("Submit Quiz")).toBeInTheDocument();
  });

  it("renders result screen when submitted", () => {
    useQuizData.mockReturnValue({
      quiz: {
        questions: [
          { id: "q1", type: "MCQ", content: "Q1", options: ["A", "B"] },
        ],
      },
      loading: false,
      error: null,
      refetch: jest.fn(),
      totalQuestions: 1,
    });
    quizSubmissionModule.useQuizSubmission.mockImplementationOnce(() => ({
      submitted: true,
      score: 80,
      handleSubmit: jest.fn(),
    }));
    const { getByText, getAllByText } = render(<QuizContainer />);
    expect(getByText("Quiz Completed")).toBeInTheDocument();
    expect(
      getAllByText((content, node) => {
        const text = node.textContent || "";
        return (
          text.includes("Score:") && text.includes("80") && text.includes("%")
        );
      }).length
    ).toBeGreaterThan(0);
    expect(getByText("Take Another Quiz")).toBeInTheDocument();
  });
});
