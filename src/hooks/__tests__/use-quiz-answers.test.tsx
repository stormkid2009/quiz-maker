import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { useQuizAnswers } from "../use-quiz-answers";

describe("useQuizAnswers", () => {
  const mockQuiz = {
    id: "quiz1",
    questions: [
      { id: "q1", type: "MCQ", options: ["A", "B"], answer: ["a"] },
      {
        id: "q2",
        type: "RC",
        relatedQuestions: [
          {
            id: "q2-0",
            type: "MCQ",
            options: ["True", "False"],
            answer: ["a"],
          },
          { id: "q2-1", type: "MCQ", options: ["Yes", "No"], answer: ["b"] },
        ],
      },
    ],
  };

  function TestComponent() {
    const { answers, questionStatus, completedCount, handleAnswerChange } =
      useQuizAnswers({ quiz: mockQuiz });
    return (
      <div>
        <span data-testid="completedCount">{completedCount}</span>
        <span data-testid="q1-status">
          {questionStatus["q1"] ? "true" : "false"}
        </span>
        <span data-testid="q2-0-status">
          {questionStatus["q2-0"] ? "true" : "false"}
        </span>
        <span data-testid="q2-1-status">
          {questionStatus["q2-1"] ? "true" : "false"}
        </span>
        <span data-testid="q1-answers">
          {answers["q1"] ? answers["q1"].join(",") : ""}
        </span>
        <span data-testid="q2-0-answers">
          {answers["q2-0"] ? answers["q2-0"].join(",") : ""}
        </span>
        <span data-testid="q2-1-answers">
          {answers["q2-1"] ? answers["q2-1"].join(",") : ""}
        </span>
        <button onClick={() => handleAnswerChange("q1", ["1"])}>
          Answer Q1
        </button>
        <button onClick={() => handleAnswerChange("q2-0", ["0"])}>
          Answer Q2-0
        </button>
        <button onClick={() => handleAnswerChange("q2-1", ["1"])}>
          Answer Q2-1
        </button>
      </div>
    );
  }

  it("initializes question status and completed count", () => {
    const { getByTestId } = render(<TestComponent />);
    expect(getByTestId("completedCount").textContent).toBe("0");
    expect(getByTestId("q1-status").textContent).toBe("false");
    expect(getByTestId("q2-0-status").textContent).toBe("false");
    expect(getByTestId("q2-1-status").textContent).toBe("false");
  });

  it("updates answers, status, and completed count when answering", () => {
    const { getByTestId, getByText } = render(<TestComponent />);
    fireEvent.click(getByText("Answer Q1"));
    expect(getByTestId("q1-answers").textContent).toBe("1");
    expect(getByTestId("q1-status").textContent).toBe("true");
    expect(getByTestId("completedCount").textContent).toBe("1");

    fireEvent.click(getByText("Answer Q2-0"));
    expect(getByTestId("q2-0-answers").textContent).toBe("0");
    expect(getByTestId("q2-0-status").textContent).toBe("true");
    expect(getByTestId("completedCount").textContent).toBe("2");

    fireEvent.click(getByText("Answer Q2-1"));
    expect(getByTestId("q2-1-answers").textContent).toBe("1");
    expect(getByTestId("q2-1-status").textContent).toBe("true");
    expect(getByTestId("completedCount").textContent).toBe("3");
  });
});
