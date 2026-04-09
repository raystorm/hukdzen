import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {emptyBox, initialBoxState, Box} from "./boxTypes";

const boxSlice = createSlice({
    name: 'box',
    initialState: initialBoxState,
    reducers: {
      getBoxById: (state, action: PayloadAction<string>) => { state.error = null; },
      setBox:     (state, action: PayloadAction<Box>)  => { state.box = action.payload; state.error = null; },
      createBox:  (state, action: PayloadAction<Box>)  => { state.error = null; },
      updateBox:  (state, action: PayloadAction<Box>)  => { state.error = null; },
      removeBox:  (state, action: PayloadAction<Box>)  => { state.error = null; },
      
      getBoxByIdSuccess:  (state, action: PayloadAction<Box>)  => { state.box = action.payload; state.error = null; },
      getBoxByIdFailure:  (state, action: PayloadAction<string>) => { state.error = action.payload; },
      
      createBoxSuccess:   (state, action: PayloadAction<Box>)  => { state.box = action.payload; state.error = null; },
      createBoxFailure:   (state, action: PayloadAction<string>) => { state.error = action.payload; },
      
      updateBoxSuccess:   (state, action: PayloadAction<Box>)  => { state.box = action.payload; state.error = null; },
      updateBoxFailure:   (state, action: PayloadAction<string>) => { state.error = action.payload; },
      
      removeBoxSuccess:   (state, action: PayloadAction<Box>)  => { state.box = emptyBox; state.error = null; },
      removeBoxFailure:   (state, action: PayloadAction<string>) => { state.error = action.payload; },
    }
});

export const { 
  actions: boxActions, 
  reducer: boxReducer, 
} = boxSlice;

export default boxSlice;