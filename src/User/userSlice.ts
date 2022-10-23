import { createSlice } from "@reduxjs/toolkit";
import { emptyGyet } from "./userType";

const userSlice = createSlice({
    name: 'user',
    initialState: emptyGyet,
    reducers: {
      getCurrentUser:  (state, action) => { return state; },
      setCurrentUser:  (state, action) => { return state; },
      getSpecifiedUser:(state, action) => { return state; },
      setSpecifiedUser:(state, action) => { return state; },
    }
});

export const { actions: userActions, reducer: userReducer, } = userSlice;

export default userSlice;