import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {emptyUser, User} from "./userType";
import {userActions} from "./userSlice";

const currentUserSlice = createSlice({
    name: 'currentUser',
    initialState: emptyUser,
    reducers: {
      signIn:  (state, action) => { return state; },
      signOut: (state) => { return emptyUser; },
      setCurrentUser: (state, action: PayloadAction<User>) => { return action.payload; },
    },
    extraReducers: (builder) => {
      builder
         .addMatcher((action) => {
                     return [userActions.setUser.type,
                             userActions.updateUserSuccess.type,
                             userActions.createUserSuccess.type,
                            ].includes(action.type) },
                     (state, action: PayloadAction<User>) => {
                       if ( action.payload &&
                            ( state.id === action.payload.id || emptyUser === state) )
                       { return action.payload; }
                       return state;
                     })
    }
});

export const { 
  actions: currentUserActions, 
  reducer: currentUserReducer, 
} = currentUserSlice;

export default currentUserSlice;