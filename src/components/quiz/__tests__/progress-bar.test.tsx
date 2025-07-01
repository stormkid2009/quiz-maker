import React from "react";
import { render } from "@testing-library/react";
import ProgressBar from "../progress-bar";

describe("ProgressBar", () => {
  it("renders current and total question text", () => {
    const { getByText } = render(<ProgressBar current={2} total={5} />);
    expect(getByText(/question 2 of 5/i)).toBeInTheDocument();
  });

  it("shows percentage by default", () => {
    const { getByText } = render(<ProgressBar current={2} total={5} />);
    expect(getByText("40%")).toBeInTheDocument();
  });

  it("hides percentage if percentage={false}", () => {
    const { queryByText } = render(
      <ProgressBar current={2} total={5} percentage={false} />
    );
    expect(queryByText("40%")).not.toBeInTheDocument();
  });

  it("progress bar width matches percentage", () => {
    const { container } = render(<ProgressBar current={3} total={4} />);
    const bar = container.querySelector(".bg-blue-600");
    expect(bar).toHaveStyle("width: 75%");
  });

  it("handles current > total and clamps to 100%", () => {
    const { getByText, container } = render(
      <ProgressBar current={10} total={5} />
    );
    expect(getByText("100%")).toBeInTheDocument();
    const bar = container.querySelector(".bg-blue-600");
    expect(bar).toHaveStyle("width: 100%");
  });

  it("handles current = 0 and total = 0", () => {
    const { getByText, container } = render(
      <ProgressBar current={0} total={0} />
    );
    expect(getByText("0%")).toBeInTheDocument();
    const bar = container.querySelector(".bg-blue-600");
    expect(bar).toHaveStyle("width: 0%");
  });
});
