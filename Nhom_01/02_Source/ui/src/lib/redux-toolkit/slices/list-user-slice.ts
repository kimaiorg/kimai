import { RootState } from "@/lib/redux-toolkit/store";
import { UserType } from "@/type_schema/user.schema";
import { createSlice, Slice } from "@reduxjs/toolkit";

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
// Selector to get a user by ID
export const getUserById = (userId: string, state: RootState): UserType | undefined => {
  return state.userListState.users.find((user: UserType) => user.user_id === userId);
};
export default userListSlice.reducer;
