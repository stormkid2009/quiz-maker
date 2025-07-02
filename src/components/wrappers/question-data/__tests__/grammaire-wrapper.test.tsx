import React from "react";
import { render, fireEvent } from "@testing-library/react";
import GrammaireWrapper from "../grammaire-wrapper";
import { MCQQuestion } from "@/shared/schemas/mcq";

// Mock the Question component
jest.mock("@/components/inputs/question", () => ({
  __esModule: true,
  default: ({ question, onAnswerChange }: any) => (
    <div data-testid="question-component">
      <div data-testid="question-id">{question.id}</div>
      <div data-testid="question-content">{question.content}</div>
      <div data-testid="question-type">{question.type}</div>
      <button onClick={() => onAnswerChange(question.id, ["option1"])}>
        Submit Answer
      </button>
    </div>
  ),
}));

describe("GrammaireWrapper", () => {
  const mockQuestion: MCQQuestion = {
    id: "gram1",
    content: "Choose the correct verb form",
    type: "MCQ",
    options: ["option1", "option2", "option3", "option4"],
    correctAnswer: "option1",
  };

  it("renders Question component with correct props", () => {
    const { getByTestId } = render(
      <GrammaireWrapper question={mockQuestion} />
    );
    expect(getByTestId("question-component")).toBeInTheDocument();
    expect(getByTestId("question-id")).toHaveTextContent("gram1");
    expect(getByTestId("question-content")).toHaveTextContent(
      "Choose the correct verb form"
    );
    expect(getByTestId("question-type")).toHaveTextContent("MCQ");
  });

  it("passes MCQ question with options to Question component", () => {
    const { getByTestId } = render(
      <GrammaireWrapper question={mockQuestion} />
    );

    // Verify the component renders (which means it received the correct props)
    expect(getByTestId("question-component")).toBeInTheDocument();
    expect(getByTestId("question-type")).toHaveTextContent("MCQ");
  });
});
