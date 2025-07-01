import React from "react";
import { render, waitFor, act } from "@testing-library/react";
import { useQuizData } from "../use-quiz-data";

describe("useQuizData", () => {
  const mockQuiz = {
    id: "quiz1",
    title: "Test Quiz",
    questions: [
      { id: "q1", type: "MCQ", options: ["A", "B"], answer: ["a"] },
      { id: "q2", type: "MCQ", options: ["X", "Y"], answer: ["b"] },
      {
        id: "q3",
        type: "RC",
        relatedQuestions: [
          {
            id: "q3-0",
            type: "MCQ",
            options: ["True", "False"],
            answer: ["a"],
          },
          { id: "q3-1", type: "MCQ", options: ["Yes", "No"], answer: ["b"] },
        ],
      },
    ],
  };

  beforeEach(() => {
    jest.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockQuiz),
      } as any)
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  function TestComponent() {
    const { quiz, loading, error, refetch, totalQuestions } = useQuizData();
    return (
      <div>
        <span data-testid="loading">{loading ? "true" : "false"}</span>
        <span data-testid="error">{error || ""}</span>
        <span data-testid="quiz">{quiz ? quiz.id : ""}</span>
        <span data-testid="totalQuestions">{totalQuestions}</span>
        <button onClick={refetch}>Refetch</button>
      </div>
    );
  }

  it("loads quiz data and sets totalQuestions", async () => {
    const { getByTestId } = render(<TestComponent />);
    expect(getByTestId("loading").textContent).toBe("true");
    await waitFor(() =>
      expect(getByTestId("loading").textContent).toBe("false")
    );
    expect(getByTestId("quiz").textContent).toBe("quiz1");
    expect(getByTestId("error").textContent).toBe("");
    // 2 MCQ + 2 RC sub-questions = 4
    expect(getByTestId("totalQuestions").textContent).toBe("4");
  });

  it("handles fetch error", async () => {
    jest
      .spyOn(global, "fetch")
      .mockImplementationOnce(() =>
        Promise.resolve({ ok: false, statusText: "Not Found" } as any)
      );
    const { getByTestId } = render(<TestComponent />);
    await waitFor(() =>
      expect(getByTestId("loading").textContent).toBe("false")
    );
    expect(getByTestId("quiz").textContent).toBe("");
    expect(getByTestId("error").textContent).toMatch(/Not Found/);
  });

  it("refetches quiz data", async () => {
    const { getByTestId, getByText } = render(<TestComponent />);
    await waitFor(() =>
      expect(getByTestId("loading").textContent).toBe("false")
    );
    act(() => {
      getByText("Refetch").click();
    });
    expect(getByTestId("loading").textContent).toBe("true");
    await waitFor(() =>
      expect(getByTestId("loading").textContent).toBe("false")
    );
    expect(getByTestId("quiz").textContent).toBe("quiz1");
  });
});
