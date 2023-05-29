import {createSlice, Draft} from "@reduxjs/toolkit";
import {emptyGyet, Gyet, initGyet} from "./userType";
import userSlice, {userActions} from "./userSlice";

const currentUserSlice = createSlice({
    name: 'currentUser',
    initialState: emptyGyet,
    reducers: {
      getCurrentUser: (state, action) => { return state; },
      setCurrentUser: (state, action) => { return action.payload; },
    },
    extraReducers: (builder) => {
      builder.addMatcher((action) => {
                           return [
                              userActions.setUser.type,
                              userActions.updateUser.type,
                              userActions.createUser.type,
                           ].includes(action.type) },
                         (state, action) => {
                           if (state.id === action.payload.id)
                           { return action.payload; }
                           return state;
                         })
      /*
      [userActions.setUser.type]: (state, action) => {
         if (state.id === action.payload.id) { return action.payload; }
         return state;
      }
      */
    }
});

export const { 
  actions: currentUserActions, 
  reducer: currentUserReducer, 
} = currentUserSlice;

export default currentUserSlice;