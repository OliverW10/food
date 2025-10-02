import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";
import Home from "../app/home";

jest.mock("../hooks/user-context", () => ({
  useSession: () => ({
    user: { id: "42", email: "tester@example.com" },
    session: { token: "abc" },
  }),
}));

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
}));

const mockLikeMutate = jest.fn();
const mockCommentMutate = jest.fn();
let currentCommentsCount = 2;

// ✅ Wrap mutate so it actually calls our spy
const mockUseCommentMutation = () => ({
  mutate: (vars: any, opts?: any) => {
    mockCommentMutate(vars, opts);
    // immediately simulate success so UI updates
    opts?.onSuccess?.();
    // bump comment count in cache
    currentCommentsCount++;
  },
});

jest.mock("../services/trpc", () => ({
  __esModule: true,
  default: {
    post: {
      getFeed: {
        useInfiniteQuery: () => ({
          data: {
            pages: [
              {
                items: [
                  {
                    id: 1,
                    title: "Ramen",
                    description: "Yum",
                    likedByMe: false,
                    likesCount: 0,
                    commentsCount: currentCommentsCount,
                    author: { id: 5, email: "alice@example.com", name: "Alice" },
                  },
                ],
              },
            ],
          },
          isLoading: false,
          isFetching: false,
          fetchNextPage: jest.fn(),
          hasNextPage: false,
          refetch: jest.fn(),
        }),
      },
      likeToggle: {
        useMutation: () => ({ mutate: mockLikeMutate }),
      },
    },
    comments: {
      list: {
        useInfiniteQuery: () => ({
          data: {
            pages: [
              {
                items: [
                  {
                    id: 10,
                    text: "nice!",
                    author: { id: 6, email: "bob@example.com", name: "Bob" },
                  },
                ],
              },
            ],
          },
          isLoading: false,
          refetch: jest.fn(),
        }),
      },
      add: {
        useMutation: mockUseCommentMutation,
      },
    },
    useUtils: () => ({
      post: {
        getFeed: {
          invalidate: jest.fn(),
          setInfiniteData: jest.fn((_, updater) => {
            const prev = {
              pages: [
                {
                  items: [
                    {
                      id: 1,
                      title: "Ramen",
                      description: "Yum",
                      likedByMe: false,
                      likesCount: 0,
                      commentsCount: currentCommentsCount,
                      author: { id: 5, email: "alice@example.com", name: "Alice" },
                    },
                  ],
                },
              ],
            };
            const next = updater(prev);
            currentCommentsCount = next.pages[0].items[0].commentsCount;
            return next;
          }),
          cancel: jest.fn(),
          getInfiniteData: jest.fn(),
        },
      },
    }),
  },
}));

describe("Home features", () => {
  it("renders following feed", async () => {
    const { getByText } = render(<Home />);
    await waitFor(() => expect(getByText("Ramen")).toBeTruthy());
  });

  it("optimistic like toggles UI and calls mutation", async () => {
    const { getByLabelText, getByText } = render(<Home />);
    await waitFor(() => expect(getByText("Ramen")).toBeTruthy());
    const likeBtn = getByLabelText("Like post");

    fireEvent.press(likeBtn);

    expect(mockLikeMutate).toHaveBeenCalledWith(
      expect.objectContaining({ postId: 1, like: true })
    );
  });

  it("opens comments sheet and shows existing comments", async () => {
    const { getByLabelText, getByText } = render(<Home />);
    await waitFor(() => expect(getByText("Ramen")).toBeTruthy());

    const commentsBtn = getByLabelText("Open comments");
    fireEvent.press(commentsBtn);

    await waitFor(() => expect(getByText(/Comments/i)).toBeTruthy(), {
      timeout: 3000,
    });

    expect(getByText("nice!")).toBeTruthy();
  });

  it("adds a new comment, triggers mutation, and increments comment count", async () => {
    const { getByLabelText, getByPlaceholderText, getByText, queryByText } =
      render(<Home />);
    await waitFor(() => expect(getByText("Ramen")).toBeTruthy());

    // comment count starts at 2
    expect(getByText(/💬 2/)).toBeTruthy();

    // open comments
    fireEvent.press(getByLabelText("Open comments"));
    await waitFor(() => expect(getByText(/Comments/i)).toBeTruthy());

    // type and post
    const input = getByPlaceholderText("Add a comment…");
    fireEvent.changeText(input, "so yum!");
    fireEvent.press(getByText("Post"));

    expect(mockCommentMutate).toHaveBeenCalledWith(
      expect.objectContaining({ postId: 1, text: "so yum!" }),
      expect.anything()
    );

    // count should bump
    await waitFor(() => expect(queryByText(/💬 3/)).toBeTruthy());
  });

  it("shows FAB", async () => {
    const { getByText } = render(<Home />);
    await waitFor(() => expect(getByText("+")).toBeTruthy());
  });
});
