import { createSlice, isAnyOf, PayloadAction } from "@reduxjs/toolkit";
import { boxRequestActions } from "../boxRequestSlice";
import type { BoxRequestList } from "./BoxRequestListType";
import { emptyBoxRequestList } from "./BoxRequestListType";
import { User } from "../../User/userType";
import { BoxRequest } from "../../types/AmplifyTypes";

const BoxRequestListSlice = createSlice({
    name: 'boxRequestList',
    initialState: emptyBoxRequestList,
    reducers: {
      getAllPendingBoxRequests: (st, action: PayloadAction<User>) => { return st; },
      getAllClosedBoxRequests: (st, action: PayloadAction<User>) => { return st; },
      setAllBoxRequests: (st, action: PayloadAction<BoxRequestList>) =>
                         { return action.payload; },
    },
    extraReducers: (builder) =>
    {
       builder
         .addCase(boxRequestActions.createBoxRequestSuccess,
                  (state, action) => {
                     state.items.push(action.payload);
                     return state;
                  })
         .addCase(boxRequestActions.updateBoxRequestSuccess,
                  (state, action: PayloadAction<BoxRequest>) => {
                     const index = state.items.findIndex(br => br?.id ===action.payload.id);
                     if ( -1 < index ) { state.items[index] = action.payload }
                     return state;
                  })
          .addMatcher(isAnyOf(boxRequestActions.approveBoxRequestSuccess,
                              boxRequestActions.denyBoxRequestSuccess),
                      (state, action) =>
         {
            state.items = state.items.filter(br => br?.id !== action.payload.id);
            return state;
         })
    }
});

export const {
  actions: boxRequestListActions,
  reducer: boxRequestListReducer,
} = BoxRequestListSlice;

export default BoxRequestListSlice;