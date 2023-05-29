import { createSlice } from "@reduxjs/toolkit";
import {emptyBoxUserList} from "./BoxUserListType";

const BoxUserListSlice = createSlice({
    name: 'boxUserList',
    initialState: emptyBoxUserList,
    reducers: {
      getAllBoxUsers:             (state, action) => { return state; },
      getAllBoxUsersForUser:      (state, action) => { return state; },
      getAllBoxUsersForUserId:    (state, action) => { return state; },
      getAllBoxUsersForBox:       (state, action) => { return state; },
      getAllBoxUsersForBoxId:     (state, action) => { return state; },
      getAllBoxUsersForBoxRole:   (state, action) => { return state; },
      getAllBoxUsersForBoxRoleId: (state, action) => { return state; },
      setAllBoxUsers:             (state, action) => { return action.payload; },
      updateAllBoxUsersForUser:   (state, action) => { return action.payload; },
      removeAllBoxUsersForUser:   (state, action) => { return emptyBoxUserList },
      removeAllBoxUsersForUserId: (state, action) => { return emptyBoxUserList },
      removeAllBoxUsersForBox:    (state, action) => { return emptyBoxUserList },
      removeAllBoxUsersForBoxId:  (state, action) => { return emptyBoxUserList },
    },
    extraReducers: {
      createBox: (state, action) => { 
         state.items.push(action.payload);
         return state
      },
      //TODO: CRUD - UPDATE and DELETE
    }
});

export const {
  actions: boxUserListActions,
  reducer: boxUserListReducer,
} = BoxUserListSlice;

export default BoxUserListSlice;