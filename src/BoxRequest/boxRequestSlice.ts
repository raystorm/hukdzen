import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { BoxRequest } from "./boxRequestType";
import { emptyBoxRequest } from "./boxRequestType";

const boxRequestSlice = createSlice({
    name: 'boxRequest',
    initialState: emptyBoxRequest,
    reducers: {
      getBoxRequestById: (state, action: PayloadAction<string>) => { return state; },
      setBoxRequest:     (state, action: PayloadAction<BoxRequest>)  => { return action.payload; },
      createBoxRequest:  (state, action: PayloadAction<BoxRequest>)  => { return action.payload; },
      boxRequestCreated: (state, action: PayloadAction<BoxRequest>)  => { return action.payload; },
      updateBoxRequest:  (state, action: PayloadAction<BoxRequest>)  => { return action.payload; },
      approveBoxRequest: (state, action: PayloadAction<BoxRequest>)  => { return action.payload; },
      denyBoxRequest:    (state, action: PayloadAction<BoxRequest>)  => { return action.payload; },
      boxRequestClosed:  (state, action: PayloadAction<BoxRequest>)  => { return action.payload; },
    }
});

export const { 
  actions: boxRequestActions,
  reducer: boxRequestReducer,
} = boxRequestSlice;

export default boxRequestSlice;