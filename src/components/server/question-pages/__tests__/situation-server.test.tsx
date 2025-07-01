import React from "react";
import { render } from "@testing-library/react";
import SituationServer from "../situation-server";

// Suppress console.error during tests
beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});
afterAll(() => {
  (console.error as jest.Mock).mockRestore();
});

// Mock the wrapper components
jest.mock(
  "@/components/wrappers/question-pages/situation-page-wrapper",
  () => ({
    __esModule: true,
    default: ({
      children,
      title,
      description,
      firstAnswer,
      secondAnswer,
    }: any) => (
      <div data-testid="situation-page-wrapper">
        <div>{title}</div>
        <div>{description}</div>
        <div>{firstAnswer}</div>
        <div>{secondAnswer}</div>
        {children}
      </div>
    ),
  })
);
jest.mock("@/components/wrappers/question-data/situation-wrapper", () => ({
  __esModule: true,
  default: ({ question }: any) => (
    <div data-testid="situation-wrapper">{question?.id}</div>
  ),
}));

// Mock the fetch function used in getSituationQuestion
global.fetch = jest.fn();

describe("SituationServer", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders fallback message if no question", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      statusText: "Not Found",
    });
    const jsx = await SituationServer();
    const { getByText } = render(jsx);
    expect(getByText("No situation question available.")).toBeInTheDocument();
  });

  it("renders wrappers with question if question exists", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: "s1", rightAnswer: ["a", "b"] }),
    });
    const jsx = await SituationServer();
    const { getByTestId, getByText } = render(jsx);
    expect(getByTestId("situation-page-wrapper")).toBeInTheDocument();
    expect(getByTestId("situation-wrapper")).toHaveTextContent("s1");
    expect(getByText("Situation Questions")).toBeInTheDocument();
    expect(
      getByText(
        "These questions present real-world situations and require multiple selections. Select all that apply in each situation."
      )
    ).toBeInTheDocument();
    expect(getByText("a")).toBeInTheDocument();
    expect(getByText("b")).toBeInTheDocument();
  });
});
