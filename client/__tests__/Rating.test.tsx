import { render } from "@testing-library/react-native";
import React from "react";
import { Rating } from "../components/Rating";

describe("Rating Component", () => {
  it("renders 4 full stars", () => {
    const { getAllByText } = render(<Rating value={4} />);

    // Should show 4 full stars and 1 empty
    const fullStars = getAllByText("★");
    const emptyStars = getAllByText("☆");
    expect(fullStars).toHaveLength(4);
    expect(emptyStars).toHaveLength(1);
  });

  it("renders 4.5 rating with half star", () => {
    const { getAllByText } = render(<Rating value={4.5} />);

    // Should show 4 full stars, 1 half star
    const fullStars = getAllByText("★");
    const halfStars = getAllByText("☆");
    expect(fullStars).toHaveLength(4);
    expect(halfStars).toHaveLength(1); // This is the half star
  });

  it("handles maximum rating", () => {
    const { getAllByText } = render(<Rating value={5} />);

    // Should show 5 full stars
    const fullStars = getAllByText("★");
    expect(fullStars).toHaveLength(5);
  });

  it("handles minimum rating", () => {
    const { getAllByText } = render(<Rating value={0} />);

    // Should show 5 empty stars
    const emptyStars = getAllByText("☆");
    expect(emptyStars).toHaveLength(5);
  });

  it("handles decimal ratings correctly", () => {
    const { getAllByText } = render(<Rating value={3.7} />);

    // Should show 3 full stars and 2 empty (no half star for 0.7)
    const fullStars = getAllByText("★");
    const emptyStars = getAllByText("☆");
    expect(fullStars).toHaveLength(3);
    expect(emptyStars).toHaveLength(2);
  });
});
