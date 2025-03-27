import axios from "axios";
import { getUserRolePermissions } from "@/lib/api/auth";
import { expectAny } from "../utils/testUtils";

// Mock axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("Auth API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches user role and permissions successfully", async () => {
    // Mock successful response
    const mockData = {
      role: "admin",
      permissions: ["view_timesheet", "edit_timesheet", "view_reports", "manage_users"]
    };

    mockedAxios.get.mockResolvedValueOnce({ data: mockData });

    // Call the function
    const result = await getUserRolePermissions("user123");

    // Assertions
    expectAny(mockedAxios.get).toHaveBeenCalledWith("/api/auth/user/user123/permissions");
    expectAny(result).toEqual(mockData);
  });

  it("handles API errors gracefully", async () => {
    // Mock error response
    const errorMessage = "Network Error";
    mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage));

    // Call the function and expect it to throw
    await expectAny(getUserRolePermissions("user123")).rejects.toThrow(errorMessage);

    // Verify the API was called
    expectAny(mockedAxios.get).toHaveBeenCalledWith("/api/auth/user/user123/permissions");
  });

  it("returns default permissions on error when fallback is true", async () => {
    // Mock error response
    mockedAxios.get.mockRejectedValueOnce(new Error("Network Error"));

    // Call the function with fallback option
    const result = await getUserRolePermissions("user123", true);

    // Verify default permissions are returned
    expectAny(result).toEqual({
      role: "user",
      permissions: ["view_timesheet"]
    });

    // Verify the API was called
    expectAny(mockedAxios.get).toHaveBeenCalledWith("/api/auth/user/user123/permissions");
  });
});
