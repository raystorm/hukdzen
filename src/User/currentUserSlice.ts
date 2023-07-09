import {createSlice, Draft, PayloadAction} from "@reduxjs/toolkit";
import {emptyUser, User, initUser} from "./userType";
import userSlice, {userActions} from "./userSlice";

const currentUserSlice = createSlice({
    name: 'currentUser',
    initialState: emptyUser,
    reducers: {
      signIn: (state, action) => { return state; },
      getCurrentUser: (state) => { return state; },
      setCurrentUser: (state, action: PayloadAction<User>) => { return action.payload; },
    },
    extraReducers: (builder) => {
      builder
         .addMatcher((action) => {
                     return [userActions.setUser.type,
                             userActions.updateUser.type,
                             userActions.createUser.type,
                            ].includes(action.type) },
                     (state, action) => {
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