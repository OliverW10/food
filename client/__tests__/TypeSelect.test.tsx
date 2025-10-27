import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import { TypeSelect } from "../components/type-select";

const mockPresets = [
  { value: "pizza", label: "Pizza" },
  { value: "burger", label: "Burger" },
  { value: "sushi", label: "Sushi" },
];

describe("TypeSelect Component", () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders with placeholder", () => {
    const { getByPlaceholderText } = render(
      <TypeSelect
        presets={mockPresets}
        value=""
        onChange={mockOnChange}
        placeholder="Select food type"
      />
    );

    expect(getByPlaceholderText("Select food type")).toBeTruthy();
  });

  it("shows selected value", () => {
    const { getByDisplayValue } = render(
      <TypeSelect
        presets={mockPresets}
        value="pizza"
        onChange={mockOnChange}
        placeholder="Select food type"
      />
    );

    expect(getByDisplayValue("pizza")).toBeTruthy();
  });

  it("opens dropdown when focused", () => {
    const { getByPlaceholderText, getByText } = render(
      <TypeSelect
        presets={mockPresets}
        value=""
        onChange={mockOnChange}
        placeholder="Select food type"
      />
    );

    const input = getByPlaceholderText("Select food type");
    fireEvent(input, "focus");

    expect(getByText("Pizza")).toBeTruthy();
    expect(getByText("Burger")).toBeTruthy();
    expect(getByText("Sushi")).toBeTruthy();
  });

  it("calls onChange when option is selected", () => {
    const { getByPlaceholderText, getByText } = render(
      <TypeSelect
        presets={mockPresets}
        value=""
        onChange={mockOnChange}
        placeholder="Select food type"
      />
    );

    const input = getByPlaceholderText("Select food type");
    fireEvent(input, "focus");

    const pizzaOption = getByText("Pizza");
    fireEvent.press(pizzaOption);

    expect(mockOnChange).toHaveBeenCalledWith("pizza", true);
  });

  it("filters options when typing", () => {
    const { getByPlaceholderText, getByText, queryByText } = render(
      <TypeSelect
        presets={mockPresets}
        value=""
        onChange={mockOnChange}
        placeholder="Select food type"
      />
    );

    const input = getByPlaceholderText("Select food type");
    fireEvent.changeText(input, "Pizza");

    expect(getByText("Pizza")).toBeTruthy();
    expect(queryByText("Burger")).toBeNull();
    expect(queryByText("Sushi")).toBeNull();
  });

  it("shows no matches message when no options match", () => {
    const { getByPlaceholderText, getByText } = render(
      <TypeSelect
        presets={mockPresets}
        value=""
        onChange={mockOnChange}
        placeholder="Select food type"
      />
    );

    const input = getByPlaceholderText("Select food type");
    fireEvent.changeText(input, "xyz");

    expect(getByText("No matches")).toBeTruthy();
  });
});
