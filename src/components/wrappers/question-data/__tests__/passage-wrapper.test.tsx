import React from "react";
import { render, fireEvent } from "@testing-library/react";
import PassageWrapper from "../passage-wrapper";
import { ReadingComprehensionQuestion } from "@/shared/schemas/rc";

// Mock the Question component
jest.mock("@/components/inputs/question", () => ({
  __esModule: true,
  default: ({ question, onAnswerChange }: any) => (
    <div data-testid="question-component">
      <div data-testid="question-id">{question.id}</div>
      <div data-testid="question-content">{question.content}</div>
      <div data-testid="question-type">{question.type}</div>
      <div data-testid="passage-text">{question.passage}</div>
      <button onClick={() => onAnswerChange(question.id, ["answer1"])}>
        Submit Answer
      </button>
    </div>
  ),
}));

describe("PassageWrapper", () => {
  const mockQuestion: ReadingComprehensionQuestion = {
    id: "passage1",
    content: "What is the main idea of the passage?",
    type: "READING_COMPREHENSION",
    passage:
      "This is a sample passage for reading comprehension. It contains multiple sentences to test the reader's understanding.",
    options: ["answer1", "answer2", "answer3", "answer4"],
    correctAnswer: "answer1",
  };

  it("renders Question component with correct props", () => {
    const { getByTestId } = render(<PassageWrapper question={mockQuestion} />);
    expect(getByTestId("question-component")).toBeInTheDocument();
    expect(getByTestId("question-id")).toHaveTextContent("passage1");
    expect(getByTestId("question-content")).toHaveTextContent(
      "What is the main idea of the passage?"
    );
    expect(getByTestId("question-type")).toHaveTextContent(
      "READING_COMPREHENSION"
    );
  });

  it("displays the passage text", () => {
    const { getByTestId } = render(<PassageWrapper question={mockQuestion} />);
    expect(getByTestId("passage-text")).toHaveTextContent(
      "This is a sample passage for reading comprehension. It contains multiple sentences to test the reader's understanding."
    );
  });

  it("passes reading comprehension question with passage to Question component", () => {
    const { getByTestId } = render(<PassageWrapper question={mockQuestion} />);

    // Verify the component renders with reading comprehension specific properties
    expect(getByTestId("question-component")).toBeInTheDocument();
    expect(getByTestId("question-type")).toHaveTextContent(
      "READING_COMPREHENSION"
    );
    expect(getByTestId("passage-text")).toBeInTheDocument();
  });
});
