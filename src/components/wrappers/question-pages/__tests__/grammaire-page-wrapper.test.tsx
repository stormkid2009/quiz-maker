import React from "react";
import { render, fireEvent } from "@testing-library/react";
import GrammairePageWrapper from "../grammaire-page-wrapper";

// Mock the child components
jest.mock("@/components/buttons/back-to-questions", () => ({
  __esModule: true,
  default: () => <div data-testid="back-to-questions">Back to Questions</div>,
}));
jest.mock("@/components/buttons/question-actions", () => ({
  __esModule: true,
  default: ({ onShowAnswer, onLoadNew }: any) => (
    <div data-testid="question-actions">
      <button onClick={onShowAnswer}>Show Answer</button>
      <button onClick={onLoadNew}>Load New</button>
    </div>
  ),
}));

describe("GrammairePageWrapper", () => {
  const defaultProps = {
    title: "Test Grammar",
    description: "Test description",
    rightAnswer: "Test answer",
    children: <div data-testid="children">Question content</div>,
  };

  it("renders title, description, and children", () => {
    const { getByText, getByTestId } = render(
      <GrammairePageWrapper {...defaultProps} />
    );
    expect(getByText("Test Grammar")).toBeInTheDocument();
    expect(getByText("Test description")).toBeInTheDocument();
    expect(getByTestId("children")).toBeInTheDocument();
  });

  it("renders BackToQuestions and QuestionActions components", () => {
    const { getByTestId } = render(<GrammairePageWrapper {...defaultProps} />);
    expect(getByTestId("back-to-questions")).toBeInTheDocument();
    expect(getByTestId("question-actions")).toBeInTheDocument();
  });

  it("hides answer initially", () => {
    const { queryByText } = render(<GrammairePageWrapper {...defaultProps} />);
    expect(queryByText(/This is the correct Answer/)).not.toBeInTheDocument();
  });

  it("shows answer when Show Answer button is clicked", () => {
    const { getByText, queryByText } = render(
      <GrammairePageWrapper {...defaultProps} />
    );
    fireEvent.click(getByText("Show Answer"));
    expect(
      queryByText(/This is the correct Answer : Test answer/)
    ).toBeInTheDocument();
  });

  // This test is skipped due to JSDOM limitation: Cannot assign to read only property 'reload'
  it.skip("calls window.location.reload when Load New button is clicked", () => {
    // Skipped: JSDOM does not allow mocking window.location.reload
    // In a real browser, this would trigger a page reload.
  });
});
