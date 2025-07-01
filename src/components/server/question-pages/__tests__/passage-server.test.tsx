import React from "react";
import { render } from "@testing-library/react";
import PassageServer from "../passage-server";
import * as questionFetcher from "@/utils/question-fetcher";

jest.mock("@/components/wrappers/question-pages/passage-page-wrapper", () => ({
  __esModule: true,
  default: ({
    children,
    title,
    description,
    firstAnswer,
    secondAnswer,
  }: any) => (
    <div data-testid="passage-page-wrapper">
      <div>{title}</div>
      <div>{description}</div>
      <div>{firstAnswer}</div>
      <div>{secondAnswer}</div>
      {children}
    </div>
  ),
}));
jest.mock("@/components/wrappers/question-data/passage-wrapper", () => ({
  __esModule: true,
  default: ({ question }: any) => (
    <div data-testid="passage-wrapper">{question?.id}</div>
  ),
}));

jest.mock("@/utils/question-fetcher");

describe("PassageServer", () => {
  it("renders fallback message if no question", async () => {
    (questionFetcher.getQuestion as jest.Mock).mockResolvedValueOnce(null);
    const jsx = await PassageServer();
    const { getByText } = render(jsx);
    expect(getByText("No passage question available.")).toBeInTheDocument();
  });

  it("renders wrappers with question if question exists", async () => {
    (questionFetcher.getQuestion as jest.Mock).mockResolvedValueOnce({
      id: "p1",
      relatedQuestions: [{ rightAnswer: ["a"] }, { rightAnswer: ["b"] }],
    });
    const jsx = await PassageServer();
    const { getByTestId, getByText } = render(jsx);
    expect(getByTestId("passage-page-wrapper")).toBeInTheDocument();
    expect(getByTestId("passage-wrapper")).toHaveTextContent("p1");
    expect(getByText("Reading Comprehension")).toBeInTheDocument();
    expect(
      getByText(
        "These questions test your ability to understand and analyze written passages. Read the passage carefully and answer the related questions."
      )
    ).toBeInTheDocument();
    expect(getByText("a")).toBeInTheDocument();
    expect(getByText("b")).toBeInTheDocument();
  });
});
