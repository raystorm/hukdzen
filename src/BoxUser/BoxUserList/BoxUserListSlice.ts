import { createSlice } from "@reduxjs/toolkit";
import {emptyBoxUserList} from "./BoxUserListType";
import {boxUserActions} from "../BoxUserSlice";
import {BoxUser} from "../BoxUserType";

const BoxUserListSlice = createSlice({
    name: 'boxUserList',
    initialState: emptyBoxUserList,
    reducers: {
      getAllBoxUsers:             (state, action) => { return state; },
      getAllBoxUsersForUser:      (state, action) => { return state; },
      getAllBoxUsersForUserId:    (state, action) => { return state; },
      getAllBoxUsersForBox:       (state, action) => { return state; },
      getAllBoxUsersForBoxId:     (state, action) => { return state; },
      setAllBoxUsers:             (state, action) => { return action.payload; },
      updateAllBoxUsersForUser:   (state, action) => { return action.payload; },
      removeAllBoxUsersForUser:   (state, action) => { return emptyBoxUserList },
      removeAllBoxUsersForUserId: (state, action) => { return emptyBoxUserList },
      removeAllBoxUsersForBox:    (state, action) => { return emptyBoxUserList },
      removeAllBoxUsersForBoxId:  (state, action) => { return emptyBoxUserList },
    },
    extraReducers: (builder) => {
       builder
          .addCase(boxUserActions.createBoxUser,
                   (state, action) => {
                     state.items.push(action.payload);
                     return state
                   })
          .addCase(boxUserActions.updateBoxUser,
                   (state, action) => {
                      const index = state.items.findIndex((bu: BoxUser) =>
                                                          bu.id === action.payload.id)
                      state.items[index] = action.payload;
                      return state
                   })
          .addCase(boxUserActions.removeBoxUser,
                   (state, action) => {
                      state.items.filter((bu: BoxUser) => bu.id !== action.payload.id)
                      return state
                   })
    }
});

export const {
  actions: boxUserListActions,
  reducer: boxUserListReducer,
} = BoxUserListSlice;

export default BoxUserListSlice;