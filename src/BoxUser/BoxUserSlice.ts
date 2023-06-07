import {createSlice} from "@reduxjs/toolkit";
import {emptyBoxUser} from "./BoxUserType";


const BoxUserSlice = createSlice({
   name: 'boxUser',
   initialState: emptyBoxUser,
   reducers: {
      getBoxUser:     (state, action) => { return state; },
      getBoxUserById: (state, action) => { return state; },
      setBoxUser:     (state, action) => { return action.payload; },
      createBoxUser:  (state, action) => { return action.payload; },
      updateBoxUser:  (state, action) => { return action.payload; },
      removeBoxUser:  (state, action) => { return emptyBoxUser; },
   }
});

export const {
   actions: boxUserActions,
   reducer: boxUserReducer
} = BoxUserSlice;

export default BoxUserSlice;