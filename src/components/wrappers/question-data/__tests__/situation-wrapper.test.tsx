import React from "react";
import { render, fireEvent } from "@testing-library/react";
import SituationWrapper from "../situation-wrapper";

// Mock the Question component
jest.mock("@/components/inputs/question", () => ({
  __esModule: true,
  default: ({ question, onAnswerChange }: any) => (
    <div data-testid="question-component">
      <div data-testid="question-id">{question.id}</div>
      <div data-testid="question-content">{question.content}</div>
      <div data-testid="question-type">{question.type}</div>
      <div data-testid="situation-scenario">{question.scenario}</div>
      <button onClick={() => onAnswerChange(question.id, ["situation-answer"])}>
        Submit Answer
      </button>
    </div>
  ),
}));

describe("SituationWrapper", () => {
  const mockQuestion = {
    id: "situation1",
    content: "How would you respond in this situation?",
    type: "SITUATION",
    scenario:
      "You are in a restaurant and the waiter brings you the wrong order.",
    options: ["situation-answer", "option2", "option3", "option4"],
    correctAnswer: "situation-answer",
  };

  it("renders Question component with correct props", () => {
    const { getByTestId } = render(
      <SituationWrapper question={mockQuestion} />
    );
    expect(getByTestId("question-component")).toBeInTheDocument();
    expect(getByTestId("question-id")).toHaveTextContent("situation1");
    expect(getByTestId("question-content")).toHaveTextContent(
      "How would you respond in this situation?"
    );
    expect(getByTestId("question-type")).toHaveTextContent("SITUATION");
  });

  it("displays the situation scenario", () => {
    const { getByTestId } = render(
      <SituationWrapper question={mockQuestion} />
    );
    expect(getByTestId("situation-scenario")).toHaveTextContent(
      "You are in a restaurant and the waiter brings you the wrong order."
    );
  });

  it("passes situation question with scenario to Question component", () => {
    const { getByTestId } = render(
      <SituationWrapper question={mockQuestion} />
    );

    // Verify the component renders with situation specific properties
    expect(getByTestId("question-component")).toBeInTheDocument();
    expect(getByTestId("question-type")).toHaveTextContent("SITUATION");
    expect(getByTestId("situation-scenario")).toBeInTheDocument();
  });
});
