import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import { ChatBot } from "../components/ChatBot";

// Mock trpc
jest.mock("../services/trpc", () => ({
  __esModule: true,
  default: {
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
  },
}));

describe("ChatBot Component", () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly when visible", () => {
    const { getByText } = render(
      <ChatBot visible={true} onClose={mockOnClose} />
    );

    expect(getByText("AI Assistant")).toBeTruthy();
    // Component is simplified, so we just check it renders
    // Simplified component, just check that it renders basic structure
    // expect(getByText("AI Assistant")).toBeTruthy(); // Already checked above
  });

  it("does not render when not visible", () => {
    const { queryByText } = render(
      <ChatBot isOpen={false} onClose={mockOnClose} />
    );

    expect(queryByText("AI Assistant")).toBeNull();
  });

  it("calls onClose when close button is pressed", () => {
    const { getByTestId } = render(
      <ChatBot isOpen={true} onClose={mockOnClose} />
    );

    const closeButton = getByTestId("close-button");
    fireEvent.press(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("renders basic chatbot structure", () => {
    const { getByText } = render(
      <ChatBot isOpen={true} onClose={mockOnClose} />
    );

    // Just verify the component structure
    expect(getByText("AI Assistant")).toBeTruthy();
    expect(getByText("Close")).toBeTruthy();
  });

  it("renders in a modal", () => {
    const { getByTestId } = render(
      <ChatBot isOpen={true} onClose={mockOnClose} />
    );

    expect(getByTestId("chatbot-modal")).toBeTruthy();
  });
});
