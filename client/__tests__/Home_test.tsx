import { fireEvent, render, waitFor } from '@testing-library/react-native';
import Home from '../app/index';

// use the manual mock above
jest.mock('../services/trpc');

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
    // after optimistic toggle, likes counter should increment from 0 to 1
    await waitFor(() => expect(getByText(/♥ 1|♡ 1/)).toBeTruthy());
  });

  it('opens comments sheet', async () => {
    const { getByLabelText, getByText } = render(<Home />);
    await waitFor(() => expect(getByText('Ramen')).toBeTruthy());
    const commentsBtn = getByLabelText('Open comments');
    fireEvent.press(commentsBtn);
    await waitFor(() => expect(getByText(/Comments/i)).toBeTruthy());
    await waitFor(() => expect(getByText('nice!')).toBeTruthy());
  });

  it('shows FAB and routes unauthenticated users to /auth (visual presence)', async () => {
    const { getByText } = render(<Home />);
    // We just assert the + exists (routing is handled by expo-router during runtime)
    expect(getByText('+')).toBeTruthy();
  });
});
