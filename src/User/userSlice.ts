import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {emptyUser, User} from "./userType";


const userSlice = createSlice({
    name: 'user',
    initialState: emptyUser,
    reducers: {
      getUser:     (state, action: PayloadAction<User>) => { return state; },
      getUserById: (state, action: PayloadAction<string>) => { return state; },
      setUser:     (state, action: PayloadAction<User>) => { return action.payload; },
      createUser:  (state, action: PayloadAction<User>) => { return action.payload; },
      updateUser:  (state, action: PayloadAction<User>) => { return action.payload; },
      removeUser:  (state, action: PayloadAction<User>) => { return emptyUser; },
      clearUser:   (state) => { return emptyUser; },
    }
});

export const {
   actions: userActions,
   reducer: userReducer,
} = userSlice;

export default userSlice;