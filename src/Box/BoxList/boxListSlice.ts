import { createSlice } from "@reduxjs/toolkit";
import { emptyGyigyet } from "./boxListType";

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
    }
});

export const {
  actions: boxListActions,
  reducer: boxListReducer,
} = BoxListSlice;

export default BoxListSlice;