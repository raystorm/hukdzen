import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {emptyUser, User} from "./userType";


const userSlice = createSlice({
    name: 'user',
    initialState: emptyUser,
    reducers: {
      getUserById: (state, action: PayloadAction<string>) => { return state; },
      setUser:     (state, action: PayloadAction<User>) => { return action.payload; },
      createUser:  (state, action: PayloadAction<User>) => { return action.payload; },
      updateUser:  (state, action: PayloadAction<User>) => { return action.payload; },
      removeUser:  (state, action: PayloadAction<User>) => { return emptyUser; },
      clearUser:   (state) => { return emptyUser; },
      promptForUserInfo: (state, action: PayloadAction<User>) => { return action.payload; }
    }
});

export const {
   actions: userActions,
   reducer: userReducer,
} = userSlice;

export default userSlice;