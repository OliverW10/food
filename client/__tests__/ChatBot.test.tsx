import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import { TouchableOpacity } from "react-native";
import { ChatBot } from "../components/ChatBot";

jest.mock("../services/trpc", () => ({
  __esModule: true,
  default: {
    chat: {
      sendMessage: {
        useMutation: () => ({
          mutateAsync: jest.fn().mockResolvedValue({
            success: true,
            message: "Hello! I'm Joshua Roy, your friendly food man!",
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

    expect(getByText("Talk To Joshua Roy")).toBeTruthy();
  });

  it("does not render when not visible", () => {
    const { queryByText } = render(
      <ChatBot visible={false} onClose={mockOnClose} />
    );

    expect(queryByText("Talk To Joshua Roy")).toBeNull();
  });

  it("calls onClose when close button is pressed", () => {
    const { UNSAFE_getAllByType } = render(
      <ChatBot visible={true} onClose={mockOnClose} />
    );

    const touchables = UNSAFE_getAllByType(TouchableOpacity);
    const closeButton = touchables[1];
    fireEvent.press(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("renders basic chatbot structure", () => {
    const { getByText } = render(
      <ChatBot visible={true} onClose={mockOnClose} />
    );

    expect(getByText("Talk To Joshua Roy")).toBeTruthy();
    expect(
      getByText(
        "Hello! I'm your friendly food connoisseur Joshua Roy. Ask me anything!"
      )
    ).toBeTruthy();
  });

  it("renders in a modal", () => {
    const { getByText } = render(
      <ChatBot visible={true} onClose={mockOnClose} />
    );

    expect(getByText("Talk To Joshua Roy")).toBeTruthy();
  });
});
