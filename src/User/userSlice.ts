import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {emptyUser, User, initialUserState} from "./userType";
import {currentUserActions} from "./currentUserSlice";


const userSlice = createSlice({
    name: 'user',
    initialState: initialUserState,
    reducers: {
      getUserById: (state, action: PayloadAction<string>) => { state.error = null; },
      getUserByIdSuccess: (state, action: PayloadAction<User>) => {
         state.user  = action.payload;
         state.error = null;
      },
      getUserByIdFailure: (state, action: PayloadAction<string>) => {
         state.error = action.payload;
      },
      setUser:     (state, action: PayloadAction<User>) => {
         state.user  = action.payload;
         state.error = null;
      },
      createUser:  (state, action: PayloadAction<User>) => { state.error = null; },
      createUserSuccess: (state, action: PayloadAction<User>) => {
         state.user  = action.payload;
         state.error = null;
      },
      createUserFailure: (state, action: PayloadAction<string>) => {
         state.error = action.payload;
      },
      updateUser:  (state, action: PayloadAction<User>) => { state.error = null; },
      updateUserSuccess: (state, action: PayloadAction<User>) => {
         state.user  = action.payload;
         state.error = null;
      },
      updateUserFailure: (state, action: PayloadAction<string>) => {
         state.error = action.payload;
      },
      removeUser:  (state, action: PayloadAction<User>) => { state.error = null; },
      removeUserSuccess: (state) => {
         state.user  = emptyUser;
         state.error = null;
      },
      removeUserFailure: (state, action: PayloadAction<string>) => {
         state.error = action.payload;
      },
      clearUser:   (state) => {
         state.user  = emptyUser;
         state.error = null;
      },
      promptForUserInfo: (state, action: PayloadAction<User>) => {
         state.user = action.payload;
      }
    },
    extraReducers: (builder) => {
      builder
        .addCase(currentUserActions.signOut, (state) => initialUserState)
    }
});

export const {
   actions: userActions,
   reducer: userReducer,
} = userSlice;

export default userSlice;