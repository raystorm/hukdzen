import { createSlice } from "@reduxjs/toolkit";
import { emptyUserList } from "./userListType";

const UserListSlice = createSlice({
    name: 'userList',
    initialState: emptyUserList,
    reducers: {
      getAllUsers:  (state, action) => { return state; },
      setAllUsers:  (state, action) => { return state = action.payload; },
      //TODO: GetallUsers w/ Filters
      getAllUsersForBoxId: (state, action) => { return state; },
    }
});

export const {
  actions: userListActions,
  reducer: userListReducer,
} = UserListSlice;

export default UserListSlice;