import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AlertBarProps} from "./AlertBarNotifier";
import {emptyAlert} from "./AlertBarTypes";



const alertBarSlice = createSlice({
   name: 'alertMessage',
   initialState: emptyAlert,
   reducers:  {
      DisplayAlertBox: (state, action: PayloadAction<AlertBarProps>) => {
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