import { myAxios } from "@/api/axios";
import { ErrorResponseType, SuccessResponseType } from "@/type_schema/common";
import { RoleType } from "@/type_schema/role";
import { UserType } from "@/type_schema/user.schema";

export const callGettingUserInfoRequest = async (): Promise<UserType | ErrorResponseType> => {
    try {
        return fakeUser();
        if (!localStorage.getItem("accessToken"))
            return {
                statusCode: 401,
                message: "Unauthorized",
                // timestamp: new Date().toISOString(),
                // path: "/user/info",
                errorCode: "not-authorized",
            };
        const response = await myAxios.get(`/user/info`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        });
        console.log(response);
        if (response.status == 401) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            return response.data as ErrorResponseType;
        } else if (response.status != 200) {
            return response.data as ErrorResponseType;
        }
        const result = response.data as SuccessResponseType<UserType, null>;
        return result.data;
    } catch (error: any) {
        if (error.status == 401) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
        }
        return error.response.data as ErrorResponseType;
    }
};

function fakeUser(): UserType {
    return {
        username: localStorage.getItem("username") || "admin",
        email: localStorage.getItem("email") || "admin@gmail.com",
        role: localStorage.getItem("role") || "admin",
        name: localStorage.getItem("name") || "Super Admin",
        status: true,
        createdAt: new Date().toISOString(),
        id: "1",
    };
}

export const callGettingUserProfileRequest = async (userId: string): Promise<UserType | ErrorResponseType> => {
    try {
        console.log("call getting user info");
        if (!localStorage.getItem("accessToken"))
            return {
                statusCode: 401,
                message: "Unauthorized",
                // timestamp: new Date().toISOString(),
                // path: "/user/info",
                errorCode: "not-authorized",
            };
        const response = await myAxios.get(`/user/info/${userId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        });
        console.log(response);
        if (response.status == 401) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            return response.data as ErrorResponseType;
        } else if (response.status != 200) {
            return response.data as ErrorResponseType;
        }
        const result = response.data as SuccessResponseType<UserType, null>;
        return result.data;
    } catch (error: any) {
        if (error.status == 401) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
        }
        return error.response.data as ErrorResponseType;
    }
};

export const callGettingRoleAndPermissionRequest = async (): Promise<RoleType[] | ErrorResponseType> => {
    try {
        console.log("call getting all roles and permissions");
        if (!localStorage.getItem("accessToken"))
            return {
                statusCode: 401,
                message: "Unauthorized",
                // timestamp: new Date().toISOString(),
                // path: "/user/info",
                errorCode: "not-authorized",
            };
        const response = await myAxios.get(`/role/all`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        });
        console.log(response);
        if (response.status == 401) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            return response.data as ErrorResponseType;
        } else if (response.status != 200) {
            return response.data as ErrorResponseType;
        }
        const result = response.data as SuccessResponseType<RoleType[], null>;
        return result.data;
    } catch (error: any) {
        if (error.status == 401) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
        }
        return error.response.data as ErrorResponseType;
    }
};

export const callGettingUserListRequest = async (
    page: number,
    size: number
): Promise<UserType[] | ErrorResponseType> => {
    try {
        console.log("call getting all user");
        return [
            {
                id: "1",
                username: "john",
                email: "john_cena@gmail",
                role: "admin",
                name: "John Cena",
                status: true,
                createdAt: new Date().toISOString(),
            },
            {
                id: "2",
                username: "jane",
                email: "jane_doe@gmail",
                role: "employee",
                name: "Jane Collow",
                status: true,
                createdAt: new Date().toISOString(),
            },
            {
                id: "3",
                username: "jane",
                email: "jane_doe@gmail",
                role: "teamlead",
                name: "Mercy Doe",
                status: true,
                createdAt: new Date().toISOString(),
            },
            {
                id: "4",
                username: "jane",
                email: "jane_doe@gmail",
                role: "admin",
                name: "Sally Doe",
                status: true,
                createdAt: new Date().toISOString(),
            },
            {
                id: "5",
                username: "jane",
                email: "jane_doe@gmail",
                role: "employee",
                name: "King Jack",
                status: true,
                createdAt: new Date().toISOString(),
            },
            {
                id: "6",
                username: "jane",
                email: "jane_doe@gmail",
                role: "teamlead",
                name: "Jack Doe",
                status: true,
                createdAt: new Date().toISOString(),
            },
            {
                id: "7",
                username: "jane",
                email: "jane_doe@gmail",
                role: "admin",
                name: "Harry Potter",
                status: true,
                createdAt: new Date().toISOString(),
            },
            {
                id: "8",
                username: "jane",
                email: "jane_doe@gmail",
                role: "employee",
                name: "Donald Trump",
                status: true,
                createdAt: new Date().toISOString(),
            },
        ];
        if (!localStorage.getItem("accessToken"))
            return {
                statusCode: 401,
                message: "Unauthorized",
                // timestamp: new Date().toISOString(),
                // path: "/user/info",
                errorCode: "not-authorized",
            };
        const response = await myAxios.get(`/user/all?page=${page}&size=${size}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        });
        console.log(response);
        if (response.status == 401) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            return response.data as ErrorResponseType;
        } else if (response.status != 200) {
            return response.data as ErrorResponseType;
        }
        const result = response.data as SuccessResponseType<UserType[], null>;
        return result.data;
    } catch (error: any) {
        if (error.status == 401) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
        }
        return error.response.data as ErrorResponseType;
    }
};

// export const callActivateAccountRequest = async (
//     token: string
// ): Promise<SuccessResponseType<LoginResponseDTO, null> | ErrorResponseType> => {
//     try {
//         const response = await myAxios.get(`/auth/activate?token=${token}`);
//         console.log(response);
//         if (response.status !== 200) return response.data as ErrorResponseType;
//         const result = response.data as SuccessResponseType<LoginResponseDTO, null>;
//         return result;
//     } catch (error: any) {
//         return error.response.data as ErrorResponseType;
//     }
// };
