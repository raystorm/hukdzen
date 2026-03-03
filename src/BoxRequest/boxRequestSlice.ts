import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { BoxRequest } from "./boxRequestType";
import { initialBoxRequestState } from "./boxRequestType";

const boxRequestSlice = createSlice({
    name: 'boxRequest',
    initialState: initialBoxRequestState,
    reducers: {
      getBoxRequestById: (state, action: PayloadAction<string>) => {
         state.error = null;
      },
      getBoxRequestByIdSuccess: (state, action: PayloadAction<BoxRequest>) => {
         state.item = action.payload;
         state.error = null;
      },
      getBoxRequestByIdFailure: (state, action: PayloadAction<string>) => {
         state.error = action.payload;
      },
      createBoxRequest: (state, action: PayloadAction<BoxRequest>) => {
         state.error = null;
      },
      createBoxRequestSuccess: (state, action: PayloadAction<BoxRequest>) => {
         state.item = action.payload;
         state.error = null;
      },
      createBoxRequestFailure: (state, action: PayloadAction<string>) => {
         state.error = action.payload;
      },
      updateBoxRequest: (state, action: PayloadAction<BoxRequest>) => {
         state.error = null;
      },
      updateBoxRequestSuccess: (state, action: PayloadAction<BoxRequest>) => {
         state.item = action.payload;
         state.error = null;
      },
      updateBoxRequestFailure: (state, action: PayloadAction<string>) => {
         state.error = action.payload;
      },
      approveBoxRequest: (state, action: PayloadAction<BoxRequest>) => {
         state.error = null;
      },
      approveBoxRequestSuccess: (state, action: PayloadAction<BoxRequest>) => {
         state.item = action.payload;
         state.error = null;
      },
      approveBoxRequestFailure: (state, action: PayloadAction<string>) => {
         state.error = action.payload;
      },
      denyBoxRequest: (state, action: PayloadAction<BoxRequest>) => {
         state.error = null;
      },
      denyBoxRequestSuccess: (state, action: PayloadAction<BoxRequest>) => {
         state.item = action.payload;
         state.error = null;
      },
      denyBoxRequestFailure: (state, action: PayloadAction<string>) => {
         state.error = action.payload;
      },
    }
});

export const { 
  actions: boxRequestActions,
  reducer: boxRequestReducer,
} = boxRequestSlice;

export default boxRequestSlice;