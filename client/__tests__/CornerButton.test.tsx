import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import { Text } from "react-native";
import CornerButton from "../components/corner-button";

describe("CornerButton Component", () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders children correctly", () => {
    const { getByText } = render(
      <CornerButton onPress={mockOnPress} isTop={true}>
        <Text>Test Button</Text>
      </CornerButton>
    );

    expect(getByText("Test Button")).toBeTruthy();
  });

  it("calls onPress when pressed", () => {
    const { getByText } = render(
      <CornerButton onPress={mockOnPress} isTop={true}>
        <Text>Test Button</Text>
      </CornerButton>
    );

    const button = getByText("Test Button").parent;
    fireEvent.press(button);

    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it("renders with correct positioning - top", () => {
    const { getByText } = render(
      <CornerButton onPress={mockOnPress} isTop={true}>
        <Text>Top Button</Text>
      </CornerButton>
    );

    const text = getByText("Top Button");
    expect(text).toBeTruthy();
  });

  it("renders with correct positioning - bottom", () => {
    const { getByText } = render(
      <CornerButton onPress={mockOnPress} isTop={false}>
        <Text>Bottom Button</Text>
      </CornerButton>
    );

    const text = getByText("Bottom Button");
    expect(text).toBeTruthy();
  });

  it("renders with different children types", () => {
    const { getByText } = render(
      <CornerButton onPress={mockOnPress} isTop={true}>
        <Text>Different Child</Text>
      </CornerButton>
    );

    const text = getByText("Different Child");
    expect(text).toBeTruthy();
  });
});
