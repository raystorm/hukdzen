import { createSlice } from "@reduxjs/toolkit";
import { emptyGyet } from "./userType";

const currentUserSlice = createSlice({
    name: 'currentUser',
    initialState: emptyGyet,
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