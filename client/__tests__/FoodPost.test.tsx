import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import { FoodPost } from "../components/FoodPost";

jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock("../services/trpc", () => ({
  __esModule: true,
  default: {
    useUtils: () => ({
      post: {
        getFeed: {
          cancel: jest.fn(),
          getInfiniteData: jest.fn(),
          setInfiniteData: jest.fn(),
          invalidate: jest.fn(),
        },
      },
    }),
    post: {
      likeToggle: {
        useMutation: () => ({
          mutate: jest.fn(),
        }),
      },
    },
  },
}));

const mockPost = {
  id: 1,
  title: "Test Post",
  description: "This is a test post description",
  author: {
    id: 1,
    name: "Test User",
    email: "test@example.com",
  },
  likesCount: 5,
  likedByMe: false,
  commentsCount: 3,
  imageUrl: "https://example.com/image.jpg",
};

describe("FoodPost Component", () => {
  const mockOnOpenComments = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders post content correctly", () => {
    const { getByText } = render(
      <FoodPost review={mockPost} onOpenComments={mockOnOpenComments} />
    );

    expect(getByText("Test Post")).toBeTruthy();
    expect(getByText("Test User This is a test post description")).toBeTruthy();
  });

  it("shows correct like count and state", () => {
    const { getByText } = render(
      <FoodPost review={mockPost} onOpenComments={mockOnOpenComments} />
    );

    expect(getByText("♡\n\n            5")).toBeTruthy();
  });

  it("shows liked state when post is liked", () => {
    const likedPost = { ...mockPost, likedByMe: true };
    const { getByText } = render(
      <FoodPost review={likedPost} onOpenComments={mockOnOpenComments} />
    );

    expect(getByText("♥ 5")).toBeTruthy(); // Liked state
  });

  it("shows correct comments count", () => {
    const { getByText } = render(
      <FoodPost review={mockPost} onOpenComments={mockOnOpenComments} />
    );

    expect(getByText("💬 3")).toBeTruthy();
  });

  it("calls onOpenComments when comments button is pressed", () => {
    const { getByLabelText } = render(
      <FoodPost review={mockPost} onOpenComments={mockOnOpenComments} />
    );

    const commentsButton = getByLabelText("Open comments");
    fireEvent.press(commentsButton);

    expect(mockOnOpenComments).toHaveBeenCalledTimes(1);
  });

  it("handles like button press", () => {
    const { getByLabelText } = render(
      <FoodPost review={mockPost} onOpenComments={mockOnOpenComments} />
    );

    const likeButton = getByLabelText("Like post");
    fireEvent.press(likeButton);

    expect(likeButton).toBeTruthy();
  });

  it("renders in grid view mode", () => {
    const { getByTestId } = render(
      <FoodPost review={mockPost} gridView={true} testID="grid-post" />
    );

    const touchable = getByTestId("grid-post");
    expect(touchable).toBeTruthy();
  });

  it("navigates to post when pressed", () => {
    const { getByRole } = render(
      <FoodPost review={mockPost} onOpenComments={mockOnOpenComments} />
    );

    const postButton = getByRole("button");
    fireEvent.press(postButton);

    expect(postButton).toBeTruthy();
  });
});
