import "@testing-library/jest-dom";

import * as React from "react";
import { render, screen } from "@testing-library/react";

import { it } from "@jest/globals";

it("renders without crashing", () => {
  render(<div>hello</div>);

  expect(screen.getByText("hello")).toBeInTheDocument();
});
