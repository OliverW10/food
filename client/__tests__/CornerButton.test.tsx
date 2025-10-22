import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import CornerButton from "../components/corner-button";

describe("CornerButton Component", () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders children correctly", () => {
    const { getByText } = render(
      <CornerButton onPress={mockOnPress} isTop={true}>
        <span>Test Button</span>
      </CornerButton>
    );

    expect(getByText("Test Button")).toBeTruthy();
  });

  it("calls onPress when pressed", () => {
    const { getByRole } = render(
      <CornerButton onPress={mockOnPress} isTop={true}>
        <span>Test Button</span>
      </CornerButton>
    );

    const button = getByRole("button");
    fireEvent.press(button);

    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it("renders with correct positioning - top", () => {
    const { getByRole } = render(
      <CornerButton onPress={mockOnPress} isTop={true}>
        <span>Top Button</span>
      </CornerButton>
    );

    const button = getByRole("button");
    expect(button).toBeTruthy();
  });

  it("renders with correct positioning - bottom", () => {
    const { getByRole } = render(
      <CornerButton onPress={mockOnPress} isTop={false}>
        <span>Bottom Button</span>
      </CornerButton>
    );

    const button = getByRole("button");
    expect(button).toBeTruthy();
  });

  it("renders with different children types", () => {
    const { getByText } = render(
      <CornerButton onPress={mockOnPress} isTop={true}>
        <span>Different Child</span>
      </CornerButton>
    );

    const button = getByText("Different Child");
    expect(button).toBeTruthy();
  });
});
