import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import { emptyUserList } from "./userListType";
import {userActions} from "../userSlice";
import {User} from "../userType";

const UserListSlice = createSlice({
    name: 'userList',
    initialState: emptyUserList,
    reducers: {
      getAllUsers:  (state) => { return state; },
      setAllUsers:  (state, action) => { return action.payload; },
    },
    extraReducers: (builder) =>
    {
       builder
          .addCase(userActions.removeUser, (state, action: PayloadAction<User>) =>
                  {
                     console.log(`removing from user list: ${JSON.stringify(action.payload)}`);
                     state.items = state.items.filter((user) => user.id !== action.payload.id);
                     //console.log(`remaining list: ${JSON.stringify(state)}`);
                     return state;
                  })
          .addCase(userActions.createUser, (state, action: PayloadAction<User>) =>
                   {
                      state.items.push(action.payload);
                      return state;
                   })
          .addCase(userActions.updateUser, (state, action: PayloadAction<User>) =>
                   {
                      const index = state.items.findIndex(user => user.id ===action.payload.id);
                      if ( -1 < index ) { state.items[index] = action.payload }
                      return state;
                   })
       ;
    }
});

export const {
  actions: userListActions,
  reducer: userListReducer,
} = UserListSlice;

export default UserListSlice;