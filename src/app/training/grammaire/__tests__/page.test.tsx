import React from "react";
import { render, screen } from "@testing-library/react";
import * as questionFetcher from "@/utils/question-fetcher";
import "@testing-library/jest-dom";
import GrammaireServer from "@/components/server/question-pages/grammaire-server";

jest.mock("@/utils/question-fetcher");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("GrammairePage route", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the grammar question when available", async () => {
    (questionFetcher.getQuestion as jest.Mock).mockResolvedValueOnce({
      id: 1,
      type: "MCQ",
      prompt: "Choose the correct form: She ___ to school every day.",
      content: "Choose the correct form: She ___ to school every day.",
      options: ["go", "goes", "going"],
      rightAnswer: ["goes"],
    });
    const ui = await GrammaireServer();
    render(ui);
    expect(screen.getByText(/grammar questions/i)).toBeInTheDocument();
    expect(
      screen.getByText(/test your grammar knowledge/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/she ___ to school every day/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/goes/i)).toBeInTheDocument();
  });

  it("renders fallback message when no question is available", async () => {
    (questionFetcher.getQuestion as jest.Mock).mockResolvedValueOnce(null);
    const ui = await GrammaireServer();
    render(ui);
    expect(
      screen.getByText(/no grammaire question available/i)
    ).toBeInTheDocument();
  });
});
