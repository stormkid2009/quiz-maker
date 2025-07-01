import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Question from "../question";
import { QuestionTypes } from "@/shared/schemas/base-question";

describe("Question", () => {
  it("renders MCQ and handles answer change", () => {
    const onAnswerChange = jest.fn();
    const question = {
      id: "q1",
      type: QuestionTypes.MCQ,
      content: "What is 2+2?",
      options: ["3", "4", "5"],
    };
    const { getByText, getAllByRole } = render(
      <Question question={question} onAnswerChange={onAnswerChange} />
    );
    expect(getByText("What is 2+2?")).toBeInTheDocument();
    fireEvent.click(getAllByRole("checkbox")[1]); // select '4'
    expect(onAnswerChange).toHaveBeenCalledWith("q1", ["4"]);
  });

  it("renders Multi-MCQ and handles multiple answers", () => {
    const onAnswerChange = jest.fn();
    const question = {
      id: "q2",
      type: QuestionTypes.MULTI_MCQ,
      content: "Select even numbers",
      options: ["1", "2", "3", "4"],
    };
    const { getByText, getAllByRole } = render(
      <Question question={question} onAnswerChange={onAnswerChange} />
    );
    expect(getByText("Select even numbers")).toBeInTheDocument();
    fireEvent.click(getAllByRole("checkbox")[1]); // select '2'
    expect(onAnswerChange).toHaveBeenCalledWith("q2", ["2"]);
    fireEvent.click(getAllByRole("checkbox")[3]); // select '4'
    // The hook will call onAnswerChange again with both selected
  });

  it("renders RC and handles sub-question answer", () => {
    const onAnswerChange = jest.fn();
    const question = {
      id: "q3",
      type: QuestionTypes.RC,
      passage: "Read this passage.",
      relatedQuestions: [
        {
          id: "q3-0",
          content: "What is the main idea?",
          options: ["A", "B"],
        },
      ],
    };
    const { getByText, getAllByRole } = render(
      <Question question={question} onAnswerChange={onAnswerChange} />
    );
    expect(getByText("Reading Passage")).toBeInTheDocument();
    expect(getByText("What is the main idea?")).toBeInTheDocument();
    fireEvent.click(getAllByRole("checkbox")[0]);
    expect(onAnswerChange).toHaveBeenCalledWith("q3-0", ["A"]);
  });

  it("renders Open-Ended and handles input", () => {
    const onAnswerChange = jest.fn();
    const question = {
      id: "q4",
      type: QuestionTypes.OPEN_ENDED,
      content: "Explain your answer.",
    };
    const { getByPlaceholderText } = render(
      <Question question={question} onAnswerChange={onAnswerChange} />
    );
    const textarea = getByPlaceholderText("Type your answer here...");
    fireEvent.change(textarea, { target: { value: "My answer" } });
    expect(onAnswerChange).toHaveBeenCalledWith("q4", ["My answer"]);
  });
});
