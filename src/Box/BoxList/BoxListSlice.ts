import { createSlice } from "@reduxjs/toolkit";
import { stat } from 'fs';
import { emptyGyigyet } from "./BoxListType";

const BoxListSlice = createSlice({
    name: 'boxList',
    initialState: emptyGyigyet,
    reducers: {
      getAllBoxes:  (state, action) => { return state; },
      setAllBoxes:  (state, action) => { return state = action.payload; },
      //TODO: GetallUsers w/ Filters
      /*
      setCurrentUser:  (state, action) => { return state; },
      getSpecifiedUser:(state, action) => { return state; },
      setSpecifiedUser:(state, action) => { return state; },
      */
    },
    extraReducers: {
      createBox: (state, action) => { 
         state.push(action.payload);
        return state
      },
    }
});

export const {
  actions: boxListActions,
  reducer: boxListReducer,
} = BoxListSlice;

export default BoxListSlice;