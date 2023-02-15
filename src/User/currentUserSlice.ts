import { createSlice } from "@reduxjs/toolkit";
import {emptyGyet, initGyet} from "./userType";

const currentUserSlice = createSlice({
    name: 'currentUser',
    initialState: initGyet, //emptyGyet,
    reducers: {
      getCurrentUser:  (state, action) => { return state; },
      setCurrentUser:  (state, action) => { return state; },
    }
});

export const { 
  actions: currentUserActions, 
  reducer: currentUserReducer, 
} = currentUserSlice;

export default currentUserSlice;