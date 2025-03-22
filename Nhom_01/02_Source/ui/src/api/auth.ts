import axios from "axios";
// Auth0 Management API: https://auth0.com/docs/api/management/v2

type AccessTokenResponse = {
    access_token: string;
    expires_in: number;
    token_type: string;
};

export type Role = {
    id: string;
    name: string;
    description: string;
};

// Create an access token for calling apis
export async function createAccessToken(audience: string): Promise<string> {
    try {
        const response = await axios.post<AccessTokenResponse>(
            `${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token`,
            new URLSearchParams({
                grant_type: "client_credentials",
                client_id: process.env.AUTH0_CLIENT_ID!,
                client_secret: process.env.AUTH0_CLIENT_SECRET!,
                audience: audience,
            }),
            {
                headers: {
                    "content-type": "application/x-www-form-urlencoded",
                },
            }
        );

        return response.data.access_token;
    } catch (error) {
        throw new Error("Failed to get Auth0 management token", { cause: error });
    }
}

// Get the roles for the current user in Auth0 Management API
export async function getUsersRoles(userId: string): Promise<Role[]> {
    const token = await createAccessToken(process.env.AUTH0_IAM_API_AUDIENCE!);

    const response = await fetch(`${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/users/${userId}/roles`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch user roles");
    }

    const data: Role[] = await response.json();
    return data;
}

// Check if the current user is an admin
export async function isUserInRole(
    userId: string,
    role: "superadmin" | "admin" | "teamlead" | "employee"
): Promise<boolean> {
    try {
        const roles = await getUsersRoles(userId);
        return roles.some((r) => r.name.toLowerCase() === role);
    } catch (error) {
        console.error("Error checking admin status:", error);
        return false;
    }
}
