import { render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { ProfileViewInternal } from '../app/profile/[userId]';

// Mock the same module path used by the component (uses alias "@/")
jest.mock('@/hooks/user-context', () => ({
  useSession: jest.fn(),
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: jest.fn(), push: jest.fn() }),
}));

const mockUseQuery = jest.fn();

// Mock the same module path used by the component (uses alias "@/")
jest.mock('@/services/trpc', () => ({
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
  // set default session for most tests
  const mocked = jest.requireMock('@/hooks/user-context') as any;
  mocked.useSession.mockReturnValue({
    user: { id: '42', email: 'tester@example.com' },
    session: { token: 'abc' },
    signOut: jest.fn(),
  });
});

describe('ProfileView', () => {
  it('renders loading state', async () => {
    mockUseQuery.mockReturnValue({ isLoading: true, isFetching: true });
    const { getByText } = render(<ProfileViewInternal userId={42} />);
    await waitFor(() => expect(getByText(/Loading profile/i)).toBeTruthy());
  });

  it('renders error message', async () => {
    mockUseQuery.mockReturnValue({ isError: true, error: new Error('Boom') });
    const { getByText } = render(<ProfileViewInternal userId={42} />);
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
    const { getAllByText } = render(<ProfileViewInternal userId={42} />);
    await waitFor(() => {
      const matches = getAllByText(/jane@example.com/i);
      expect(matches.length).toBeGreaterThan(0);
    });
  });

  it('falls back when fields missing', async () => {
    mockUseQuery.mockReturnValue({
      data: { posts: [] },
      isLoading: false,
    });
    const { getByText } = render(<ProfileViewInternal userId={42} />);
    await waitFor(() => expect(getByText(/User/i)).toBeTruthy());
  });
});
