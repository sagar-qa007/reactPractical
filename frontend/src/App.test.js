import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import App from "./App";

jest.mock("react-dnd-html5-backend", () => ({
  HTML5Backend: {},
}));

jest.mock("react-dnd", () => ({
  useDrag: () => [{}, () => {}],
  useDrop: () => [{}, () => {}],
  DndProvider: ({ children }) => <div>{children}</div>,
}));

describe("App", () => {
  it.only("renders App component", async () => {
    render(<App />);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Wait for documents to be fetched
    await waitFor(() => {
      expect(screen.getByText("Bank Draft")).toBeInTheDocument();
    });
  });
});
