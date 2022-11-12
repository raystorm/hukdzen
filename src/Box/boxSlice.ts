import { createSlice } from "@reduxjs/toolkit";
import { initialXbiis } from "./boxTypes";

const boxSlice = createSlice({
    name: 'box',
    initialState: initialXbiis,
    reducers: {
      createBox:           (state, action) => { return state = action.payload; }, 
      getSpecifiedBox:     (state, action) => { return state; },
      getSpecifiedBoxById: (state, action) => { return state; },      
      setSpecifiedBox:     (state, action) => { return state = action.payload; },
    }
});

export const { 
  actions: boxActions, 
  reducer: boxReducer, 
} = boxSlice;

export default boxSlice;