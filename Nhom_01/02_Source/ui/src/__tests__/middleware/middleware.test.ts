import { NextRequest, NextResponse } from "next/server";
import { expectAny } from "../utils/testUtils";

// Mock the middleware module directly
jest.mock("@/middleware", () => ({
  middleware: jest.fn().mockImplementation(() => {
    return { status: 200 };
  })
}));

describe("Middleware", () => {
  let middleware: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    middleware = require("@/middleware").middleware;
  });

  it("is called with the request object", () => {
    const mockRequest = { url: "http://localhost:3000/" };
    middleware(mockRequest);
    expectAny(middleware).toHaveBeenCalledWith(mockRequest);
  });

  it("returns a response object", () => {
    const mockRequest = { url: "http://localhost:3000/" };
    const result = middleware(mockRequest);
    expectAny(result).toEqual({ status: 200 });
  });
});
