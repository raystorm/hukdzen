import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {emptyBox, initialBoxState, Box} from "./boxTypes";

const boxSlice = createSlice({
    name: 'box',
    initialState: initialBoxState,
    reducers: {
      getBoxById: (state, action: PayloadAction<string>) => { state.error = undefined; },
      setBox:     (state, action: PayloadAction<Box>) => { return action.payload },
      createBox:  (state, action: PayloadAction<Box>) => { state.error = undefined; },
      updateBox:  (state, action: PayloadAction<Box>) => { state.error = undefined; },
      removeBox:  (state, action: PayloadAction<Box>) => { state.error = undefined; },
      
      getBoxByIdSuccess:  (state, action: PayloadAction<Box>)    => { return action.payload },
      getBoxByIdFailure:  (state, action: PayloadAction<string>) => { state.error = action.payload; },
      
      createBoxSuccess:   (state, action: PayloadAction<Box>)    => { return action.payload; },
      createBoxFailure:   (state, action: PayloadAction<string>) => { state.error = action.payload; },
      
      updateBoxSuccess:   (state, action: PayloadAction<Box>)    => { return action.payload; },
      updateBoxFailure:   (state, action: PayloadAction<string>) => { state.error = action.payload; },
      
      removeBoxSuccess:   (state, action: PayloadAction<Box>)    => { return emptyBox;  },
      removeBoxFailure:   (state, action: PayloadAction<string>) => { state.error = action.payload; },
    }
});

export const { 
  actions: boxActions, 
  reducer: boxReducer, 
} = boxSlice;

export default boxSlice;