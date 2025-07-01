import React from "react";
import { render, fireEvent } from "@testing-library/react";
import QuizNav from "../quiz-nav";

describe("QuizNav", () => {
  const defaultProps = {
    currentQuestion: 2,
    totalQuestions: 5,
    onPrevious: jest.fn(),
    onNext: jest.fn(),
    onSubmit: jest.fn(),
    isFirstQuestion: false,
    isLastQuestion: false,
  };

  it("renders navigation buttons and current/total text", () => {
    const { getByText } = render(<QuizNav {...defaultProps} />);
    expect(getByText("Previous")).toBeInTheDocument();
    expect(getByText("Next")).toBeInTheDocument();
    expect(getByText("2 of 5")).toBeInTheDocument();
  });

  it("disables Previous button on first question", () => {
    const { getByText } = render(
      <QuizNav {...defaultProps} isFirstQuestion={true} />
    );
    expect(getByText("Previous")).toBeDisabled();
  });

  it("enables Previous button when not first question", () => {
    const { getByText } = render(
      <QuizNav {...defaultProps} isFirstQuestion={false} />
    );
    expect(getByText("Previous")).not.toBeDisabled();
  });

  it("shows Submit Quiz button on last question", () => {
    const { getByText, queryByText } = render(
      <QuizNav {...defaultProps} isLastQuestion={true} />
    );
    expect(getByText("Submit Quiz")).toBeInTheDocument();
    expect(queryByText("Next")).not.toBeInTheDocument();
  });

  it("calls onPrevious, onNext, and onSubmit when buttons are clicked", () => {
    const onPrevious = jest.fn();
    const onNext = jest.fn();
    const onSubmit = jest.fn();
    const { getByText, rerender } = render(
      <QuizNav
        {...defaultProps}
        onPrevious={onPrevious}
        onNext={onNext}
        onSubmit={onSubmit}
      />
    );
    fireEvent.click(getByText("Previous"));
    fireEvent.click(getByText("Next"));
    expect(onPrevious).toHaveBeenCalled();
    expect(onNext).toHaveBeenCalled();
    // Now test submit
    rerender(
      <QuizNav {...defaultProps} isLastQuestion={true} onSubmit={onSubmit} />
    );
    fireEvent.click(getByText("Submit Quiz"));
    expect(onSubmit).toHaveBeenCalled();
  });
});
