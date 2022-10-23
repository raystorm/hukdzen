import { createSlice } from "@reduxjs/toolkit";
import { emptyGyigyet } from "./userListType";

const UserListSlice = createSlice({
    name: 'user',
    initialState: emptyGyigyet,
    reducers: {
      getAllUsers:  (state, action) => { return state; },
      /*
      setCurrentUser:  (state, action) => { return state; },
      getSpecifiedUser:(state, action) => { return state; },
      setSpecifiedUser:(state, action) => { return state; },
      */
    }
});

export const {
  actions: userListActions,
  reducer: userListReducers,
} = UserListSlice;

export default UserListSlice;