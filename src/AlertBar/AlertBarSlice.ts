import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { AlertMessage } from "./AlertBarTypes";
import { emptyAlert } from "./AlertBarTypes";


const alertBarSlice = createSlice({
   name: 'alertMessage',
   initialState: emptyAlert,
   reducers:  {
      DisplayAlertBox: (state, action: PayloadAction<AlertMessage>) => {
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