import React from "react";
import { render, screen } from "@testing-library/react";
import * as questionFetcher from "@/utils/question-fetcher";
import "@testing-library/jest-dom";
import CompositionServer from "@/components/server/question-pages/composition-server";

jest.mock("@/utils/question-fetcher");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("CompositionPage route", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the composition question when available", async () => {
    (questionFetcher.getQuestion as jest.Mock).mockResolvedValueOnce({
      id: 1,
      type: "Open-Ended",
      content: "Write a short essay about your favorite book.",
      answer: "My favorite book is...",
    });
    const ui = await CompositionServer();
    render(ui);
    expect(screen.getByText(/composition question/i)).toBeInTheDocument();
    expect(
      screen.getByText(/practice writing with open-ended questions/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/write a short essay about your favorite book/i)
    ).toBeInTheDocument();
  });

  it("renders fallback message when no question is available", async () => {
    (questionFetcher.getQuestion as jest.Mock).mockResolvedValueOnce(null);
    const ui = await CompositionServer();
    render(ui);
    expect(
      screen.getByText(/no composition question available/i)
    ).toBeInTheDocument();
  });
});
