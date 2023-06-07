import { createSlice } from "@reduxjs/toolkit";
import {boxRoleActions} from "../BoxRoleSlice";
import { BoxRole } from '../BoxRoleType';

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
    extraReducers: (builder) => {
       builder
         .addCase(boxRoleActions.createBoxRole,
                  (state, action) => {
                    state.items.push(action.payload);
                    return state;
                  })
          .addCase(boxRoleActions.removeBoxRole,
                   (state, action) => {
                     state.items.filter((br: BoxRole) => br.id !== action.payload.id);
                     return state;
                   })
    }
    /*
    {
        createBoxRole: (state, action) => {
          state.items.push(action.payload);
          return state
        },
    }
    */
});

export const {
  actions: boxRoleListActions,
  reducer: boxRoleListReducer,
} = BoxRoleListSlice;

export default BoxRoleListSlice;