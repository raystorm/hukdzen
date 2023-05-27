import { createSlice } from "@reduxjs/toolkit";
import {emptyGyet, Gyet} from "./userType";


const userSlice = createSlice({
    name: 'user',
    initialState: emptyGyet,
    reducers: {
      getUser:     (state, action) => { return state; },
      getUserById: (state, action) => { return state; },
      setUser:     (state, action) => { return action.payload; },
      updateUser:  (state, action) => { return action.payload; },
      //{ copyUser(state, action.payload) },
      /*
      {
         if ( action.payload?.data?.updateGyet )
         { return action.payload.data.updateGyet; }
         return action.payload;
      }, */
      createUser:  (state, action) => { return action.payload; },
      clearUser:   (state) => { return emptyGyet; },
    }
});

export const {
   actions: userActions,
   reducer: userReducer,
} = userSlice;

export default userSlice;