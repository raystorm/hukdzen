import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AlertBarProps} from "./AlertBar";
import {empyAlert} from "./AlertBarTypes";


//TODO: consider stacking messages
const alertBarSlice = createSlice({
   name: 'alertMessage',
   initialState: empyAlert,
   reducers:  {
      DisplayAlertBox: (state, action: PayloadAction<AlertBarProps>) => { return state = { ...action.payload, open: true} },
      HideAlertBox:    (state) => { return empyAlert },
   }
});

export const { actions: alertBarActions, reducer: alertBarReducer, } = alertBarSlice;

export default alertBarSlice;