import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {emptyXbiis, initialXbiis, Xbiis} from "./boxTypes";

const boxSlice = createSlice({
    name: 'box',
    initialState: initialXbiis,
    reducers: {
      getBox:     (state, action: PayloadAction<Xbiis>) => { return state; },
      getBoxById: (state, action: PayloadAction<string>) => { return state; },
      setBox:     (state, action: PayloadAction<Xbiis>) => { return action.payload; },
      createBox:  (state, action: PayloadAction<Xbiis>) => { return action.payload; },
      updateBox:  (state, action: PayloadAction<Xbiis>) => { return action.payload; },
      removeBox:  (state, action: PayloadAction<Xbiis>) => { return emptyXbiis; },
    }
});

export const { 
  actions: boxActions, 
  reducer: boxReducer, 
} = boxSlice;

export default boxSlice;