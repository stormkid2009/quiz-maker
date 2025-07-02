import React from "react";
import { render, screen } from "@testing-library/react";
import QuizPage from "./page";

jest.mock("@/components/quiz/quiz-container", () => () => <div data-testid="quiz-container" />);

describe("QuizPage", () => {
  it("renders the quiz page title and QuizContainer", () => {
    render(<QuizPage />);
    expect(screen.getByText("Quiz Challenge")).toBeInTheDocument();
    expect(screen.getByTestId("quiz-container")).toBeInTheDocument();
  });
}); 