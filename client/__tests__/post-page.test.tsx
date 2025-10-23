import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";
import PostPage from "../app/create-post";

process.env.API_URL = "http://localhost:3000";

jest.mock("../hooks/user-context", () => ({
  useSession: () => ({
    user: { id: "42", email: "tester@example.com" },
    session: { token: "abc" },
  }),
}));

jest.mock("expo-router", () => ({
  useRouter: () => ({ replace: jest.fn() }),
}));

jest.mock("../components/PostImagePicker", () => {
  const ReactNative = jest.requireActual("react-native");
  const MockPicker = ({ onChange }: any) => (
    <ReactNative.Pressable
      testID="pick-image"
      onPress={() =>
        onChange({
          uri: "file:///local/test.jpg",
          type: "image",
          fileName: "test.jpg",
          width: 1000,
          height: 1000,
        })
      }
    >
      <ReactNative.Text>Pick</ReactNative.Text>
    </ReactNative.Pressable>
  );
  MockPicker.displayName = "MockPostImagePicker";
  return MockPicker;
});

const mockMutateAsync = jest.fn().mockResolvedValue({
  id: 99,
  title: "Hello",
  description: "Yum",
  image: { id: 7, storageUrl: "/uploads/abc.png" },
});
jest.mock("../services/trpc", () => ({
  __esModule: true,
  default: {
    post: {
      create: {
        useMutation: () => ({
          isPending: false,
          mutateAsync: mockMutateAsync,
        }),
      },
    },
  },
  getTrpcServerUrl: () => "http://localhost:3000/trpc",
}));
beforeEach(() => {
  global.fetch = jest
    .fn()
    .mockResolvedValueOnce({
      blob: async () => new Blob(["test"], { type: "image/jpeg" }),
    } as any)
    .mockResolvedValueOnce({ ok: true, json: async () => ({ id: 7 }) } as any);
});

describe("PostPage", () => {
  it("submits a new post successfully", async () => {
    const { getByText, getByPlaceholderText, getByTestId } = render(
      <PostPage />
    );

    const titleInput = getByPlaceholderText("E.g. Homemade ramen");
    fireEvent.changeText(titleInput, "My Dish");

    const descriptionInput = getByTestId("description-input");
    fireEvent.changeText(descriptionInput, "Great food");

    fireEvent.press(getByTestId("pick-image"));

    expect(getByText("Post")).toBeTruthy();

    fireEvent.press(getByText("Post"));

    await waitFor(
      () => {
        expect(mockMutateAsync).toHaveBeenCalled();
      },
      { timeout: 3000 }
    );
  });

  it("shows combined validation message when both fields missing", () => {
    const { getByText } = render(<PostPage />);
    expect(getByText("Please provide a title and description")).toBeTruthy();
  });

  it("updates validation message when only description missing", () => {
    const { getByPlaceholderText, getByText } = render(<PostPage />);
    const titleInput = getByPlaceholderText("E.g. Homemade ramen");
    fireEvent.changeText(titleInput, "Just a title");
    expect(getByText("Please provide a description")).toBeTruthy();
  });

  it("updates validation message when only title missing", () => {
    const { getByTestId, getByText } = render(<PostPage />);
    const descriptionInput = getByTestId("description-input");
    fireEvent.changeText(descriptionInput, "Just a description");
    expect(getByText("Please provide a title")).toBeTruthy();
  });

  it("shows Post when both fields provided", () => {
    const { getByPlaceholderText, getByTestId, getByText } = render(<PostPage />);
    fireEvent.changeText(getByPlaceholderText("E.g. Homemade ramen"), "My Dish");
    fireEvent.changeText(getByTestId("description-input"), "Great food");
    expect(getByText("Post")).toBeTruthy();
  });

  it("prevents submission when required fields missing", () => {
    const { getByText } = render(<PostPage />);
    expect(getByText("Please provide a title and description")).toBeTruthy();
  });
});
