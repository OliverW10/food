import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";
import { CommentsSheet } from "../components/CommentsSheet";

jest.mock("../services/trpc", () => ({
  __esModule: true,
  default: {
    comments: {
      list: {
        useInfiniteQuery: () => ({
          data: {
            pages: [
              {
                items: [
                  {
                    id: 1,
                    text: "Great post!",
                    author: {
                      id: 1,
                      email: "user@example.com",
                      name: "Test User",
                    },
                  },
                  {
                    id: 2,
                    text: "Nice photo!",
                    author: {
                      id: 2,
                      email: "user2@example.com",
                      name: "Another User",
                    },
                  },
                ],
              },
            ],
          },
          isLoading: false,
          fetchNextPage: jest.fn(),
          hasNextPage: false,
          refetch: jest.fn(),
        }),
      },
      add: {
        useMutation: () => ({
          mutate: jest.fn(),
          isPending: false,
        }),
      },
    },
    useUtils: () => ({
      comments: {
        list: {
          invalidate: jest.fn(),
        },
      },
    }),
  },
}));

describe("CommentsSheet Component", () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders when visible", () => {
    const { getByText } = render(
      <CommentsSheet postId={1} visible={true} onClose={mockOnClose} />
    );

    expect(getByText("Comments")).toBeTruthy();
  });

  it("does not render when not visible", () => {
    const { queryByText } = render(
      <CommentsSheet postId={1} visible={false} onClose={mockOnClose} />
    );

    expect(queryByText("Comments")).toBeNull();
  });

  it("displays existing comments", async () => {
    const { getByText } = render(
      <CommentsSheet postId={1} visible={true} onClose={mockOnClose} />
    );

    await waitFor(() => {
      expect(getByText("Great post!")).toBeTruthy();
      expect(getByText("Nice photo!")).toBeTruthy();
      expect(getByText("Test User")).toBeTruthy();
      expect(getByText("Another User")).toBeTruthy();
    });
  });

  it("shows comment input", () => {
    const { getByPlaceholderText } = render(
      <CommentsSheet postId={1} visible={true} onClose={mockOnClose} />
    );

    expect(getByPlaceholderText("Add a comment…")).toBeTruthy();
  });

  it("allows typing in comment input", () => {
    const { getByPlaceholderText } = render(
      <CommentsSheet postId={1} visible={true} onClose={mockOnClose} />
    );

    const input = getByPlaceholderText("Add a comment…");
    fireEvent.changeText(input, "New comment");

    expect(input.props.value).toBe("New comment");
  });

  it("shows send button", () => {
    const { getByText } = render(
      <CommentsSheet postId={1} visible={true} onClose={mockOnClose} />
    );

    expect(getByText("Post")).toBeTruthy();
  });

  it("calls onClose when close button is pressed", () => {
    const { getByText } = render(
      <CommentsSheet postId={1} visible={true} onClose={mockOnClose} />
    );

    const closeButton = getByText("Close");
    fireEvent.press(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
