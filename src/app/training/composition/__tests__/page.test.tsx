import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import CompositionPage from "../page";
import * as questionFetcher from "@/utils/question-fetcher";
import "@testing-library/jest-dom";

jest.mock("@/utils/question-fetcher");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock server components
jest.mock("@/components/server/question-pages/composition-server", () => {
  // Use the real implementation for the async function
  return jest.requireActual(
    "@/components/server/question-pages/composition-server"
  );
});

describe("CompositionPage route", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the composition question when available", async () => {
    (questionFetcher.getQuestion as jest.Mock).mockResolvedValueOnce({
      id: 1,
      type: "composition",
      prompt: "Write a short essay about your favorite book.",
      answer: "My favorite book is...",
    });
    render(<CompositionPage />);
    await waitFor(() => {
      expect(screen.getByText(/composition question/i)).toBeInTheDocument();
      expect(
        screen.getByText(/practice writing with open-ended questions/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/write a short essay about your favorite book/i)
      ).toBeInTheDocument();
    });
  });

  it("renders fallback message when no question is available", async () => {
    (questionFetcher.getQuestion as jest.Mock).mockResolvedValueOnce(null);
    render(<CompositionPage />);
    await waitFor(() => {
      expect(
        screen.getByText(/no composition question available/i)
      ).toBeInTheDocument();
    });
  });
});
