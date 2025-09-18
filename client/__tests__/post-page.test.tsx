import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import PostPage from '../app/post';

jest.mock('../hooks/user-context', () => ({
  useSession: () => ({ user: { id: '42', email: 'tester@example.com' }, session: { token: 'abc' } }),
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: jest.fn() }),
}));

jest.mock('../components/PostImagePicker', () => {
  const ReactNative = jest.requireActual('react-native');
  const MockPicker = ({ onChange }: any) => (
    <ReactNative.Pressable testID="pick-image" onPress={() => onChange('file:///local/test.jpg')}>
      <ReactNative.Text>Pick</ReactNative.Text>
    </ReactNative.Pressable>
  );
  MockPicker.displayName = 'MockPostImagePicker';
  return MockPicker;
});

const mockMutateAsync = jest.fn().mockResolvedValue({
  id: 99,
  title: 'Hello',
  description: 'Yum',
  image: { id: 7, storageUrl: '/uploads/abc.png' }
});
jest.mock('../services/trpc', () => ({
  post: {
    create: {
      useMutation: () => ({ isPending: false, mutateAsync: mockMutateAsync }),
    },
  },
}));

beforeEach(() => {
  global.fetch = jest.fn()
    // first call: fetch(imageUri) -> return blob
    .mockResolvedValueOnce({ blob: async () => new Blob(['test'], { type: 'image/jpeg' }) } as any)
    // second call: upload endpoint -> return json { id: 7 }
    .mockResolvedValueOnce({ ok: true, json: async () => ({ id: 7 }) } as any);
});

describe('PostPage', () => {
  it('submits a new post successfully', async () => {
    const { getByText, getByPlaceholderText, getByTestId } = render(<PostPage />);

    const titleInput = getByPlaceholderText('E.g. Homemade ramen');
    fireEvent.changeText(titleInput, 'My Dish');

    const descriptionInput = getByPlaceholderText('');
    fireEvent.changeText(descriptionInput, 'Great food');

    fireEvent.press(getByTestId('pick-image'));

    fireEvent.press(getByText('Post'));

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalled();
    });
  });

  it('prevents submission when required fields missing', async () => {
    const { getByText } = render(<PostPage />);
    const button = getByText('Fill required fields');
    expect(button).toBeTruthy();
  });
});
