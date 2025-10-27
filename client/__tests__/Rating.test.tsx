import { render } from "@testing-library/react-native";
import React from "react";
import { Rating } from "../components/Rating";

describe("Rating Component", () => {
  it("renders 4 full stars", () => {
    const { getAllByText } = render(<Rating value={4} />);
    const fullStars = getAllByText("★");
    const emptyStars = getAllByText("☆");
    expect(fullStars).toHaveLength(4);
    expect(emptyStars).toHaveLength(1);
  });

  it("renders 4.5 rating with half star", () => {
    const { getAllByText } = render(<Rating value={4.5} />);
    const fullStars = getAllByText("★");
    const halfStars = getAllByText("☆");
    expect(fullStars).toHaveLength(4);
    expect(halfStars).toHaveLength(1);
  });

  it("handles maximum rating", () => {
    const { getAllByText } = render(<Rating value={5} />);
    const fullStars = getAllByText("★");
    expect(fullStars).toHaveLength(5);
  });

  it("handles minimum rating", () => {
    const { getAllByText } = render(<Rating value={0} />);
    const emptyStars = getAllByText("☆");
    expect(emptyStars).toHaveLength(5);
  });

  it("handles decimal ratings correctly", () => {
    const { getAllByText } = render(<Rating value={3.7} />);
    const fullStars = getAllByText("★");
    const emptyStars = getAllByText("☆");
    expect(fullStars).toHaveLength(3);
    expect(emptyStars).toHaveLength(2);
  });
});
