import React from "react";
import { render, fireEvent } from "@testing-library/react";
import CompositionWrapper from "../composition-wrapper";

// Mock the Question component
jest.mock("@/components/inputs/question", () => ({
  __esModule: true,
  default: ({ question, onAnswerChange }: any) => (
    <div data-testid="question-component">
      <div data-testid="question-id">{question.id}</div>
      <div data-testid="question-content">{question.content}</div>
      <button onClick={() => onAnswerChange(question.id, ["test answer"])}>
        Submit Answer
      </button>
    </div>
  ),
}));

describe("CompositionWrapper", () => {
  const mockQuestion = {
    id: "comp1",
    content: "Write about your favorite topic",
    type: "OPEN_ENDED",
  };

  it("renders Question component with correct props", () => {
    const { getByTestId } = render(
      <CompositionWrapper question={mockQuestion} />
    );
    expect(getByTestId("question-component")).toBeInTheDocument();
    expect(getByTestId("question-id")).toHaveTextContent("comp1");
    expect(getByTestId("question-content")).toHaveTextContent(
      "Write about your favorite topic"
    );
  });
});
