import { createSlice } from "@reduxjs/toolkit";
import { emptyBoxList } from "./BoxListType";

const BoxListSlice = createSlice({
    name: 'boxList',
    initialState: emptyBoxList,
    reducers: {
      getAllBoxes:  (state) => { return state; },
      setAllBoxes:  (state, action) => { return state = action.payload; },
    },
    extraReducers: {
      createBox: (state, action) => { 
         state.items.push(action.payload);
         return state
      },
    }
});

export const {
  actions: boxListActions,
  reducer: boxListReducer,
} = BoxListSlice;

export default BoxListSlice;