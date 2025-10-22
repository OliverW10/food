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

jest.mock("../services/trpc", () => {
  let mockCurrentCommentsCount = 2;

  const mockUseCommentMutation = () => ({
    mutate: (vars: any, opts?: any) => {
      mockCommentMutate(vars, opts);
      // Simulate server success immediately
      opts?.onSuccess?.();
      mockCurrentCommentsCount++;
    },
  });

  return {
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
                      commentsCount: mockCurrentCommentsCount,
                      author: {
                        id: 5,
                        email: "alice@example.com",
                        name: "Alice",
                      },
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
                      author: {
                        id: 6,
                        email: "bob@example.com",
                        name: "Bob",
                      },
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
      chat: {
        sendMessage: {
          useMutation: () => ({
            mutateAsync: jest.fn().mockResolvedValue({
              success: true,
              message: "Hello! I'm Joshua Roy, your friendly food monkey!",
            }),
          }),
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
                        commentsCount: mockCurrentCommentsCount,
                        author: {
                          id: 5,
                          email: "alice@example.com",
                          name: "Alice",
                        },
                      },
                    ],
                  },
                ],
              };
              const next = updater(prev);
              mockCurrentCommentsCount = next.pages[0].items[0].commentsCount;
              return next;
            }),
            cancel: jest.fn(),
            getInfiniteData: jest.fn(),
          },
        },
      }),
    },
  };
});

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

  it("shows FAB", async () => {
    const { getByText } = render(<Home />);
    await waitFor(() => expect(getByText("+")).toBeTruthy());
  });

  it("shows chat button", async () => {
    const { getByText } = render(<Home />);
    await waitFor(() => expect(getByText("💬 Chat")).toBeTruthy());
  });
});
