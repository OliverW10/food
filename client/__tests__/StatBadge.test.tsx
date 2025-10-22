import { render } from "@testing-library/react-native";
import React from "react";
import { StatBadge } from "../components/stat-badge";

describe("StatBadge Component", () => {
  it("renders label and value correctly", () => {
    const { getByText } = render(<StatBadge label="Posts" value={42} />);

    expect(getByText("Posts")).toBeTruthy();
    expect(getByText("42")).toBeTruthy();
  });

  it("renders with zero value", () => {
    const { getByText } = render(<StatBadge label="Followers" value={0} />);

    expect(getByText("Followers")).toBeTruthy();
    expect(getByText("0")).toBeTruthy();
  });

  it("renders with large numbers", () => {
    const { getByText } = render(<StatBadge label="Views" value={1234567} />);

    expect(getByText("Views")).toBeTruthy();
    expect(getByText("1234567")).toBeTruthy();
  });

  it("handles different label types", () => {
    const { getByText } = render(<StatBadge label="Following" value={150} />);

    expect(getByText("Following")).toBeTruthy();
    expect(getByText("150")).toBeTruthy();
  });
});
