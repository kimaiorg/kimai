// todoSlice.js
import { RolePermissionType } from "@/type_schema/role";
import { UserType } from "@/type_schema/user.schema";
import { createSlice, Slice } from "@reduxjs/toolkit";

export type UserState = UserType | null;

const userSlice: Slice<any> = createSlice({
    name: "user",
    initialState: {
        user: null,
        privilege: {
            role: null,
            permissions: []
        }
    },
    reducers: {
        updateUser(state, action) {
            state.user = state.user ? { ...state.user, ...action.payload } : { ...action.payload };
        },
        updatePrivilege(state, action) {
            state.privilege = action.payload as RolePermissionType;
        }
    }
});
export const { updateUser, updatePrivilege } = userSlice.actions;
export default userSlice.reducer;
