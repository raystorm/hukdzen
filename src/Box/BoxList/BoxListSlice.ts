import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import { emptyBoxList } from "./BoxListType";
import {boxActions} from "../boxSlice";
import {Xbiis} from "../boxTypes";

const BoxListSlice = createSlice({
    name: 'boxList',
    initialState: emptyBoxList,
    reducers: {
      getAllBoxes:  (state) => { return state; },
      setAllBoxes:  (state, action) => { return action.payload; },
      addBox:       (state, action: PayloadAction<Xbiis>) => { state.items.push(action.payload); },
    },
    extraReducers: (builder) =>
    {
       builder
         /*
         .addCase(boxActions.createBox,
                  (state, action) => {
                     state.items.push(action.payload);
                     return state;
                  })
         */
         .addCase(boxActions.updateBox,
                  (state, action: PayloadAction<Xbiis>) => {
                     const index = state.items.findIndex(box => box.id ===action.payload.id);
                     if ( -1 < index ) { state.items[index] = action.payload }
                     return state;
                  })
    }
    /*
    {
      createBox: (state, action) => {
         state.items.push(action.payload);
         return state
      },
    }
    */
});

export const {
  actions: boxListActions,
  reducer: boxListReducer,
} = BoxListSlice;

export default BoxListSlice;