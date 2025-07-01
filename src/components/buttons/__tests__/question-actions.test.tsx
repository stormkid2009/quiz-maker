import React from "react";
import { render, fireEvent } from "@testing-library/react";
import QuestionActions from "../question-actions";

describe("QuestionActions", () => {
  it("renders both buttons with default text", () => {
    const { getByRole } = render(<QuestionActions />);
    expect(getByRole("button", { name: /show answer/i })).toBeInTheDocument();
    expect(
      getByRole("button", { name: /load another question/i })
    ).toBeInTheDocument();
  });

  it("renders custom load button text", () => {
    const { getByRole } = render(<QuestionActions loadButtonText="Next" />);
    expect(getByRole("button", { name: /next/i })).toBeInTheDocument();
  });

  it("calls onShowAnswer when Show Answer is clicked", () => {
    const onShowAnswer = jest.fn();
    const { getByRole } = render(
      <QuestionActions onShowAnswer={onShowAnswer} />
    );
    fireEvent.click(getByRole("button", { name: /show answer/i }));
    expect(onShowAnswer).toHaveBeenCalled();
  });

  it("calls onLoadNew when Load button is clicked", () => {
    const onLoadNew = jest.fn();
    const { getByRole } = render(<QuestionActions onLoadNew={onLoadNew} />);
    fireEvent.click(getByRole("button", { name: /load another question/i }));
    expect(onLoadNew).toHaveBeenCalled();
  });

  it("buttons have correct class names", () => {
    const { getByRole } = render(<QuestionActions />);
    const showAnswerBtn = getByRole("button", { name: /show answer/i });
    const loadBtn = getByRole("button", { name: /load another question/i });
    expect(showAnswerBtn).toHaveClass("bg-green-600");
    expect(showAnswerBtn).toHaveClass("hover:bg-green-700");
    expect(loadBtn).toHaveClass("bg-blue-600");
    expect(loadBtn).toHaveClass("hover:bg-blue-700");
  });
});
