import { createSlice } from "@reduxjs/toolkit";
import { emptyGyet } from "./userType";

const userSlice = createSlice({
    name: 'user',
    initialState: emptyGyet,
    reducers: {
      getSpecifiedUser:     (state, action) => { return state; },
      getSpecifiedUserById: (state, action) => { return state; },      
      setSpecifiedUser:     (state, action) => { return state = action.payload; },      
      updateSpecifiedUser:  (state, action) => { return state = action.payload; },
      createUser:           (state, action) => { return state = action.payload; },
      clearUser:            (state) => { return emptyGyet; },
    }
});

export const { actions: userActions, reducer: userReducer, } = userSlice;

export default userSlice;