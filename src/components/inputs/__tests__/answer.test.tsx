import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Answer from "../answer";

describe("Answer", () => {
  const defaultProps = {
    index: 1,
    content: "Option B",
    checked: false,
    onToggle: jest.fn(),
  };

  it("renders checkbox and content", () => {
    const { getByRole, getByText } = render(<Answer {...defaultProps} />);
    expect(getByRole("checkbox")).toBeInTheDocument();
    expect(getByText("Option B")).toBeInTheDocument();
  });

  it("checkbox reflects checked prop", () => {
    const { getByRole, rerender } = render(
      <Answer {...defaultProps} checked={false} />
    );
    expect(getByRole("checkbox")).not.toBeChecked();
    rerender(<Answer {...defaultProps} checked={true} />);
    expect(getByRole("checkbox")).toBeChecked();
  });

  it("calls onToggle with correct arguments when toggled", () => {
    const onToggle = jest.fn();
    const { getByRole } = render(
      <Answer {...defaultProps} onToggle={onToggle} />
    );
    fireEvent.click(getByRole("checkbox"));
    expect(onToggle).toHaveBeenCalledWith(true, 1);
  });

  it("has correct class names", () => {
    const { container } = render(<Answer {...defaultProps} />);
    expect(container.querySelector(".answer-option")).toBeInTheDocument();
    expect(container.querySelector(".form-checkbox")).toBeInTheDocument();
  });
});
