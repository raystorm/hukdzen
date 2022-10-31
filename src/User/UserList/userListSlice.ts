import { createSlice } from "@reduxjs/toolkit";
import { emptyGyigyet } from "./userListType";

const UserListSlice = createSlice({
    name: 'userList',
    initialState: emptyGyigyet,
    reducers: {
      getAllUsers:  (state, action) => { return state; },
      //TODO: GetallUsers w/ Filters
      /*
      setCurrentUser:  (state, action) => { return state; },
      getSpecifiedUser:(state, action) => { return state; },
      setSpecifiedUser:(state, action) => { return state; },
      */
    }
});

export const {
  actions: userListActions,
  reducer: userListReducer,
} = UserListSlice;

export default UserListSlice;