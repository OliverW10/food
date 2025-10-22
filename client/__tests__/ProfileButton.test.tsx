import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import { ProfileButton } from "../components/profile/profile-button";

describe("ProfileButton Component", () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders primary button correctly", () => {
    const { getByText } = render(
      <ProfileButton label="Follow" onPress={mockOnPress} />
    );

    expect(getByText("Follow")).toBeTruthy();
  });

  it("renders ghost button correctly", () => {
    const { getByText } = render(
      <ProfileButton label="Edit" onPress={mockOnPress} variant="ghost" />
    );

    expect(getByText("Edit")).toBeTruthy();
  });

  it("renders with icon", () => {
    const { getByText } = render(
      <ProfileButton
        label="Settings"
        onPress={mockOnPress}
        icon="settings-outline"
      />
    );

    expect(getByText("Settings")).toBeTruthy();
  });

  it("calls onPress when pressed", () => {
    const { getByText } = render(
      <ProfileButton label="Follow" onPress={mockOnPress} />
    );

    const button = getByText("Follow");
    fireEvent.press(button);

    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it("applies custom styles", () => {
    const customStyle = { marginTop: 10 };
    const customTextStyle = { fontSize: 16 };

    const { getByText } = render(
      <ProfileButton
        label="Custom"
        onPress={mockOnPress}
        style={customStyle}
        textStyle={customTextStyle}
      />
    );

    expect(getByText("Custom")).toBeTruthy();
  });
});
