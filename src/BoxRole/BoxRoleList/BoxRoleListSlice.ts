import { createSlice } from "@reduxjs/toolkit";

const BoxRoleListSlice = createSlice({
    name: 'boxRoleList',
    initialState: { }, //emptyBoxList,
    reducers: {
      getAllBoxRoles:         (state, action) => { return state; },
      getAllBoxRolesForBox:   (state, action) => { return state; },
      getAllBoxRolesForBoxId: (state, action) => { return state; },
      getAllBoxRolesForRole:  (state, action) => { return state; },
      setAllBoxRoles:         (state, action) => { return action.payload; },
    },
    extraReducers: {
      createBoxRole: (state, action) => {
         state.items.push(action.payload);
         return state
      },
    }
});

export const {
  actions: boxRoleListActions,
  reducer: boxRoleListReducer,
} = BoxRoleListSlice;

export default BoxRoleListSlice;