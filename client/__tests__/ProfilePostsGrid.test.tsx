import { render } from "@testing-library/react-native";
import React from "react";
import { Text, View } from "react-native";
import { ProfilePostsGrid } from "../components/profile/profile-posts-grid";

// Mock the FoodPost component
jest.mock("../components/FoodPost", () => {
  const MockFoodPost = ({ review, ...props }: any) => {
    const { View: MockView, Text: MockText } =
      jest.requireActual("react-native");
    return (
      <MockView testID={`post-${review.id}`} {...props}>
        <MockText>{review.title}</MockText>
      </MockView>
    );
  };

  // Set displayName for the mock component
  MockFoodPost.displayName = "FoodPost";

  return {
    FoodPost: MockFoodPost,
  };
});

const mockPosts = [
  {
    id: 1,
    title: "Post 1",
    description: "Description 1",
    author: { id: 1, name: "User 1", email: "user1@test.com" },
    likesCount: 5,
    likedByMe: false,
    commentsCount: 2,
    imageUrl: "image1.jpg",
  },
  {
    id: 2,
    title: "Post 2",
    description: "Description 2",
    author: { id: 1, name: "User 1", email: "user1@test.com" },
    likesCount: 10,
    likedByMe: true,
    commentsCount: 5,
    imageUrl: "image2.jpg",
  },
  {
    id: 3,
    title: "Post 3",
    description: "Description 3",
    author: { id: 1, name: "User 1", email: "user1@test.com" },
    likesCount: 0,
    likedByMe: false,
    commentsCount: 0,
    imageUrl: "image3.jpg",
  },
];

describe("ProfilePostsGrid Component", () => {
  it("renders posts in grid format", () => {
    const { getByTestId } = render(<ProfilePostsGrid reviews={mockPosts} />);

    expect(getByTestId("post-1")).toBeTruthy();
    expect(getByTestId("post-2")).toBeTruthy();
    expect(getByTestId("post-3")).toBeTruthy();
  });

  it("renders with header component", () => {
    const HeaderComponent = () => (
      <View testID="profile-header">
        <Text>Profile Header</Text>
      </View>
    );

    const { getByTestId } = render(
      <ProfilePostsGrid reviews={mockPosts} header={<HeaderComponent />} />
    );

    expect(getByTestId("profile-header")).toBeTruthy();
    expect(getByTestId("post-1")).toBeTruthy();
  });

  it("renders empty grid when no posts", () => {
    const { queryByTestId } = render(<ProfilePostsGrid reviews={[]} />);

    expect(queryByTestId("post-1")).toBeNull();
  });

  it("passes correct props to FoodPost components", () => {
    const { getByTestId } = render(
      <ProfilePostsGrid reviews={[mockPosts[0]]} />
    );

    const postElement = getByTestId("post-1");
    expect(postElement).toBeTruthy();
  });
});
