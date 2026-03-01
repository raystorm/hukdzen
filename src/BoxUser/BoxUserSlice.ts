import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {BoxUser, emptyBoxUser, initialBoxUserState} from "./BoxUserType";


const BoxUserSlice = createSlice({
   name: 'boxUser',
   initialState: initialBoxUserState,
   reducers: {
      getBoxUserById:    (state, action: PayloadAction<string> ) => { return state; },
      setBoxUser:        (state, action: PayloadAction<BoxUser>) => { 
         state.item  = action.payload;
         state.error = null;
      },
      createBoxUser:     (state, action: PayloadAction<BoxUser>) => { 
         state.error = null;
      },
      createBoxUserSuccess: (state, action: PayloadAction<BoxUser>) => {
         state.item  = action.payload;
         state.error = null;
      },
      createBoxUserFailure: (state, action: PayloadAction<string>) => {
         state.error = action.payload;
      },
      updateBoxUser:     (state, action: PayloadAction<BoxUser>) => { 
         state.error = null;
      },
      updateBoxUserSuccess: (state, action: PayloadAction<BoxUser>) => {
         state.item  = action.payload;
         state.error = null;
      },
      updateBoxUserFailure: (state, action: PayloadAction<string>) => {
         state.error = action.payload;
      },
      removeBoxUser:     (state, action: PayloadAction<BoxUser>) => { 
         state.error = null;
      },
      removeBoxUserSuccess: (state) => {
         state.item  = emptyBoxUser;
         state.error = null;
      },
      removeBoxUserFailure: (state, action: PayloadAction<string>) => {
         state.error = action.payload;
      },
      removeBoxUserById: (state, action: PayloadAction<string> ) => { 
         state.error = null;
      },
      removeBoxUserByIdSuccess: (state) => {
         state.item  = emptyBoxUser;
         state.error = null;
      },
      removeBoxUserByIdFailure: (state, action: PayloadAction<string>) => {
         state.error = action.payload;
      },
   }
});

export const {
   actions: boxUserActions,
   reducer: boxUserReducer
} = BoxUserSlice;

export default BoxUserSlice;