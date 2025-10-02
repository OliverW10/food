import { render, waitFor } from '@testing-library/react-native';
import React from 'react';
import ProfileView from '../app/profile/[userId]';

jest.mock('../hooks/user-context', () => ({
  useSession: () => ({
    user: { id: '42', email: 'tester@example.com' },
    session: { token: 'abc' },
  }),
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: jest.fn(), push: jest.fn() }),
}));

const mockUseQuery = jest.fn();

jest.mock('../services/trpc', () => ({
  __esModule: true,
  default: {
    profile: {
      get: {
        useQuery: (...args: any[]) => mockUseQuery(...args),
      },
    },
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('ProfileView', () => {
  it('shows sign-in prompt if no session', async () => {
    (jest.requireMock('../hooks/user-context') as any).useSession = () => ({
      user: undefined,
      session: undefined,
    });
    mockUseQuery.mockReturnValue({});
    const { getByText } = render(<ProfileView />);
    await waitFor(() => expect(getByText(/Please sign in/i)).toBeTruthy());
  });

  it('renders loading state', async () => {
    mockUseQuery.mockReturnValue({ isLoading: true, isFetching: true });
    const { getByText } = render(<ProfileView userId={42} />);
    await waitFor(() => expect(getByText(/Loading profile/i)).toBeTruthy());
  });

  it('renders error message', async () => {
    mockUseQuery.mockReturnValue({ isError: true, error: new Error('Boom') });
    const { getByText } = render(<ProfileView userId={42} />);
    await waitFor(() => expect(getByText('Boom')).toBeTruthy());
  });

  it('renders profile data', async () => {
    const nowISO = new Date().toISOString();
    mockUseQuery.mockReturnValue({
      isLoading: false,
      isFetching: false,
      isError: false,
      data: {
        name: 'Jane',
        email: 'jane@example.com',
        followers: 5,
        following: 10,
        posts: [{ id: 1, title: 'Test', createdAt: nowISO }],
      },
    });
    const { getByText } = render(<ProfileView userId={42} />);
    await waitFor(() => expect(getByText(/jane@example.com/i)).toBeTruthy());
  });

  it('falls back when fields missing', async () => {
    mockUseQuery.mockReturnValue({
      data: { posts: [] },
      isLoading: false,
    });
    const { getByText } = render(<ProfileView userId={42} />);
    await waitFor(() => expect(getByText(/User/i)).toBeTruthy());
  });
});
