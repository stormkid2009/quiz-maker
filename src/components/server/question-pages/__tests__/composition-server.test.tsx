import React from "react";
import { render } from "@testing-library/react";
import CompositionServer from "../composition-server";
import * as questionFetcher from "@/utils/question-fetcher";

jest.mock(
  "@/components/wrappers/question-pages/composition-page-wrapper",
  () => ({
    __esModule: true,
    default: ({ children, title, description, answer }: any) => (
      <div data-testid="composition-page-wrapper">
        <div>{title}</div>
        <div>{description}</div>
        <div>{answer}</div>
        {children}
      </div>
    ),
  })
);
jest.mock("@/components/wrappers/question-data/composition-wrapper", () => ({
  __esModule: true,
  default: ({ question }: any) => (
    <div data-testid="composition-wrapper">{question?.id}</div>
  ),
}));

jest.mock("@/utils/question-fetcher");

describe("CompositionServer", () => {
  it("renders fallback message if no question", async () => {
    (questionFetcher.getQuestion as jest.Mock).mockResolvedValueOnce(null);
    const jsx = await CompositionServer();
    const { getByText } = render(jsx);
    expect(getByText("No composition question available.")).toBeInTheDocument();
  });

  it("renders wrappers with question if question exists", async () => {
    (questionFetcher.getQuestion as jest.Mock).mockResolvedValueOnce({
      id: "q1",
      answer: "Sample answer",
    });
    const jsx = await CompositionServer();
    const { getByTestId, getByText } = render(jsx);
    expect(getByTestId("composition-page-wrapper")).toBeInTheDocument();
    expect(getByTestId("composition-wrapper")).toHaveTextContent("q1");
    expect(getByText("Composition Question")).toBeInTheDocument();
    expect(
      getByText("Practice writing with open-ended questions")
    ).toBeInTheDocument();
    expect(getByText("Sample answer")).toBeInTheDocument();
  });
});
