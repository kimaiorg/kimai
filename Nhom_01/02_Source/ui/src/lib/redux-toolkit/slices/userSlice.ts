// todoSlice.js
import { RoleType } from "@/type_schema/role";
import { UserType } from "@/type_schema/user.schema";
import { createSlice, Slice } from "@reduxjs/toolkit";

const persistedStateName = "persist:root";

export type UserState = UserType | null;

const userSlice: Slice<any> = createSlice({
    name: "user",
    initialState: {
        user: null,
        roles: [],
    },
    reducers: {
        updateUser(state, action) {
            state.user = state.user ? { ...state.user, ...action.payload } : { ...action.payload };
        },
        updateRole(state, action) {
            state.roles = action.payload as RoleType[];
        },
    },
});
export const { updateUser, updateRole } = userSlice.actions;
export default userSlice.reducer;
