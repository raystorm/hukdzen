import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { Alert, AlertState } from "./AlertBarTypes";
import { emptyAlertState } from "./AlertBarTypes";


const alertBarSlice = createSlice({
   name: 'alertMessage',
   initialState: emptyAlertState,
   reducers:  {
      DisplayAlertBox: (state, action: PayloadAction<Alert>) => {
         state.queue.push({ ...action.payload, open: true });
      },
      HideAlertBox: (state) => { state.queue.shift(); },
   }
});

export const {
   actions: alertBarActions,
   reducer: alertBarReducer,
} = alertBarSlice;

export default alertBarSlice;