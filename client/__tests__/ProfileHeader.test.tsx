import { render } from "@testing-library/react-native";
import React from "react";
import { ProfileHeader } from "../components/profile/profile-header";

// Mock expo-router
jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
}));

describe("ProfileHeader Component", () => {
  const defaultProps = {
    name: "John Doe",
    email: "john.doe@example.com",
    followers: 150,
    following: 75,
    postsCount: 42,
  };

  it("renders user information correctly", () => {
    const { getByText } = render(<ProfileHeader {...defaultProps} />);

    expect(getByText("John Doe")).toBeTruthy();
    expect(getByText("john.doe@example.com")).toBeTruthy();
  });

  it("displays correct stats", () => {
    const { getByText } = render(<ProfileHeader {...defaultProps} />);

    expect(getByText("Posts")).toBeTruthy();
    expect(getByText("42")).toBeTruthy();
    expect(getByText("Followers")).toBeTruthy();
    expect(getByText("150")).toBeTruthy();
    expect(getByText("Following")).toBeTruthy();
    expect(getByText("75")).toBeTruthy();
  });

  it("renders with default values when props are not provided", () => {
    const { getByText } = render(<ProfileHeader />);

    expect(getByText("User")).toBeTruthy();
    expect(getByText("0")).toBeTruthy(); // Default follower/following/posts count
  });

  it("generates correct initials from name", () => {
    const { getByText } = render(<ProfileHeader name="Jane Smith Wilson" />);

    expect(getByText("JS")).toBeTruthy(); // Should show first 2 initials
  });

  it("shows default initial when no name provided", () => {
    const { getByText } = render(<ProfileHeader />);

    expect(getByText("U")).toBeTruthy(); // Default "U" initial
  });

  it("renders action buttons", () => {
    const { getByText } = render(<ProfileHeader {...defaultProps} />);

    expect(getByText("Add")).toBeTruthy();
    expect(getByText("Settings")).toBeTruthy();
  });

  it("renders follower/following buttons", () => {
    const { getByText } = render(<ProfileHeader {...defaultProps} />);

    expect(getByText("Followers: 150")).toBeTruthy();
    expect(getByText("Following: 75")).toBeTruthy();
  });
});
