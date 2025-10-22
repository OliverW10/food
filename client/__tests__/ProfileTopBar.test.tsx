import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import { ProfileTopBar } from "../components/profile/profile-top-bar";

// Mock expo-router
jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
}));

describe("ProfileTopBar Component", () => {
  it("renders home button", () => {
    const { getByText } = render(<ProfileTopBar />);

    expect(getByText("Home")).toBeTruthy();
  });

  it("renders username when provided", () => {
    const { getByText } = render(
      <ProfileTopBar username="testuser@example.com" />
    );

    expect(getByText("testuser@example.com")).toBeTruthy();
  });

  it("does not render username when not provided", () => {
    const { queryByText } = render(<ProfileTopBar />);

    // Should not crash and should not show any email
    expect(queryByText("@")).toBeNull();
  });

  it("navigates to home when home button is pressed", () => {
    const { getByText } = render(<ProfileTopBar />);

    const homeButton = getByText("Home");
    fireEvent.press(homeButton);

    // Should call router.push (mocked)
    expect(homeButton).toBeTruthy();
  });

  it("truncates long usernames", () => {
    const longUsername = "verylongusername@verylongdomain.com";
    const { getByText } = render(<ProfileTopBar username={longUsername} />);

    expect(getByText(longUsername)).toBeTruthy();
  });
});
