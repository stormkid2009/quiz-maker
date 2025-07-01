import React from "react";
import { render } from "@testing-library/react";
import GrammaireServer from "../grammaire-server";
import * as questionFetcher from "@/utils/question-fetcher";

jest.mock(
  "@/components/wrappers/question-pages/grammaire-page-wrapper",
  () => ({
    __esModule: true,
    default: ({ children, title, description, rightAnswer }: any) => (
      <div data-testid="grammaire-page-wrapper">
        <div>{title}</div>
        <div>{description}</div>
        <div>{rightAnswer}</div>
        {children}
      </div>
    ),
  })
);
jest.mock("@/components/wrappers/question-data/grammaire-wrapper", () => ({
  __esModule: true,
  default: ({ question }: any) => (
    <div data-testid="grammaire-wrapper">{question?.id}</div>
  ),
}));

jest.mock("@/utils/question-fetcher");

describe("GrammaireServer", () => {
  it("renders fallback message if no question", async () => {
    (questionFetcher.getQuestion as jest.Mock).mockResolvedValueOnce(null);
    const jsx = await GrammaireServer();
    const { getByText } = render(jsx);
    expect(getByText("No grammaire question available.")).toBeInTheDocument();
  });

  it("renders wrappers with question if question exists", async () => {
    (questionFetcher.getQuestion as jest.Mock).mockResolvedValueOnce({
      id: "g1",
      rightAnswer: ["b"],
    });
    const jsx = await GrammaireServer();
    const { getByTestId, getByText } = render(jsx);
    expect(getByTestId("grammaire-page-wrapper")).toBeInTheDocument();
    expect(getByTestId("grammaire-wrapper")).toHaveTextContent("g1");
    expect(getByText("Grammar Questions")).toBeInTheDocument();
    expect(
      getByText(
        "Test your grammar knowledge with these multiple-choice questions. Each question has one correct answer."
      )
    ).toBeInTheDocument();
    expect(getByText("b")).toBeInTheDocument();
  });
});
