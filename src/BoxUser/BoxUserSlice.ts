import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {BoxUser, emptyBoxUser} from "./BoxUserType";


const BoxUserSlice = createSlice({
   name: 'boxUser',
   initialState: emptyBoxUser,
   reducers: {
      getBoxUserById:    (state, action: PayloadAction<string> ) => { return state; },
      setBoxUser:        (state, action: PayloadAction<BoxUser>) => { return action.payload; },
      createBoxUser:     (state, action: PayloadAction<BoxUser>) => { return action.payload; },
      updateBoxUser:     (state, action: PayloadAction<BoxUser>) => { return action.payload; },
      removeBoxUser:     (state, action: PayloadAction<BoxUser>) => { return emptyBoxUser; },
      removeBoxUserById: (state, action: PayloadAction<string> ) => { return emptyBoxUser; },
   }
});

export const {
   actions: boxUserActions,
   reducer: boxUserReducer
} = BoxUserSlice;

export default BoxUserSlice;