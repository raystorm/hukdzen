import { createSlice } from "@reduxjs/toolkit";

const BoxUserListSlice = createSlice({
    name: 'boxUserList',
    initialState: { }, //emptyBoxList,
    reducers: {
      getAllBoxUsers:             (state, action) => { return state; },
      getAllBoxUsersForUser:      (state, action) => { return state; },
      getAllBoxUsersForUserId:    (state, action) => { return state; },
      getAllBoxUsersForBox:       (state, action) => { return state; },
      getAllBoxUsersForBoxId:     (state, action) => { return state; },
      getAllBoxUsersForBoxRole:   (state, action) => { return state; },
      getAllBoxUsersForBoxRoleId: (state, action) => { return state; },
      setAllBoxUsers:             (state, action) => { return action.payload; },
    },
    extraReducers: {
      createBox: (state, action) => { 
         state.items.push(action.payload);
         return state
      },
    }
});

export const {
  actions: boxUserListActions,
  reducer: boxUserListReducer,
} = BoxUserListSlice;

export default BoxUserListSlice;