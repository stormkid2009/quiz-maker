import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import PassagePage from "../page";
import * as questionFetcher from "@/utils/question-fetcher";
import "@testing-library/jest-dom";

jest.mock("@/utils/question-fetcher");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock server components
jest.mock("@/components/server/question-pages/passage-server", () => {
  // Use the real implementation for the async function
  return jest.requireActual(
    "@/components/server/question-pages/passage-server"
  );
});

describe("PassagePage route", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the passage question when available", async () => {
    (questionFetcher.getQuestion as jest.Mock).mockResolvedValueOnce({
      id: 1,
      type: "passage",
      passage: "This is a reading passage about science.",
      relatedQuestions: [
        {
          prompt: "What is the passage about?",
          options: ["Math", "Science", "History"],
          rightAnswer: ["Science"],
        },
        {
          prompt: "Which subject is NOT mentioned?",
          options: ["Math", "Science", "History"],
          rightAnswer: ["Math"],
        },
      ],
    });
    render(<PassagePage />);
    await waitFor(() => {
      expect(screen.getByText(/reading comprehension/i)).toBeInTheDocument();
      expect(
        screen.getByText(
          /test your ability to understand and analyze written passages/i
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText(/this is a reading passage about science/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/what is the passage about/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/which subject is not mentioned/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/science/i)).toBeInTheDocument();
      expect(screen.getByText(/math/i)).toBeInTheDocument();
    });
  });

  it("renders fallback message when no question is available", async () => {
    (questionFetcher.getQuestion as jest.Mock).mockResolvedValueOnce(null);
    render(<PassagePage />);
    await waitFor(() => {
      expect(
        screen.getByText(/no passage question available/i)
      ).toBeInTheDocument();
    });
  });
});
