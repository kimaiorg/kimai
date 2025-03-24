"use client";
import { useQuery } from "@tanstack/react-query";
import { commonOptions } from "@/lib/react-query/options";
import { callGettingUserInfoRequest } from "@/api/user.api";

export function useCachedUserInfo() {
    return useQuery({
        queryKey: ["user-info"],
        queryFn: () => {
            return callGettingUserInfoRequest();
        },
        throwOnError: true,
        ...commonOptions
    });
}
