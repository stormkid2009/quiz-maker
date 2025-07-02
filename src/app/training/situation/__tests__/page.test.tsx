import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import SituationServer from "@/components/server/question-pages/situation-server";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("SituationPage route", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the situation question when available", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: 1,
        type: "Multi-MCQ",
        prompt: "Select all correct actions in this scenario.",
        content: "Select all correct actions in this scenario.",
        options: ["Action A", "Action B", "Action C"],
        rightAnswer: ["Action A", "Action C"],
      }),
    }) as any;
    const ui = await SituationServer();
    render(ui);
    expect(screen.getByText(/situation questions/i)).toBeInTheDocument();
    expect(
      screen.getByText(/real-world situations and require multiple selections/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/select all correct actions in this scenario/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/action a/i)).toBeInTheDocument();
    expect(screen.getByText(/action c/i)).toBeInTheDocument();
  });

  it("renders fallback message when no question is available", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({ ok: false }) as any;
    const ui = await SituationServer();
    render(ui);
    expect(
      screen.getByText(/no situation question available/i)
    ).toBeInTheDocument();
  });
});
