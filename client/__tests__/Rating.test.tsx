import { render } from "@testing-library/react-native";
import React from "react";
import { Rating } from "../components/Rating";

describe("Rating Component", () => {
  it("renders 4 full stars", () => {
    const { getByText } = render(<Rating value={4} />);

    // Should show 4 full stars and 1 empty
    const stars = getByText("★");
    expect(stars).toBeTruthy();
  });

  it("renders 4.5 rating with half star", () => {
    const { getByText } = render(<Rating value={4.5} />);

    // Should show 4 full stars, 1 half star
    const fullStar = getByText("★");
    const halfStar = getByText("☆");
    expect(fullStar).toBeTruthy();
    expect(halfStar).toBeTruthy();
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
    const { getByText } = render(<Rating value={3.7} />);

    // Should show 3 full stars and 2 empty (no half star for 0.7)
    const star = getByText("★");
    expect(star).toBeTruthy();
  });
});
