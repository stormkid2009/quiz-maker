import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { useQuestionNavigation } from "../use-question-navigation";

describe("useQuestionNavigation", () => {
  const mockQuiz = {
    id: "quiz1",
    questions: [
      { id: "q1", type: "MCQ" },
      { id: "q2", type: "MCQ" },
      { id: "q3", type: "MCQ" },
    ],
  };

  function TestComponent() {
    const {
      currentQuestionIndex,
      handlePrevious,
      handleNext,
      isFirstQuestion,
      isLastQuestion,
    } = useQuestionNavigation({ quiz: mockQuiz });
    return (
      <div>
        <span data-testid="currentQuestionIndex">{currentQuestionIndex}</span>
        <span data-testid="isFirstQuestion">
          {isFirstQuestion ? "true" : "false"}
        </span>
        <span data-testid="isLastQuestion">
          {isLastQuestion ? "true" : "false"}
        </span>
        <button onClick={handlePrevious}>Previous</button>
        <button onClick={handleNext}>Next</button>
      </div>
    );
  }

  it("starts at the first question", () => {
    const { getByTestId } = render(<TestComponent />);
    expect(getByTestId("currentQuestionIndex").textContent).toBe("0");
    expect(getByTestId("isFirstQuestion").textContent).toBe("true");
    expect(getByTestId("isLastQuestion").textContent).toBe("false");
  });

  it("navigates forward and backward, respects boundaries", () => {
    const { getByTestId, getByText } = render(<TestComponent />);
    // Go to next question
    fireEvent.click(getByText("Next"));
    expect(getByTestId("currentQuestionIndex").textContent).toBe("1");
    expect(getByTestId("isFirstQuestion").textContent).toBe("false");
    expect(getByTestId("isLastQuestion").textContent).toBe("false");

    // Go to last question
    fireEvent.click(getByText("Next"));
    expect(getByTestId("currentQuestionIndex").textContent).toBe("2");
    expect(getByTestId("isLastQuestion").textContent).toBe("true");

    // Try to go past last question
    fireEvent.click(getByText("Next"));
    expect(getByTestId("currentQuestionIndex").textContent).toBe("2");

    // Go back to previous question
    fireEvent.click(getByText("Previous"));
    expect(getByTestId("currentQuestionIndex").textContent).toBe("1");
    expect(getByTestId("isFirstQuestion").textContent).toBe("false");

    // Go back to first question
    fireEvent.click(getByText("Previous"));
    expect(getByTestId("currentQuestionIndex").textContent).toBe("0");
    expect(getByTestId("isFirstQuestion").textContent).toBe("true");

    // Try to go before first question
    fireEvent.click(getByText("Previous"));
    expect(getByTestId("currentQuestionIndex").textContent).toBe("0");
  });
});
