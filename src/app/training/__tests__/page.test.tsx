import React from "react";
import { render, screen } from "@testing-library/react";
import QuestionsPage from "../page";
import "@testing-library/jest-dom";
import { useRouter } from "next/navigation";

jest.mock("next/link", () => {
  return ({ children, href }: any) => <a href={href}>{children}</a>;
});

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("QuestionsPage", () => {
  it("renders the main heading and description", () => {
    render(<QuestionsPage />);
    expect(
      screen.getByRole("heading", { name: /question types/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /demonstrates all the different types of questions available/i
      )
    ).toBeInTheDocument();
  });

  it("renders all question type cards with correct titles and descriptions", () => {
    render(<QuestionsPage />);
    expect(screen.getByText(/grammar \(mcq\)/i)).toBeInTheDocument();
    expect(screen.getByText(/multi choices and only one answer/i)).toBeInTheDocument();
    expect(screen.getByText(/situation \(multi-mcq\)/i)).toBeInTheDocument();
    expect(screen.getByText(/multi choices with two valid answers/i)).toBeInTheDocument();
    expect(screen.getByText(/composition \(open-ended\)/i)).toBeInTheDocument();
    expect(screen.getByText(/open end so the evaluation will be from an expert/i)).toBeInTheDocument();
    expect(screen.getByText(/reading comprehension/i)).toBeInTheDocument();
    expect(screen.getByText(/one text for comprehension and multi sub questions/i)).toBeInTheDocument();
  });

  it("renders navigation links for each question type", () => {
    render(<QuestionsPage />);
    expect(screen.getByRole("link", { name: /jump to training/i, exact: false, })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /jump to training/i, exact: false, })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /jump to training/i })).toHaveLength(4);
  });

  it("renders the 'Take Full Quiz' button", () => {
    render(<QuestionsPage />);
    expect(screen.getByRole("link", { name: /take full quiz/i })).toBeInTheDocument();
  });
}); 