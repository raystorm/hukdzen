import { createSlice } from "@reduxjs/toolkit";
import {emptyGyet, initGyet} from "./userType";

const currentUserSlice = createSlice({
    name: 'currentUser',
    initialState: emptyGyet,
    reducers: {
      getCurrentUser:  (state, action) => { return state; },
      setCurrentUser:  (state, action) => { return state = action.payload; },
    }
});

export const { 
  actions: currentUserActions, 
  reducer: currentUserReducer, 
} = currentUserSlice;

export default currentUserSlice;