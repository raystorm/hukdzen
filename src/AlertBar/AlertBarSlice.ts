import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AlertBarProps} from "./AlertBar";
import {emptyAlert} from "./AlertBarTypes";


//TODO: consider stacking messages, https://github.com/iamhosseindhv/notistack
const alertBarSlice = createSlice({
   name: 'alertMessage',
   initialState: emptyAlert,
   reducers:  {
      DisplayAlertBox: (state, action: PayloadAction<AlertBarProps>) => { return { ...action.payload, open: true} },
      HideAlertBox:    (state) => { return emptyAlert },
   }
});

export const { actions: alertBarActions, reducer: alertBarReducer, } = alertBarSlice;

export default alertBarSlice;