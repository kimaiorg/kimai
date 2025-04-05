import { UserType } from "@/type_schema/user.schema";
import { createSlice, Slice } from "@reduxjs/toolkit";

export type UserState = UserType | null;

const userListSlice: Slice<any> = createSlice({
  name: "users",
  initialState: {
    users: []
  },
  reducers: {
    updateUserList(state, action) {
      state.users = [...action.payload];
    }
  }
});
export const { updateUserList } = userListSlice.actions;
export const getUserById = (userId: string): UserType =>
  userListSlice.getInitialState().users.find((user: UserType) => user.user_id === userId);
export default userListSlice.reducer;
