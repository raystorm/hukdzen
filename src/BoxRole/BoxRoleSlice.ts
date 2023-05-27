import {createSlice} from "@reduxjs/toolkit";
import {emptyBoxRole} from "./BoxRoleType";


export const boxRoleSlice = createSlice({
   name: 'boxRole',
   initialState: emptyBoxRole,
   reducers: {
      getBoxRole:     (state, action) => { return state; },
      getBoxRoleById: (state, action) => { return state; },
      setBoxRole:     (state, action) => { return action.payload; },
      createBoxRole:  (state, action) => { return action.payload; },
      updateBoxRole:  (state, action) => { return action.payload; },
   }
});

export const {
   actions: boxRoleActions,
   reducer: boxRoleReducer
} = boxRoleSlice;

export default boxRoleSlice;