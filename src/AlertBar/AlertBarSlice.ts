import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { Alert } from "./AlertBarTypes";
import { emptyAlert } from "./AlertBarTypes";


const alertBarSlice = createSlice({
   name: 'alertMessage',
   initialState: emptyAlert,
   reducers:  {
      DisplayAlertBox: (state, action: PayloadAction<Alert>) => {
         return { ...action.payload, open: true}
      },
      HideAlertBox:    (state) => { return emptyAlert },
   }
});

export const {
   actions: alertBarActions,
   reducer: alertBarReducer,
} = alertBarSlice;

export default alertBarSlice;