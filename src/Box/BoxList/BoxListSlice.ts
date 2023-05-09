import { createSlice } from "@reduxjs/toolkit";
import { emptyBoxList } from "./BoxListType";

const BoxListSlice = createSlice({
    name: 'boxList',
    initialState: emptyBoxList,
    reducers: {
      getAllBoxes:  (state, action) => { },
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