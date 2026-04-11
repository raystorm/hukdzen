import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {emptyUser, User, initialUserState} from "./userType";
import {currentUserActions} from "./currentUserSlice";


const userSlice = createSlice({
    name: 'user',
    initialState: initialUserState,
    reducers: {
      getUserById: (state, action: PayloadAction<string>) => { state.error = undefined; },
      getUserByIdSuccess: (state, action: PayloadAction<User>) => { return action.payload; },
      getUserByIdFailure: (state, action: PayloadAction<string>) => {
         state.error = action.payload;
      },
      setUser:     (state, action: PayloadAction<User>) => { return action.payload; },
      createUser:  (state, action: PayloadAction<User>) => { state.error = undefined; },
      createUserSuccess: (state, action: PayloadAction<User>) => {
         return action.payload;
      },
      createUserFailure: (state, action: PayloadAction<string>) => {
         state.error = action.payload;
      },
      updateUser:  (state, action: PayloadAction<User>) => { state.error = undefined; },
      updateUserSuccess: (state, action: PayloadAction<User>) => { return action.payload; },
      updateUserFailure: (state, action: PayloadAction<string>) => {
         state.error = action.payload;
      },
      removeUser:  (state, action: PayloadAction<User>) => { state.error = undefined; },
      removeUserSuccess: (state) => { return emptyUser; },
      removeUserFailure: (state, action: PayloadAction<string>) => {
         state.error = action.payload;
      },
      clearUser:   (state) => { return emptyUser; },
      promptForUserInfo: (state, action: PayloadAction<User>) => { return action.payload; }
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