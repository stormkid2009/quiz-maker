import React from "react";
import { render, screen } from "@testing-library/react";
import * as questionFetcher from "@/utils/question-fetcher";
import "@testing-library/jest-dom";
import PassageServer from "@/components/server/question-pages/passage-server";

jest.mock("@/utils/question-fetcher");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("PassagePage route", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the passage question when available", async () => {
    (questionFetcher.getQuestion as jest.Mock).mockResolvedValueOnce({
      id: 1,
      type: "RC",
      passage: "This is a reading passage about science.",
      relatedQuestions: [
        {
          prompt: "What is the passage about?",
          content: "What is the passage about?",
          options: ["Math", "Science", "History"],
          rightAnswer: ["Science"],
          type: "MCQ",
        },
        {
          prompt: "Which subject is NOT mentioned?",
          content: "Which subject is NOT mentioned?",
          options: ["Math", "Science", "History"],
          rightAnswer: ["Math"],
          type: "MCQ",
        },
      ],
    });
    const ui = await PassageServer();
    render(ui);
    expect(screen.getByText(/reading comprehension/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        /test your ability to understand and analyze written passages/i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(/this is a reading passage about science/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/what is the passage about/i)).toBeInTheDocument();
    expect(
      screen.getByText(/which subject is not mentioned/i)
    ).toBeInTheDocument();
    expect(screen.getAllByText(/science/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/math/i).length).toBeGreaterThan(0);
  });

  it("renders fallback message when no question is available", async () => {
    (questionFetcher.getQuestion as jest.Mock).mockResolvedValueOnce(null);
    const ui = await PassageServer();
    render(ui);
    expect(
      screen.getByText(/no passage question available/i)
    ).toBeInTheDocument();
  });
});
