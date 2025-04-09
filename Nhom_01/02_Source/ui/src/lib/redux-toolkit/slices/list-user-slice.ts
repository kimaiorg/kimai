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
export default userListSlice.reducer;
