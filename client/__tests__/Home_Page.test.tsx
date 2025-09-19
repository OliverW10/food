import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import Home from '../app/index';

// 🧠 Mock user session (logged in)
jest.mock('../hooks/user-context', () => ({
  useSession: () => ({ user: { id: '42', email: 'tester@example.com' }, session: { token: 'abc' } }),
}));

// 🧠 Mock router so navigation doesn't crash
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
}));

// 🧠 Mock trpc client hooks
const mockLikeMutate = jest.fn();
jest.mock('../services/trpc', () => ({
  post: {
    getFeed: {
      useInfiniteQuery: () => ({
        data: {
          pages: [
            {
              items: [
                {
                  id: 1,
                  title: 'Ramen',
                  description: 'Yum',
                  likedByMe: false,
                  likesCount: 0,
                  commentsCount: 2,
                  author: { id: 5, email: 'alice@example.com' },
                },
              ],
            },
          ],
        },
        isLoading: false,
        isFetching: false,
        fetchNextPage: jest.fn(),
        hasNextPage: false,
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
                { id: 10, text: 'nice!', author: { id: 6, email: 'bob@example.com' } },
              ],
            },
          ],
        },
        isLoading: false,
      }),
    },
    add: {
      useMutation: () => ({ mutate: jest.fn() }),
    },
  },
  useUtils: () => ({
    post: {
      getFeed: {
        invalidate: jest.fn(),
        setInfiniteData: jest.fn(),
      },
    },
  }),
}));

describe('Home features', () => {
  it('renders following feed', async () => {
    const { getByText } = render(<Home />);
    await waitFor(() => expect(getByText('Ramen')).toBeTruthy());
  });

  it('optimistic like toggles UI', async () => {
    const { getByLabelText, getByText } = render(<Home />);
    await waitFor(() => expect(getByText('Ramen')).toBeTruthy());
    const likeBtn = getByLabelText('Like post');
    fireEvent.press(likeBtn);
    expect(mockLikeMutate).toHaveBeenCalled();
  });

  it('opens comments sheet', async () => {
    const { getByLabelText, getByText } = render(<Home />);
    await waitFor(() => expect(getByText('Ramen')).toBeTruthy());
    const commentsBtn = getByLabelText('Open comments');
    fireEvent.press(commentsBtn);
    await waitFor(() => expect(getByText(/Comments/i)).toBeTruthy());
    await waitFor(() => expect(getByText('nice!')).toBeTruthy());
  });

  it('shows FAB', async () => {
    const { getByText } = render(<Home />);
    expect(getByText('+')).toBeTruthy();
  });
});
