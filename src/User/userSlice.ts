import { createSlice } from "@reduxjs/toolkit";
import {emptyUser, User} from "./userType";


const userSlice = createSlice({
    name: 'user',
    initialState: emptyUser,
    reducers: {
      getUser:     (state, action) => { return state; },
      getUserById: (state, action) => { return state; },
      setUser:     (state, action) => { return action.payload; },
      updateUser:  (state, action) => { return action.payload; },
      createUser:  (state, action) => { return action.payload; },
      clearUser:   (state) => { return emptyUser; },
    }
});

export const {
   actions: userActions,
   reducer: userReducer,
} = userSlice;

export default userSlice;