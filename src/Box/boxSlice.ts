import { createSlice } from "@reduxjs/toolkit";
import { initialXbiis } from "./boxTypes";

const boxSlice = createSlice({
    name: 'box',
    initialState: initialXbiis,
    reducers: {
      getBox:     (state, action) => { return state; },
      getBoxById: (state, action) => { return state; },
      setBox:     (state, action) => { return action.payload; },
      createBox:  (state, action) => { return action.payload; },
      updateBox:  (state, action) => { return action.payload; },
    }
});

export const { 
  actions: boxActions, 
  reducer: boxReducer, 
} = boxSlice;

export default boxSlice;