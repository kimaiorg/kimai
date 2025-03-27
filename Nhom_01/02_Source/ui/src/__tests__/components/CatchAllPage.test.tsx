import React from "react";
import { render, screen } from "@testing-library/react";
import CatchAllPage from "@/app/(locales)/[locale]/[...slug]/page";
import { notFound } from "next/navigation";
import "@testing-library/jest-dom";
import { expectAny } from "../utils/testUtils";

// Mock next/navigation first before using mockNotFound
jest.mock("next/navigation", () => {
  return {
    notFound: jest.fn()
  };
});

// Get the mocked function after mocking
const mockNotFound = jest.mocked(notFound);

// Mock dynamic import
jest.mock("next/dynamic", () => ({
  __esModule: true,
  default: (callback: any) => {
    const DynamicComponent = () => {
      return <div>Dynamic Component</div>;
    };
    DynamicComponent.displayName = "DynamicComponent";
    return DynamicComponent;
  }
}));

describe("CatchAllPage Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders dynamic component when slug is valid", () => {
    render(
      <CatchAllPage
        params={{
          locale: "en",
          slug: ["dashboard"]
        }}
      />
    );

    // Check if the component is rendered
    const element = screen.getByText("Dynamic Component");
    expectAny(element).toBeInTheDocument();

    // Check if notFound was not called
    expectAny(mockNotFound).not.toHaveBeenCalled();
  });

  it("calls notFound when slug contains directory traversal", () => {
    render(
      <CatchAllPage
        params={{
          locale: "en",
          slug: ["../dangerous-path"]
        }}
      />
    );

    // Check if notFound was called
    expectAny(mockNotFound).toHaveBeenCalled();
  });

  it("calls notFound when slug contains invalid characters", () => {
    render(
      <CatchAllPage
        params={{
          locale: "en",
          slug: ["invalid$characters"]
        }}
      />
    );

    // Check if notFound was called
    expectAny(mockNotFound).toHaveBeenCalled();
  });
});
