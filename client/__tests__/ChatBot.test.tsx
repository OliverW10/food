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
    const { getByText, getByPlaceholderText } = render(
      <ChatBot visible={true} onClose={mockOnClose} />
    );

    expect(getByText("AI Assistant")).toBeTruthy();
    expect(getByPlaceholderText("Ask me anything...")).toBeTruthy();
    expect(
      getByText(
        "Hello! I'm your friendly neighbourhood monkey and food connoisseur, Joshua Roy. Ask me anything!"
      )
    ).toBeTruthy();
  });

  it("does not render when not visible", () => {
    const { queryByText } = render(
      <ChatBot visible={false} onClose={mockOnClose} />
    );

    expect(queryByText("AI Assistant")).toBeNull();
  });

  it("calls onClose when close button is pressed", () => {
    const { getByLabelText } = render(
      <ChatBot visible={true} onClose={mockOnClose} />
    );

    const closeButton = getByLabelText("Close");
    fireEvent.press(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("clears chat when refresh button is pressed", () => {
    const { getByLabelText, queryByText } = render(
      <ChatBot visible={true} onClose={mockOnClose} />
    );

    const refreshButton = getByLabelText("Clear chat");
    fireEvent.press(refreshButton);

    // Should still show the initial message after clearing
    expect(
      queryByText(
        "Hello! I'm your friendly neighbourhood monkey and food connoisseur, Joshua Roy. Ask me anything!"
      )
    ).toBeTruthy();
  });

  it("allows typing in input field", () => {
    const { getByPlaceholderText } = render(
      <ChatBot visible={true} onClose={mockOnClose} />
    );

    const input = getByPlaceholderText("Ask me anything...");
    fireEvent.changeText(input, "Hello Joshua");

    expect(input.props.value).toBe("Hello Joshua");
  });
});
