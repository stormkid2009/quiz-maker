import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import GrammairePage from "../page";
import * as questionFetcher from "@/utils/question-fetcher";
import "@testing-library/jest-dom";

jest.mock("@/utils/question-fetcher");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock server components
jest.mock("@/components/server/question-pages/grammaire-server", () => {
  // Use the real implementation for the async function
  return jest.requireActual(
    "@/components/server/question-pages/grammaire-server"
  );
});

describe("GrammairePage route", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the grammar question when available", async () => {
    (questionFetcher.getQuestion as jest.Mock).mockResolvedValueOnce({
      id: 1,
      type: "grammaire",
      prompt: "Choose the correct form: She ___ to school every day.",
      options: ["go", "goes", "going"],
      rightAnswer: ["goes"],
    });
    render(<GrammairePage />);
    await waitFor(() => {
      expect(screen.getByText(/grammar questions/i)).toBeInTheDocument();
      expect(
        screen.getByText(/test your grammar knowledge/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/she ___ to school every day/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/goes/i)).toBeInTheDocument();
    });
  });

  it("renders fallback message when no question is available", async () => {
    (questionFetcher.getQuestion as jest.Mock).mockResolvedValueOnce(null);
    render(<GrammairePage />);
    await waitFor(() => {
      expect(
        screen.getByText(/no grammaire question available/i)
      ).toBeInTheDocument();
    });
  });
});
