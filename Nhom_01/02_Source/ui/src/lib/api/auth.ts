import axios from "axios";

/**
 * Fetches user role and permissions from the API
 * @param userId - The ID of the user to fetch permissions for
 * @param useFallback - Whether to return default permissions on error
 * @returns A promise that resolves to the user's role and permissions
 */
export async function getUserRolePermissions(userId: string, useFallback = false) {
  try {
    const response = await axios.get(`/api/auth/user/${userId}/permissions`);
    return response.data;
  } catch (error) {
    if (useFallback) {
      // Return default permissions if fallback is enabled
      return {
        role: "user",
        permissions: ["view_timesheet"]
      };
    }
    throw error;
  }
}
